import React, { useState, useEffect, useMemo } from "react";
import { Board } from "@/api/entities/Board";
import { Item } from "@/api/entities/Item";
import { Sprint } from "@/api/entities/Sprint";
import { UserStory } from "@/api/entities/UserStory";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Target, Clock, Activity,
  CheckCircle2, Download, Users, Zap, ArrowUpDown,
  AlertCircle, RefreshCw
} from "lucide-react";
import { subDays, isAfter, isBefore } from 'date-fns';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  calculateSprintVelocity,
  calculateBurndown,
  calculateSprintBurndown,
  calculateTaskChurn,
  calculateTeamMetrics,
  calculateCycleTime,
  exportToCSV,
} from "@/components/utils/analytics";

// ── Chart color palette (HSL token-aligned, no hex) ──
const CHART_COLORS = [
  'hsl(217, 91%, 60%)',   // blue
  'hsl(142, 71%, 45%)',   // green
  'hsl(38, 92%, 50%)',    // amber
  'hsl(0, 84%, 60%)',     // red
  'hsl(262, 83%, 58%)',   // purple
  'hsl(192, 91%, 36%)',   // cyan
  'hsl(0, 0%, 64%)',      // gray
];

const STATUS_CHART_COLORS = {
  todo: 'hsl(0, 0%, 64%)',
  'not started': 'hsl(0, 0%, 64%)',
  working: 'hsl(38, 92%, 50%)',
  'working on it': 'hsl(38, 92%, 50%)',
  'in progress': 'hsl(38, 92%, 50%)',
  done: 'hsl(142, 71%, 45%)',
  completed: 'hsl(142, 71%, 45%)',
  stuck: 'hsl(0, 84%, 60%)',
};

const PRIORITY_CHART_COLORS = {
  critical: 'hsl(0, 84%, 60%)',
  high: 'hsl(38, 92%, 50%)',
  medium: 'hsl(217, 91%, 60%)',
  low: 'hsl(0, 0%, 64%)',
};

function getStatusChartColor(status) {
  return STATUS_CHART_COLORS[status?.toLowerCase()] || 'hsl(0, 0%, 64%)';
}
function getPriorityChartColor(priority) {
  return PRIORITY_CHART_COLORS[priority?.toLowerCase()] || 'hsl(0, 0%, 64%)';
}

// ── Custom Tooltip ──
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border shadow-sm rounded-md p-2 text-sm">
      {label && <p className="font-medium text-foreground mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="text-xs">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [boards, setBoards] = useState([]);
  const [items, setItems] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      // Load each source independently so one failure doesn't block the rest
      const [boardsData, itemsData, sprintsData, storiesData] = await Promise.all([
        Board.list("-updated_date").catch((err) => { console.error("Board.list failed:", err); return []; }),
        Item.list("-updated_date").catch((err) => { console.error("Item.list failed:", err); return []; }),
        Sprint.list("-start_date").catch(() => []),
        UserStory.list("-created_date").catch(() => []),
      ]);
      setBoards(boardsData || []);
      setItems(itemsData || []);
      setSprints(sprintsData || []);
      setStories(storiesData || []);
      // Only show error if everything failed
      if ((!boardsData || boardsData.length === 0) && (!itemsData || itemsData.length === 0)) {
        setLoadError(true);
      }
    } catch (error) {
      console.error("Error loading analytics data:", error);
      setLoadError(true);
    }
    setIsLoading(false);
  };

  // ── Filtering ──
  const filteredItems = useMemo(() => items.filter(item => {
    if (selectedBoard !== 'all' && item.board_id !== selectedBoard) return false;
    const cutoff = subDays(new Date(), parseInt(selectedTimeRange));
    return isAfter(new Date(item.updated_date), cutoff);
  }), [items, selectedBoard, selectedTimeRange]);

  const filteredBoards = selectedBoard === 'all' ? boards : boards.filter(b => b.id === selectedBoard);

  // ── KPI Calculations ──
  const kpi = useMemo(() => {
    const totalTasks = filteredItems.length;
    const completedTasks = filteredItems.filter(item => {
      const board = boards.find(b => b.id === item.board_id);
      const statusCol = board?.columns?.find(col => col.type === 'status');
      const status = item.data?.[statusCol?.id] || item.data?.status || '';
      return status.toLowerCase() === 'done' || status.toLowerCase() === 'completed';
    }).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const overdueTasks = filteredItems.filter(item => {
      const board = boards.find(b => b.id === item.board_id);
      const dateCol = board?.columns?.find(col => col.type === 'date');
      const statusCol = board?.columns?.find(col => col.type === 'status');
      const dueDate = item.data?.[dateCol?.id];
      const status = item.data?.[statusCol?.id] || item.data?.status || '';
      if (!dueDate || status.toLowerCase() === 'done') return false;
      return isBefore(new Date(dueDate), new Date());
    }).length;

    return { totalTasks, completedTasks, completionRate, overdueTasks };
  }, [filteredItems, boards]);

  // ── Distributions ──
  const statusDistribution = useMemo(() => {
    const dist = {};
    filteredItems.forEach(item => {
      const board = boards.find(b => b.id === item.board_id);
      const statusCol = board?.columns?.find(col => col.type === 'status');
      const status = item.data?.[statusCol?.id] || item.data?.status || 'Not Started';
      dist[status] = (dist[status] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({
      name,
      value,
      color: getStatusChartColor(name),
    }));
  }, [filteredItems, boards]);

  const priorityDistribution = useMemo(() => {
    const dist = {};
    filteredItems.forEach(item => {
      const board = boards.find(b => b.id === item.board_id);
      const priorityCol = board?.columns?.find(col => col.type === 'priority');
      const priority = item.data?.[priorityCol?.id] || item.data?.priority || 'Medium';
      dist[priority] = (dist[priority] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({
      name,
      value,
      color: getPriorityChartColor(name),
    }));
  }, [filteredItems, boards]);

  // ── Board Performance ──
  const boardStats = useMemo(() => filteredBoards.map(board => {
    const boardItems = filteredItems.filter(item => item.board_id === board.id);
    const statusCol = board.columns?.find(col => col.type === 'status');
    const completed = boardItems.filter(item => {
      const s = item.data?.[statusCol?.id] || '';
      return s.toLowerCase() === 'done' || s.toLowerCase() === 'completed';
    }).length;
    const total = boardItems.length;
    return {
      ...board,
      totalTasks: total,
      completedTasks: completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }), [filteredItems, filteredBoards]);

  // ── Sprint Velocity ──
  const sprintVelocityData = useMemo(() => calculateSprintVelocity(sprints), [sprints]);

  // ── Burndown ──
  const burndownData = useMemo(() => {
    const activeSprint = sprints.find(s => s.status === 'active');
    if (activeSprint?.start_date && activeSprint?.end_date) {
      const sprintStories = stories.filter(s => s.sprint_id === activeSprint.id);
      if (sprintStories.length > 0) return calculateSprintBurndown(sprintStories, activeSprint.start_date, activeSprint.end_date);
      return calculateBurndown(filteredItems, activeSprint.start_date, activeSprint.end_date);
    }
    return calculateBurndown(filteredItems, subDays(new Date(), 30), new Date());
  }, [filteredItems, sprints, stories]);

  // ── Task Churn ──
  const churnData = useMemo(() => calculateTaskChurn(filteredItems), [filteredItems]);

  // ── Team Performance ──
  const teamData = useMemo(() => {
    if (selectedBoard !== 'all') {
      const board = boards.find(b => b.id === selectedBoard);
      if (board) return calculateTeamMetrics(filteredItems, board);
    }
    return boards.flatMap(board => {
      const boardItems = filteredItems.filter(i => i.board_id === board.id);
      return calculateTeamMetrics(boardItems, board);
    }).reduce((acc, member) => {
      const existing = acc.find(m => m.owner === member.owner);
      if (existing) {
        existing.assigned += member.assigned;
        existing.completed += member.completed;
        existing.inProgress += member.inProgress;
        existing.completionRate = existing.assigned > 0 ? (existing.completed / existing.assigned) * 100 : 0;
      } else {
        acc.push({ ...member });
      }
      return acc;
    }, []);
  }, [filteredItems, boards, selectedBoard]);

  // ── Cycle Time ──
  const cycleTime = useMemo(() => calculateCycleTime(filteredItems), [filteredItems]);

  // ── Sprint Comparison — planned capacity vs actual completed points ──
  const sprintComparisonData = useMemo(() => {
    return sprints
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      .map(s => {
        const planned = s.capacity ?? 0;
        const actual = s.completed_points ?? 0;
        const completion = planned > 0 ? Math.round((actual / planned) * 100) : null;
        return {
          sprint: s.title || `Sprint ${s.id.slice(0, 6)}`,
          planned,
          actual,
          completion,
        };
      });
  }, [sprints]);

  // ── Export ──
  const handleExport = () => {
    const exportData = filteredItems.map(item => {
      const board = boards.find(b => b.id === item.board_id);
      const statusCol = board?.columns?.find(c => c.type === 'status');
      const priorityCol = board?.columns?.find(c => c.type === 'priority');
      return {
        title: item.title,
        board: board?.title || '',
        status: item.data?.[statusCol?.id] || '',
        priority: item.data?.[priorityCol?.id] || '',
        created: item.created_date,
        updated: item.updated_date,
      };
    });
    exportToCSV(exportData, 'agileflow-analytics.csv');
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-7 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-28 bg-muted rounded-lg" />
              ))}
            </div>
            <div className="h-72 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Failed to load analytics</h2>
            <p className="text-sm text-muted-foreground">There was a problem fetching your data.</p>
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state when no boards or items exist
  const hasNoData = boards.length === 0 && items.length === 0;
  if (hasNoData) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No data available for analytics</h3>
            <p className="text-sm text-muted-foreground max-w-sm">Create boards and add items to get started.</p>
          </div>
        </div>
      </div>
    );
  }

  // Shared chart axis/grid props
  const axisStyle = { fontSize: 12, fill: 'hsl(var(--muted-foreground))' };
  const gridStyle = { stroke: 'hsl(0, 0%, 90%)', strokeDasharray: '3 3' };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Insights and metrics across your boards and sprints
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedBoard} onValueChange={setSelectedBoard}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boards</SelectItem>
                {boards.map(board => (
                  <SelectItem key={board.id} value={board.id}>{board.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {/* Total Tasks */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Tasks</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{kpi.totalTasks}</div>
            <p className="text-sm text-muted-foreground mt-1">Active tasks tracked</p>
          </div>

          {/* Completion Rate */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Completion Rate</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{kpi.completionRate}%</div>
            <Progress value={kpi.completionRate} className="mt-2" />
          </div>

          {/* Overdue Tasks */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Overdue Tasks</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{kpi.overdueTasks}</div>
            <p className={`text-sm mt-1 ${kpi.overdueTasks > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {kpi.overdueTasks > 0 ? 'Need attention' : 'All on track'}
            </p>
          </div>

          {/* Avg Cycle Time */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg Cycle Time</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{cycleTime.average.toFixed(1)}d</div>
            <p className="text-sm text-muted-foreground mt-1">Creation to completion</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="velocity">Velocity</TabsTrigger>
            <TabsTrigger value="burndown">Burndown</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="churn">Churn</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution Pie */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Task Status Distribution
                </p>
                {statusDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-12 text-sm">No task data available</p>
                )}
              </div>

              {/* Priority Distribution Bar */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Priority Distribution
                </p>
                {priorityDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priorityDistribution}>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="name" tick={axisStyle} />
                      <YAxis allowDecimals={false} tick={axisStyle} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]}>
                        {priorityDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-12 text-sm">No priority data available</p>
                )}
              </div>
            </div>

            {/* Board Performance */}
            {selectedBoard === 'all' && boardStats.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Board Performance
                </p>
                <div className="space-y-3">
                  {boardStats.map(board => (
                    <div
                      key={board.id}
                      className="flex items-center justify-between p-4 bg-muted/40 rounded-lg transition-colors hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{board.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {board.completedTasks} of {board.totalTasks} tasks completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all duration-500 rounded-full"
                            style={{ width: `${board.completionRate}%` }}
                          />
                        </div>
                        <Badge variant="outline" className="min-w-[3rem] justify-center text-xs">
                          {board.completionRate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Sprint Velocity Tab ── */}
          <TabsContent value="velocity" className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Sprint Velocity
              </p>
              {sprintVelocityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sprintVelocityData}>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="sprint" tick={axisStyle} />
                    <YAxis
                      allowDecimals={false}
                      tick={axisStyle}
                      label={{ value: 'Story Points', angle: -90, position: 'insideLeft', style: axisStyle }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey="committed" fill="hsl(0, 0%, 64%)" name="Committed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" fill="hsl(142, 71%, 45%)" name="Completed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16">
                  <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base font-medium text-foreground mb-1">No Sprint Data Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete sprints to see velocity trends. Go to Backlog to plan and run sprints.
                  </p>
                </div>
              )}
            </div>

            {/* Average Velocity Cards */}
            {sprintVelocityData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-card p-5 border-l-4 border-l-green-500">
                  <p className="text-sm text-muted-foreground">Average Velocity</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {Math.round(sprintVelocityData.reduce((s, d) => s + d.completed, 0) / sprintVelocityData.length)} SP
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-5 border-l-4 border-l-blue-500">
                  <p className="text-sm text-muted-foreground">Commitment Accuracy</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {Math.round(
                      (sprintVelocityData.reduce((s, d) => s + d.completed, 0) /
                        Math.max(1, sprintVelocityData.reduce((s, d) => s + d.committed, 0))) * 100
                    )}%
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-5 border-l-4 border-l-purple-500">
                  <p className="text-sm text-muted-foreground">Sprints Completed</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">{sprintVelocityData.length}</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Burndown Tab ── */}
          <TabsContent value="burndown" className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Burndown Chart
              </p>
              {burndownData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={burndownData}>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="day" tick={axisStyle} />
                    <YAxis
                      allowDecimals={false}
                      tick={axisStyle}
                      label={{ value: 'Remaining', angle: -90, position: 'insideLeft', style: axisStyle }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ideal"
                      stroke="hsl(0, 0%, 64%)"
                      strokeDasharray="5 5"
                      name="Ideal"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="remaining"
                      stroke="hsl(217, 91%, 60%)"
                      name="Actual"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(217, 91%, 60%)', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12 text-sm">No burndown data available</p>
              )}
            </div>
          </TabsContent>

          {/* ── Team Performance Tab ── */}
          <TabsContent value="team" className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Team Performance Distribution
              </p>
              {teamData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teamData}>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="owner" tick={axisStyle} />
                      <YAxis allowDecimals={false} tick={axisStyle} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend />
                      <Bar dataKey="assigned" fill="hsl(217, 91%, 60%)" name="Assigned" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="hsl(142, 71%, 45%)" name="Completed" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="inProgress" fill="hsl(38, 92%, 50%)" name="In Progress" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 space-y-3">
                    {teamData.filter(m => m.owner !== 'Unassigned').map((member, i) => (
                      <div key={i} className="p-4 bg-muted/40 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                              {member.owner.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-foreground">{member.owner}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {member.completionRate.toFixed(0)}% completion
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Assigned</p>
                            <p className="font-semibold text-foreground">{member.assigned}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Completed</p>
                            <p className="font-semibold text-green-500">{member.completed}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">In Progress</p>
                            <p className="font-semibold" style={{ color: 'hsl(38, 92%, 50%)' }}>{member.inProgress}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Avg Days</p>
                            <p className="font-semibold text-foreground">{member.avgCompletionTime.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base font-medium text-foreground mb-1">No Team Data Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Assign tasks to team members to see performance distribution.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Task Churn Tab ── */}
          <TabsContent value="churn" className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" /> Task Churn (Mid-Sprint Scope Change)
              </p>
              {churnData.length > 0 && churnData.some(p => p.added > 0 || p.removed > 0) ? (
                <>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={churnData}>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="period" tick={axisStyle} />
                      <YAxis allowDecimals={false} tick={axisStyle} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend />
                      <Bar dataKey="added" fill="hsl(217, 91%, 60%)" name="Added Mid-Sprint" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="removed" fill="hsl(0, 84%, 60%)" name="Removed Mid-Sprint" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {churnData.map((period, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border border-border bg-card p-4 border-l-4 ${period.churn > 0 ? 'border-l-red-500' : period.churn < 0 ? 'border-l-green-500' : 'border-l-gray-400'}`}
                      >
                        <p className="text-xs text-muted-foreground">{period.period}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xl font-semibold text-foreground">
                            {period.churn > 0 ? '+' : ''}{period.churn}
                          </span>
                          <span className={`text-xs ${period.churn > 0 ? 'text-red-500' : period.churn < 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {period.churn > 0 ? 'scope creep' : period.churn < 0 ? 'scope reduced' : 'no change'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          +{period.added} added / -{period.removed} removed
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <ArrowUpDown className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base font-medium text-foreground mb-1">No Churn Data Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Task churn tracks scope changes during sprints. Add tasks to boards and run sprints to see churn metrics.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
