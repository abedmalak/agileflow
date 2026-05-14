/**
 * Intelligent Task Assignment Engine
 * Formula: Suitability = w1 × Competency + w2 × Availability + w3 × Performance
 *
 * Competency: skill match based on historical task completion in similar categories
 * Availability: inverse of current workload (fewer active tasks = more available)
 * Performance: historical completion rate and on-time delivery
 */

const DEFAULT_WEIGHTS = { competency: 0.4, availability: 0.35, performance: 0.25 };

/**
 * Build team member profiles from items and board data.
 * Returns a map of member → {assigned, completed, inProgress, overdue, completedOnTime, totalTasks, categoryExperience}
 */
function buildMemberProfiles(items, board) {
  const statusColId = board?.columns?.find(c => c.type === 'status')?.id;
  const peopleColId = board?.columns?.find(c => c.type === 'people' || c.type === 'person')?.id;
  const priorityColId = board?.columns?.find(c => c.type === 'priority')?.id;
  const dateColId = board?.columns?.find(c => c.type === 'date')?.id;

  const profiles = {};

  items.forEach(item => {
    const owner = (peopleColId ? item.data?.[peopleColId] : null) || item.data?.owner;
    if (!owner || owner === 'Unassigned') return;

    if (!profiles[owner]) {
      profiles[owner] = {
        name: owner,
        assigned: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0,
        completedOnTime: 0,
        totalTasks: 0,
        categoryExperience: {},
      };
    }

    const p = profiles[owner];
    p.totalTasks++;

    const status = statusColId ? item.data?.[statusColId] : item.data?.status || '';
    const isDone = ['done', 'completed'].includes(status?.toLowerCase());
    const isActive = ['in progress', 'working on it', 'working'].includes(status?.toLowerCase());

    if (isDone) {
      p.completed++;
      const dueDate = dateColId ? item.data?.[dateColId] : null;
      if (dueDate && new Date(item.updated_date) <= new Date(dueDate)) {
        p.completedOnTime++;
      } else if (!dueDate) {
        p.completedOnTime++;
      }
    } else if (isActive) {
      p.inProgress++;
    }

    p.assigned = p.inProgress;

    // Track category experience (by priority or any grouping)
    const priority = priorityColId ? item.data?.[priorityColId] : item.data?.priority || 'medium';
    p.categoryExperience[priority] = (p.categoryExperience[priority] || 0) + (isDone ? 1 : 0);
  });

  return profiles;
}

/**
 * Calculate suitability score for a member for a given task.
 */
function calculateSuitability(memberProfile, taskPriority, maxWorkload, weights = DEFAULT_WEIGHTS) {
  // Competency: how much experience does this member have with this priority level?
  const categoryExp = memberProfile.categoryExperience[taskPriority] || 0;
  const totalCompleted = memberProfile.completed || 1;
  const competency = Math.min(1, categoryExp / Math.max(1, totalCompleted * 0.5));

  // Availability: inverse of current workload (0 active = 1.0, maxWorkload active = 0.0)
  const maxW = maxWorkload || 10;
  const availability = Math.max(0, 1 - (memberProfile.inProgress / maxW));

  // Performance: completion rate × on-time rate
  const completionRate = memberProfile.totalTasks > 0 ? memberProfile.completed / memberProfile.totalTasks : 0;
  const onTimeRate = memberProfile.completed > 0 ? memberProfile.completedOnTime / memberProfile.completed : 0;
  const performance = (completionRate + onTimeRate) / 2;

  const score = weights.competency * competency + weights.availability * availability + weights.performance * performance;

  return {
    score: Math.round(score * 100) / 100,
    competency: Math.round(competency * 100) / 100,
    availability: Math.round(availability * 100) / 100,
    performance: Math.round(performance * 100) / 100,
  };
}

/**
 * Get AI task assignment suggestions for a task.
 * Returns ranked list of team members with suitability scores.
 */
export function getAssignmentSuggestions(items, board, taskPriority = 'medium', weights = DEFAULT_WEIGHTS) {
  const profiles = buildMemberProfiles(items, board);
  const members = Object.values(profiles);

  if (members.length === 0) return [];

  const maxWorkload = Math.max(...members.map(m => m.inProgress), 5);

  return members
    .map(member => ({
      name: member.name,
      ...calculateSuitability(member, taskPriority, maxWorkload, weights),
      currentLoad: member.inProgress,
      totalCompleted: member.completed,
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Generate a human-readable summary of assignment recommendations.
 */
export function formatAssignmentSummary(suggestions, taskTitle) {
  if (suggestions.length === 0) {
    return "No team members found with task history. Assign tasks to team members to enable AI recommendations.";
  }

  const top = suggestions[0];
  const lines = [
    `**Recommended for "${taskTitle}":** ${top.name} (Score: ${(top.score * 100).toFixed(0)}%)`,
    '',
    '| Member | Score | Competency | Availability | Performance | Load |',
    '|--------|-------|------------|-------------|-------------|------|',
    ...suggestions.map(s =>
      `| ${s.name} | ${(s.score * 100).toFixed(0)}% | ${(s.competency * 100).toFixed(0)}% | ${(s.availability * 100).toFixed(0)}% | ${(s.performance * 100).toFixed(0)}% | ${s.currentLoad} active |`
    ),
    '',
    `*Formula: Score = 40% Competency + 35% Availability + 25% Performance*`,
  ];

  return lines.join('\n');
}

/**
 * Get sprint planning recommendations based on team capacity and backlog.
 */
export function getSprintRecommendations(stories, sprints, teamSize = 1) {
  const avgVelocity = calculateAverageVelocity(sprints);
  const recommendedCapacity = avgVelocity > 0 ? avgVelocity : teamSize * 10;

  const backlogStories = stories
    .filter(s => s.status === 'backlog' || !s.sprint_id)
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    });

  let runningPoints = 0;
  const recommended = [];
  for (const story of backlogStories) {
    if (runningPoints + (story.story_points || 0) <= recommendedCapacity) {
      recommended.push(story);
      runningPoints += story.story_points || 0;
    }
  }

  return {
    recommendedCapacity,
    avgVelocity,
    recommendedStories: recommended,
    totalPoints: runningPoints,
    remainingCapacity: recommendedCapacity - runningPoints,
  };
}

function calculateAverageVelocity(sprints) {
  const completed = sprints.filter(s => s.status === 'completed' && s.completed_points > 0);
  if (completed.length === 0) return 0;
  return Math.round(completed.reduce((sum, s) => sum + s.completed_points, 0) / completed.length);
}
