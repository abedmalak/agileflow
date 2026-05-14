
import React, { useState, useEffect } from "react";
import { Board } from "@/api/entities/Board";
import { Item } from "@/api/entities/Item";
import { User } from "@/api/entities/User";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/lib/error-utils";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Folder, BarChart3, ArrowRight, AlertTriangle, RefreshCw, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/api/supabaseClient";
import InfoTooltip from "@/components/common/InfoTooltip";
import ModuleHelp from "@/components/common/ModuleHelp";

import StatsOverview from "../components/dashboard/StatsOverview";
import RecentBoards from "../components/dashboard/RecentBoards";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetail, setErrorDetail] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setHasError(false);
    setErrorDetail('');

    // User profile failure is non-fatal
    User.me()
      .then(setUser)
      .catch(() => {});

    try {
      const [boardsData, itemsData] = await Promise.all([
        Board.list("-updated_date", 10).catch((err) => {
          console.error("Board.list failed:", err);
          throw err;
        }),
        Item.list("-updated_date", 20).catch(() => []),
      ]);
      setBoards(boardsData || []);
      setItems(itemsData || []);
    } catch (error) {
      console.error("Dashboard data load failed:", error);
      setHasError(true);
      setErrorDetail(error?.message || error?.code || String(error));
    }

    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleCreateBoard = async (boardData) => {
    try {
      const newBoard = await Board.create(boardData);
      setBoards(prev => [newBoard, ...prev]);
    } catch (error) {
      console.error("Error creating board:", error);
      showErrorToast(toast, "Creation failed", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const pendingTasks = items.filter(item => !item.data?.status || item.data?.status !== 'done').length;

  if (!isLoading && hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-sm px-6">
          <div className="flex justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Failed to load dashboard</h2>
          <p className="text-sm text-muted-foreground">
            There was a problem loading your data. This can happen if the database tables
            haven&apos;t been set up yet, or if your session has expired.
          </p>
          {errorDetail && (
            <p className="text-xs text-muted-foreground bg-muted p-2 rounded-md font-mono break-all">
              {errorDetail}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={loadDashboardData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome/Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1 mb-8"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'there'}
            </h1>
            <ModuleHelp moduleKey="dashboard" />
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {pendingTasks > 0
              ? `You have ${pendingTasks} task${pendingTasks === 1 ? '' : 's'} pending.`
              : "Everything is up to date."}
            {pendingTasks > 0 && (
              <InfoTooltip
                text="Pending tasks include everything not marked as 'Done' — items that are not started, in progress, or stuck."
                size="xs"
              />
            )}
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link to={createPageUrl("Boards")}>
              <InfoTooltip
                text="Go to the full board listing where you can create, search, and manage all your boards"
                side="bottom"
                variant="info"
                size="xs"
              />
              <Button>
                <Folder className="w-4 h-4 mr-2" />
                View All Boards
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link to={createPageUrl("Analytics")}>
              <InfoTooltip
                text="See performance metrics, trends, and insights across all your projects"
                side="bottom"
                variant="info"
                size="xs"
              />
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <StatsOverview
          boards={boards}
          items={items}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid xl:grid-cols-4 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-3 space-y-8">
            <RecentBoards
              boards={boards}
              isLoading={isLoading}
              onCreateBoard={handleCreateBoard}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <QuickActions onCreateBoard={handleCreateBoard} />
            <ActivityFeed
              items={items.slice(0, 5)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
