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
  return (
    <div className="p-6 space-y-6 text-foreground">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Platform Stats</h1>
        <p className="text-muted text-sm">
          Monitor platform growth and engagement
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <div className="flex items-center justify-between">
            <Users className="text-indigo-400" />
            <span className="text-xs text-green-400">+12%</span>
          </div>
          <h2 className="text-2xl font-bold mt-3">1,240</h2>
          <p className="text-muted text-sm">Total Users</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <div className="flex items-center justify-between">
            <Activity className="text-emerald-400" />
            <span className="text-xs text-green-400">+8%</span>
          </div>
          <h2 className="text-2xl font-bold mt-3">320</h2>
          <p className="text-muted text-sm">Active Users</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <div className="flex items-center justify-between">
            <AlertTriangle className="text-red-400" />
            <span className="text-xs text-red-400">-3%</span>
          </div>
          <h2 className="text-2xl font-bold mt-3">14</h2>
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
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
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
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="groups" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <h3 className="text-sm text-muted mb-2">Groups</h3>
          <p className="text-2xl font-bold">210</p>
          <p className="text-xs text-muted">Total Groups Created</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <h3 className="text-sm text-muted mb-2">Messages</h3>
          <p className="text-2xl font-bold">12.4k</p>
          <p className="text-xs text-muted">Messages Sent</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow border border-white/5">
          <h3 className="text-sm text-muted mb-2">Avg Engagement</h3>
          <p className="text-2xl font-bold">5.6m</p>
          <p className="text-xs text-muted">Time per user</p>
        </div>

      </div>
    </div>
  );
}