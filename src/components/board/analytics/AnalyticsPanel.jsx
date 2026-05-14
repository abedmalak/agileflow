import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Calendar, Target, Clock, Inbox } from "lucide-react";
import { format } from 'date-fns';
import InfoTooltip from "@/components/common/InfoTooltip";
import ModuleHelp from "@/components/common/ModuleHelp";
import { AIExplainButton } from "@/components/ai/AIExplainButton";

export default function AnalyticsPanel({ board, items, onClose }) {
  // Calculate analytics data
  const statusColumn = board?.columns?.find(col => col.type === 'status');
  const priorityColumn = board?.columns?.find(col => col.type === 'priority');
  const peopleColumn = board?.columns?.find(col => col.type === 'people' || col.type === 'person');
  const dueDateColumn = board?.columns?.find(col => col.type === 'date');

  // Status distribution
  const statusStats = {};
  if (statusColumn?.options?.choices) {
    statusColumn.options.choices.forEach(choice => {
      statusStats[choice.label] = items.filter(item => item.data?.[statusColumn.id] === choice.label).length;
    });
  }

  // Priority distribution
  const priorityStats = {};
  if (priorityColumn?.options?.choices) {
    priorityColumn.options.choices.forEach(choice => {
      priorityStats[choice.label] = items.filter(item => item.data?.[priorityColumn.id] === choice.value).length;
    });
  }

  // People workload
  const peopleStats = {};
  if (peopleColumn) {
    items.forEach(item => {
      const person = item.data?.[peopleColumn.id];
      if (person) {
        peopleStats[person] = (peopleStats[person] || 0) + 1;
      }
    });
  }

  // Overdue tasks
  const overdueTasks = items.filter(item => {
    const dueDate = item.data?.[dueDateColumn?.id];
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && item.data?.[statusColumn?.id] !== 'Done';
  });

  // Completion rate
  const completedTasks = items.filter(item => item.data?.[statusColumn?.id] === 'Done').length;
  const completionRate = items.length > 0 ? Math.round((completedTasks / items.length) * 100) : 0;

  // Recent activity (mock data based on updated_date)
  const recentActivity = items
    .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
    .slice(0, 5);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-2xl shadow-sm max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Board Analytics</h2>
              <p className="text-muted-foreground">Insights and statistics for {board?.title}</p>
            </div>
            {items.length > 0 && (
              <AIExplainButton
                widgetTitle="Board Analytics"
                widgetData={{
                  totalTasks: items.length,
                  completionRate,
                  overdueCount: overdueTasks.length,
                  statusDistribution: statusStats,
                  priorityDistribution: priorityStats,
                }}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <ModuleHelp moduleKey="analytics" />
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-xl font-bold w-8 h-8 flex items-center justify-center hover:bg-muted rounded-full"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 ? (
            <Card className="md:col-span-3">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No data to analyze yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">Add items to your board to see analytics.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
          <>
          {/* Overview Cards */}
          <Card className="bg-blue-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Total Tasks
                <InfoTooltip text="Total number of items currently on this board" iconClassName="text-blue-100" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{items.length}</div>
              <p className="text-blue-100">Active items in board</p>
            </CardContent>
          </Card>

          <Card className="bg-green-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Completion Rate
                <InfoTooltip text="Percentage of tasks marked as 'Done' out of all tasks on this board" iconClassName="text-green-100" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2 bg-green-300" />
            </CardContent>
          </Card>

          <Card className="bg-red-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Overdue Tasks
                <InfoTooltip text="Tasks with a due date in the past that haven't been completed yet" iconClassName="text-red-100" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overdueTasks.length}</div>
              <p className="text-red-100">Need immediate attention</p>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          {Object.keys(statusStats).length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Status Distribution
                  <InfoTooltip text="How tasks are spread across different statuses like Not Started, Working, Done, and Stuck" />
                </CardTitle>
                <AIExplainButton widgetTitle="Status Distribution" widgetData={statusStats} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(statusStats).map(([status, count]) => {
                    const statusChoice = statusColumn?.options?.choices?.find(c => c.label === status);
                    const percentage = items.length > 0 ? Math.round((count / items.length) * 100) : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: statusChoice?.color || '#gray' }}
                          />
                          <span className="font-medium">{status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{count} tasks</span>
                          <Badge variant="outline">{percentage}%</Badge>
                          <InfoTooltip text="Percentage of total tasks in this status" size="xs" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* People Workload */}
          {Object.keys(peopleStats).length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Workload
                  <InfoTooltip text="Number of tasks assigned to each team member on this board" />
                </CardTitle>
                <AIExplainButton widgetTitle="Team Workload" widgetData={peopleStats} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(peopleStats).slice(0, 5).map(([person, count]) => (
                    <div key={person} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {person.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{person}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge>{count} tasks</Badge>
                        <InfoTooltip text="Tasks assigned to this team member" size="xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Priority Breakdown */}
          {Object.keys(priorityStats).length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Priority Distribution
                  <InfoTooltip text="Breakdown of tasks by urgency level — Critical items need immediate attention, while Low items can wait" />
                </CardTitle>
                <AIExplainButton widgetTitle="Priority Distribution" widgetData={priorityStats} />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(priorityStats).map(([priority, count]) => {
                    const priorityChoice = priorityColumn?.options?.choices?.find(c => c.label === priority);
                    return (
                      <div key={priority} className="text-center p-4 bg-muted rounded-lg">
                        <div 
                          className="w-4 h-4 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: priorityChoice?.color || '#gray' }}
                        />
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground">{priority}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                  <InfoTooltip text="The five most recently updated items on this board" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map(item => (
                    <div key={item.id} className="flex flex-col gap-1 p-2 bg-muted rounded">
                      <div className="font-medium text-sm truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Updated {format(new Date(item.updated_date), 'MMM d, HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          </>
          )}
        </div>
      </div>
    </div>
  );
}