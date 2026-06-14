import { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboardCards/DashboardCards";
import DashboardTable from "@/components/dashboardCards/DashboardTable";
import DeadlineCard from "@/components/dashboardCards/DeadlineCard";
import OverdueCard from "@/components/dashboardCards/OverdueCard";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/types";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    api.dashboard.stats().then(setStats).catch(console.error);
  }, []);

  const firstName = user?.fullName.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto pt-8">
        <div className="mx-4">
          <header className="text-3xl font-semibold">
            Good Morning, {firstName}
          </header>
          <span className="text-sm text-[#8E9193]">
            Here's what happening with your projects today.
          </span>
        </div>

        <div className="mx-4 mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Tasks"
            value={String(stats.total)}
            icon="dashboard"
          />
          <DashboardCard
            title="Pending"
            value={String(stats.pending)}
            icon="clock"
            textColor="text-red-700"
            iconBgColor="bg-red-100"
            iconColor="text-red-700"
          />
          <DashboardCard
            title="In Progress"
            value={String(stats.inProgress)}
            icon="dotsHorizontal"
            textColor="text-yellow-700"
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-700"
          />
          <DashboardCard
            title="Completed"
            value={String(stats.completed)}
            icon="tasks"
            textColor="text-green-700"
            iconBgColor="bg-green-100"
            iconColor="text-green-700"
          />
        </div>

        <DashboardTable />

        <div className="mx-4 mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DeadlineCard />
            <OverdueCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
