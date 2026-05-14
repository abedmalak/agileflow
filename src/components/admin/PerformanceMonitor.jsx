import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Clock, 
  Database, 
  Users, 
  Zap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    activeUsers: 0,
    errorRate: 0,
    cacheHitRate: 0
  });

  useEffect(() => {
    // Simulate performance metrics (in production, get from monitoring service)
    const interval = setInterval(() => {
      setMetrics({
        pageLoadTime: Math.random() * 2000 + 500, // 500-2500ms
        apiResponseTime: Math.random() * 500 + 100, // 100-600ms
        memoryUsage: Math.random() * 40 + 30, // 30-70%
        activeUsers: Math.floor(Math.random() * 50 + 10),
        errorRate: Math.random() * 2, // 0-2%
        cacheHitRate: Math.random() * 20 + 75 // 75-95%
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value, thresholds) => {
    if (value < thresholds.good) return 'text-green-500';
    if (value < thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (value, thresholds) => {
    if (value < thresholds.good) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (value < thresholds.warning) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Performance Monitor</h2>
        <p className="text-muted-foreground">Real-time system metrics and health status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Page Load Time */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Page Load Time
              </span>
              {getStatusIcon(metrics.pageLoadTime, { good: 1000, warning: 2000 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getStatusColor(metrics.pageLoadTime, { good: 1000, warning: 2000 })}`}>
              {metrics.pageLoadTime.toFixed(0)}ms
            </div>
            <Progress 
              value={(metrics.pageLoadTime / 3000) * 100} 
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground mt-2">Target: {'<'}1000ms</p>
          </CardContent>
        </Card>

        {/* API Response Time */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                API Response
              </span>
              {getStatusIcon(metrics.apiResponseTime, { good: 200, warning: 400 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getStatusColor(metrics.apiResponseTime, { good: 200, warning: 400 })}`}>
              {metrics.apiResponseTime.toFixed(0)}ms
            </div>
            <Progress 
              value={(metrics.apiResponseTime / 600) * 100} 
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground mt-2">Target: {'<'}200ms</p>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Memory Usage
              </span>
              {getStatusIcon(metrics.memoryUsage, { good: 50, warning: 70 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getStatusColor(metrics.memoryUsage, { good: 50, warning: 70 })}`}>
              {metrics.memoryUsage.toFixed(1)}%
            </div>
            <Progress 
              value={metrics.memoryUsage} 
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground mt-2">Target: {'<'}50%</p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {metrics.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Currently online</p>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Error Rate
              </span>
              {getStatusIcon(metrics.errorRate, { good: 0.5, warning: 1.5 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getStatusColor(metrics.errorRate, { good: 0.5, warning: 1.5 })}`}>
              {metrics.errorRate.toFixed(2)}%
            </div>
            <Progress 
              value={(metrics.errorRate / 5) * 100} 
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground mt-2">Target: {'<'}0.5%</p>
          </CardContent>
        </Card>

        {/* Cache Hit Rate */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {metrics.cacheHitRate.toFixed(1)}%
            </div>
            <Progress 
              value={metrics.cacheHitRate} 
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground mt-2">Target: {'>'}80%</p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Enable React Query Caching</p>
              <p className="text-xs text-gray-600">Reduce API calls by 60% with smart caching</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Implement Virtual Scrolling</p>
              <p className="text-xs text-gray-600">Handle 10,000+ items without performance loss</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Code Splitting Active</p>
              <p className="text-xs text-gray-600">Components load on-demand, reducing initial bundle size</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}