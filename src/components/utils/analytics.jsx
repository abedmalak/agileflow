/**
 * Advanced analytics utilities for AgileFlow
 * Provides metrics calculation for boards, sprints, and team performance.
 */

import { format, differenceInDays, subDays, isAfter, isBefore, eachDayOfInterval, endOfDay } from 'date-fns';

// ─── Completion Trends ──────────────────────────────────────────────

/**
 * Calculate completion trends over time for a set of items.
 * Returns daily data points with total, completed, and completion rate.
 */
export function calculateCompletionTrend(items, dateField = 'updated_date', days = 30) {
  const now = new Date();
  const startDate = subDays(now, days);

  const grouped = items
    .filter(item => new Date(item[dateField]) >= startDate)
    .reduce((acc, item) => {
      const date = format(new Date(item[dateField]), 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = { total: 0, completed: 0 };
      acc[date].total++;
      if (isStatusDone(item)) acc[date].completed++;
      return acc;
    }, {});

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date: format(new Date(date), 'MMM d'),
      completionRate: Math.round((data.completed / data.total) * 100),
      total: data.total,
      completed: data.completed
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ─── Velocity ───────────────────────────────────────────────────────

/**
 * Calculate velocity (tasks completed per period).
 * Used for the bar chart showing weekly throughput.
 */
export function calculateVelocity(items, periodDays = 7) {
  const now = new Date();
  const periods = [];

  for (let i = 0; i < 4; i++) {
    const periodEnd = subDays(now, i * periodDays);
    const periodStart = subDays(periodEnd, periodDays);

    const completed = items.filter(item => {
      const itemDate = new Date(item.updated_date);
      return itemDate >= periodStart && itemDate <= periodEnd && isStatusDone(item);
    }).length;

    periods.unshift({
      period: `Week ${4 - i}`,
      completed,
      start: format(periodStart, 'MMM d'),
      end: format(periodEnd, 'MMM d'),
    });
  }

  return periods;
}

// ─── Sprint Velocity (Story-Point Based) ────────────────────────────

/**
 * Calculate sprint velocity from completed sprints.
 * Returns story points completed per sprint for the velocity chart.
 * Supports both `name` (legacy) and `title` sprint fields, and both
 * `committed_points` and `capacity` for the committed point count.
 */
export function calculateSprintVelocity(sprints) {
  const completed = sprints
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .map(sprint => ({
      sprint: sprint.title || sprint.name || 'Sprint',
      committed: sprint.committed_points ?? sprint.capacity ?? 0,
      completed: sprint.completed_points ?? 0,
    }));

  const totalCompleted = completed.reduce((sum, s) => sum + s.completed, 0);
  const avgVelocity = completed.length > 0 ? Math.round(totalCompleted / completed.length) : 0;

  return completed.map(s => ({ ...s, avgVelocity }));
}

// ─── Burndown Chart ─────────────────────────────────────────────────

/**
 * Calculate burndown chart data for a sprint or date range.
 * Returns array of {day, ideal, remaining} for LineChart.
 */
export function calculateBurndown(items, sprintStartDate, sprintEndDate) {
  const start = new Date(sprintStartDate);
  const end = new Date(sprintEndDate);
  const totalItems = items.length;
  const days = Math.max(1, differenceInDays(end, start));

  return eachDayOfInterval({ start, end }).map((date, index) => {
    const idealRemaining = Math.max(0, totalItems - (totalItems / days) * index);

    const dayEnd = endOfDay(date);
    const completedByDate = items.filter(item => {
      const itemDate = new Date(item.updated_date);
      return isBefore(itemDate, dayEnd) && isStatusDone(item);
    }).length;

    return {
      day: format(date, 'MMM d'),
      ideal: Math.round(idealRemaining),
      remaining: Math.max(0, totalItems - completedByDate),
    };
  });
}

/**
 * Calculate burndown from story points (for sprint backlog).
 */
export function calculateSprintBurndown(stories, sprintStartDate, sprintEndDate) {
  const start = new Date(sprintStartDate);
  const end = new Date(sprintEndDate);
  const totalPoints = stories.reduce((sum, s) => sum + (s.story_points || 0), 0);
  const days = Math.max(1, differenceInDays(end, start));

  return eachDayOfInterval({ start, end }).map((date, index) => {
    const idealRemaining = Math.max(0, totalPoints - (totalPoints / days) * index);

    const dayEnd = endOfDay(date);
    const completedPoints = stories
      .filter(s => s.updated_date && isBefore(new Date(s.updated_date), dayEnd) && s.status === 'done')
      .reduce((sum, s) => sum + (s.story_points || 0), 0);

    return {
      day: format(date, 'MMM d'),
      ideal: Math.round(idealRemaining),
      remaining: Math.max(0, totalPoints - completedPoints),
    };
  });
}

// ─── Team Metrics ───────────────────────────────────────────────────

/**
 * Calculate per-member metrics from board items.
 * Returns array of {owner, assigned, completed, inProgress, completionRate, avgCompletionTime}.
 */
export function calculateTeamMetrics(items, board) {
  const peopleColumnId = board?.columns?.find(col => col.type === 'people' || col.type === 'person')?.id;
  const statusColumnId = board?.columns?.find(col => col.type === 'status')?.id;
  const memberMap = {};

  items.forEach(item => {
    const owner = (peopleColumnId ? item.data?.[peopleColumnId] : item.data?.owner) || 'Unassigned';
    const status = statusColumnId ? item.data?.[statusColumnId] : (item.data?.status || 'Not Started');

    if (!memberMap[owner]) {
      memberMap[owner] = { owner, assigned: 0, completed: 0, inProgress: 0, totalDays: 0, completedCount: 0 };
    }

    memberMap[owner].assigned++;

    if (isDone(status)) {
      memberMap[owner].completed++;
      if (item.created_date && item.updated_date) {
        memberMap[owner].totalDays += Math.max(1, differenceInDays(new Date(item.updated_date), new Date(item.created_date)));
        memberMap[owner].completedCount++;
      }
    } else if (isInProgress(status)) {
      memberMap[owner].inProgress++;
    }
  });

  return Object.values(memberMap).map(m => ({
    ...m,
    completionRate: m.assigned > 0 ? (m.completed / m.assigned) * 100 : 0,
    avgCompletionTime: m.completedCount > 0 ? m.totalDays / m.completedCount : 0,
  }));
}

// ─── Workload Distribution ──────────────────────────────────────────

export function calculateWorkloadDistribution(items, peopleColumnId) {
  const workload = {};

  items.forEach(item => {
    const assignee = item.data?.[peopleColumnId] || 'Unassigned';
    if (!workload[assignee]) {
      workload[assignee] = { total: 0, completed: 0, inProgress: 0, todo: 0 };
    }
    workload[assignee].total++;

    const status = item.data?.status || item.status || 'todo';
    if (isDone(status)) workload[assignee].completed++;
    else if (isInProgress(status)) workload[assignee].inProgress++;
    else workload[assignee].todo++;
  });

  return workload;
}

// ─── Priority Health ────────────────────────────────────────────────

/**
 * Calculate priority distribution and overdue counts.
 * Returns {distribution, overdue, healthScore}.
 */
export function calculatePriorityHealth(items, board) {
  const priorityColumnId = board?.columns?.find(col => col.type === 'priority')?.id;
  const dateColumnId = board?.columns?.find(col => col.type === 'date')?.id;
  const statusColumnId = board?.columns?.find(col => col.type === 'status')?.id;

  const distribution = {};
  const overdue = {};

  items.forEach(item => {
    const priority = (priorityColumnId ? item.data?.[priorityColumnId] : item.data?.priority) || 'Medium';
    distribution[priority] = (distribution[priority] || 0) + 1;

    const dueDate = dateColumnId ? item.data?.[dateColumnId] : null;
    const status = statusColumnId ? item.data?.[statusColumnId] : item.data?.status;

    if (dueDate && !isDone(status) && isBefore(new Date(dueDate), new Date())) {
      overdue[priority] = (overdue[priority] || 0) + 1;
    }
  });

  // Health score: 100 minus penalty for overdue items (weighted by priority)
  const weights = { critical: 10, high: 5, medium: 2, low: 1 };
  const totalPenalty = Object.entries(overdue).reduce((sum, [priority, count]) => {
    return sum + (weights[priority.toLowerCase()] || 1) * count;
  }, 0);
  const healthScore = Math.max(0, Math.min(100, 100 - totalPenalty));

  return { distribution, overdue, healthScore };
}

// ─── Task Churn ─────────────────────────────────────────────────────

/**
 * Calculate task churn: tasks added and removed mid-sprint.
 * Positive churn = scope creep (more added than removed).
 * Negative churn = scope reduction (more removed/completed than added).
 */
export function calculateTaskChurn(items, periodDays = 7, periodsCount = 4) {
  const now = new Date();
  const periods = [];

  for (let i = 0; i < periodsCount; i++) {
    const periodEnd = subDays(now, i * periodDays);
    const periodStart = subDays(periodEnd, periodDays);

    const added = items.filter(item => {
      const created = new Date(item.created_date);
      return isAfter(created, periodStart) && isBefore(created, periodEnd);
    }).length;

    // Tasks resolved/completed during the period (scope leaving the sprint)
    const removed = items.filter(item => {
      const updated = new Date(item.updated_date);
      return isAfter(updated, periodStart) && isBefore(updated, periodEnd) && isStatusDone(item);
    }).length;

    periods.unshift({
      period: `Week ${periodsCount - i}`,
      added,
      removed,
      churn: added - removed,
    });
  }

  return periods;
}

// ─── Cycle Time ─────────────────────────────────────────────────────

/**
 * Calculate cycle time (days from creation to completion) for done items.
 */
export function calculateCycleTime(items) {
  const cycleTimes = items
    .filter(item => isStatusDone(item) && item.created_date)
    .map(item => ({
      itemId: item.id,
      title: item.title,
      days: Math.max(1, differenceInDays(new Date(item.updated_date), new Date(item.created_date))),
    }));

  const average = cycleTimes.length > 0
    ? cycleTimes.reduce((sum, ct) => sum + ct.days, 0) / cycleTimes.length
    : 0;

  return { average, items: cycleTimes };
}

// ─── CSV Export ──────────────────────────────────────────────────────

/**
 * Export data as CSV file download.
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Performance Tracker ────────────────────────────────────────────

export class PerformanceTracker {
  constructor() {
    this.metrics = new Map();
  }

  startTracking(metricName) {
    this.metrics.set(metricName, { startTime: performance.now(), endTime: null, duration: null });
  }

  endTracking(metricName) {
    const metric = this.metrics.get(metricName);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      return metric.duration;
    }
    return null;
  }

  getMetric(metricName) {
    return this.metrics.get(metricName);
  }

  getAllMetrics() {
    const results = {};
    this.metrics.forEach((value, key) => { results[key] = value.duration; });
    return results;
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const performanceTracker = new PerformanceTracker();

// ─── Helpers ────────────────────────────────────────────────────────

function isStatusDone(item) {
  const s = item.data?.status || item.status || '';
  return isDone(s);
}

function isDone(status) {
  const s = (status || '').toLowerCase();
  return s === 'done' || s === 'completed';
}

function isInProgress(status) {
  const s = (status || '').toLowerCase();
  return s === 'in progress' || s === 'in_progress' || s === 'working on it' || s === 'working';
}
