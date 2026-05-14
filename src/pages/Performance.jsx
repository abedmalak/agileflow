import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Database,
  Zap,
  Shield,
  Activity,
  TrendingUp
} from "lucide-react";

import PerformanceMonitor from "../components/admin/PerformanceMonitor";

export default function PerformancePage() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="w-8 h-8 text-foreground" />
            System Performance & Scalability
          </h1>
          <p className="text-muted-foreground mt-2">Monitor system health and optimization metrics</p>
        </div>

        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="capacity">Capacity</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <PerformanceMonitor />
          </TabsContent>

          <TabsContent value="capacity" className="space-y-6">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Server className="w-5 h-5" />
                  Current System Capacity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Expected Capacity (Supabase Platform)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border bg-muted/40 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Concurrent Users</span>
                        <span className="text-2xl font-bold text-foreground">100-500</span>
                      </div>
                      <p className="text-xs text-muted-foreground">With current infrastructure</p>
                    </div>

                    <div className="p-4 border border-border bg-muted/40 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Database Records</span>
                        <span className="text-2xl font-bold text-foreground">100K+</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Boards, items, events</p>
                    </div>

                    <div className="p-4 border border-border bg-muted/40 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">API Requests/Min</span>
                        <span className="text-2xl font-bold text-foreground">1000+</span>
                      </div>
                      <p className="text-xs text-muted-foreground">With caching enabled</p>
                    </div>

                    <div className="p-4 border border-border bg-muted/40 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Response Time</span>
                        <span className="text-2xl font-bold text-foreground">{'<'}200ms</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Average API response</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-4">Scaling Strategy</h3>
                  <div className="space-y-3">
                    {[
                      { step: '1', label: '0-100 Users (Current)',    desc: 'Standard Supabase infrastructure, client-side caching' },
                      { step: '2', label: '100-500 Users',            desc: 'Enable React Query caching, optimize database queries, implement pagination' },
                      { step: '3', label: '500-2000 Users',           desc: 'Add CDN, implement virtual scrolling, enable backend caching layer' },
                      { step: '4', label: '2000+ Users (Enterprise)', desc: 'Dedicated infrastructure, load balancing, database replication, microservices' },
                    ].map((item) => (
                      <div key={item.step} className="p-4 border border-border bg-card rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-foreground font-bold text-sm">{item.step}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">{item.label}</h4>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Zap className="w-5 h-5" />
                  Performance Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Already Implemented</h3>
                  <div className="space-y-2">
                    {[
                      'React Query for data fetching and caching',
                      'Lazy loading with React.lazy() and Suspense',
                      'Debounced search and input handlers',
                      'Optimistic UI updates',
                      'Error boundaries for graceful failures',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Recommended for High Load</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm p-3 border border-border bg-muted/40 rounded-lg">
                      <Zap className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Virtual Scrolling</p>
                        <p className="text-xs text-muted-foreground">Render only visible items in long lists (1000+ items)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm p-3 border border-border bg-muted/40 rounded-lg">
                      <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Database Indexing</p>
                        <p className="text-xs text-muted-foreground">Index frequently queried fields (board_id, status, created_by)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm p-3 border border-border bg-muted/40 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Pagination</p>
                        <p className="text-xs text-muted-foreground">Load 50 items per page instead of all data at once</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm p-3 border border-border bg-muted/40 rounded-lg">
                      <Server className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">CDN for Static Assets</p>
                        <p className="text-xs text-muted-foreground">Serve images and files from CDN (Cloudflare, AWS CloudFront)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border bg-muted/40 rounded-lg">
                  <h4 className="font-medium text-sm text-foreground mb-2">Pro Tip</h4>
                  <p className="text-xs text-muted-foreground">
                    Monitor real user metrics (RUM) to identify actual bottlenecks.
                    Optimize based on data, not assumptions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="w-5 h-5" />
                  Security Measures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Row Level Security (RLS)', desc: 'Users can only access their own data and shared boards', icon: Shield },
                    { title: 'Input Sanitization',       desc: 'All user inputs are sanitized to prevent XSS attacks', icon: Shield },
                    { title: 'Rate Limiting',            desc: 'Prevents API abuse with request throttling', icon: Shield },
                    { title: 'Error Boundaries',         desc: 'Graceful error handling prevents data exposure', icon: Shield },
                  ].map((item) => (
                    <div key={item.title} className="p-4 border border-border bg-muted/40 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 border border-border bg-muted/40 rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Security Checklist</h4>
                  <div className="space-y-2">
                    {[
                      'HTTPS enabled for all connections',
                      'Authentication required for all routes',
                      'Role-based access control (Admin/User)',
                      'Activity logging for audit trails',
                      'Regular security updates',
                    ].map((item) => (
                      <label key={item} className="flex items-center gap-2 text-sm text-foreground">
                        <input type="checkbox" checked readOnly className="rounded" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
