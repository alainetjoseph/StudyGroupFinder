import React, { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import {
  Users,
  Activity,
  Layers,
  AlertTriangle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

const userGrowthData = [
  { date: "Mon", users: 20 },
  { date: "Tue", users: 35 },
  { date: "Wed", users: 50 },
  { date: "Thu", users: 45 },
  { date: "Fri", users: 70 },
  { date: "Sat", users: 90 },
  { date: "Sun", users: 120 }
];

const groupData = [
  { name: "Mon", groups: 5 },
  { name: "Tue", groups: 8 },
  { name: "Wed", groups: 6 },
  { name: "Thu", groups: 10 },
  { name: "Fri", groups: 14 },
  { name: "Sat", groups: 18 },
  { name: "Sun", groups: 22 }
];

export default function PlatformStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async (useCache = true) => {
    try {
      if (useCache) {
        const cachedData = sessionStorage.getItem("admin_platform_stats");
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          const now = new Date().getTime();
          // Cache valid for 5 minutes
          if (now - parsed.timestamp < 5 * 60 * 1000) {
            setStats(parsed.data);
            setLoading(false);
            return;
          }
        }
      }

      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/stats`);

      if (res.data.success) {
        setStats(res.data);
        sessionStorage.setItem("admin_platform_stats", JSON.stringify({
          data: res.data,
          timestamp: new Date().getTime()
        }));
        setError(null);
      } else {
        throw new Error(res.data.message || "Failed to fetch statistics");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchStats(false); // Don't use cache on auto-refresh
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="p-6 space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-muted mt-4">Loading analytics data...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="p-6 text-center space-y-4">
        <AlertTriangle className="mx-auto text-red-500 w-12 h-12" />
        <h2 className="text-xl font-bold">Failed to load platform stats</h2>
        <p className="text-muted">{error}</p>
        <button
          onClick={() => fetchStats(false)}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Safety fallback for totals
  const totals = stats?.totals || {
    users: 0,
    activeUsers: 0,
    groups: 0,
    reports: 0,
    messages: 0
  };

  // Safety fallback for growth
  const userGrowthData = stats?.growth?.users || [];
  const groupData = stats?.growth?.groups || [];

  return (
    <div className="p-6 space-y-6 text-foreground">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Platform Stats</h1>
          <p className="text-muted text-sm">
            Monitor platform growth and engagement
          </p>
        </div>
        <button
          onClick={() => fetchStats(false)}
          disabled={loading}
          className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <div className="flex items-center justify-between">
            <Users className="text-indigo-400" />
            <span className="text-xs text-green-400">Total</span>
          </div>
          <h2 className="text-2xl font-bold mt-3">{totals.users.toLocaleString()}</h2>
          <p className="text-muted text-sm">Total Users</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <div className="flex items-center justify-between">
            <Activity className="text-emerald-400" />
            <span className="text-xs text-green-400">Engaged</span>
          </div>
          <h2 className="text-2xl font-bold mt-3">{totals.activeUsers.toLocaleString()}</h2>
          <p className="text-muted text-sm">Active Users</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <div className="flex items-center justify-between">
            <AlertTriangle className="text-red-400" />
            <span className="text-xs text-red-400">Action Required</span>
          </div>
          <h2 className="text-2xl font-bold mt-3">{totals.reports}</h2>
          <p className="text-muted text-sm">Pending Reports</p>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* User Growth */}
        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <h3 className="text-sm mb-4 text-muted">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e1e2e", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#6366f1" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Users"
                stroke="#6366f1"
                strokeWidth={3}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Group Creation */}
        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <h3 className="text-sm mb-4 text-muted">Group Creation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={groupData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e1e2e", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#22c55e" }}
              />
              <Bar dataKey="count" name="Groups" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <h3 className="text-sm text-muted mb-2">Groups</h3>
          <p className="text-2xl font-bold">{totals.groups.toLocaleString()}</p>
          <p className="text-xs text-muted">Total Groups Created</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <h3 className="text-sm text-muted mb-2">Messages</h3>
          <p className="text-2xl font-bold">{totals.messages.toLocaleString()}</p>
          <p className="text-xs text-muted">Messages Sent</p>
        </div>

        {/* <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <h3 className="text-sm text-muted mb-2">Avg Engagement</h3>
          <p className="text-2xl font-bold">{stats?.engagement?.avgTime || 0}m</p>
          <p className="text-xs text-muted">Time per user</p>
        </div> */}

      </div>
    </div>
  );
}