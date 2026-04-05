"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, PieChart as PieIcon, TrendingUp } from "lucide-react";

type SessionItem = {
  id: string;
  role: string;
  status: string;
  difficulty: string;
  createdAt: string;
};

type DashboardAnalyticsProps = {
  sessions: SessionItem[];
};

// --- The Color Palette ---
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ec4899"];

export default function DashboardAnalytics({ sessions }: DashboardAnalyticsProps) {
  // Data Transformation
  const completionData = [
    { name: "Completed", value: sessions.filter((s) => s.status === "completed").length },
    { name: "In Progress", value: sessions.filter((s) => s.status === "in_progress").length },
  ].filter(d => d.value > 0);

  const roleData = Object.entries(
    sessions.reduce<Record<string, number>>((acc, s) => {
      acc[s.role] = (acc[s.role] || 0) + 1;
      return acc;
    }, {})
  ).map(([role, count]) => ({ role, count }));

  const timelineData = Object.entries(
    sessions.reduce<Record<string, number>>((acc, s) => {
      const date = new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, count }));

  if (sessions.length === 0) return null;

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {/* Bar Chart: Sessions by Role */}
      <div className="rounded-3xl border border-white/5 bg-white/5 p-6 xl:col-span-2 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
            <BarChart3 size={20} />
          </div>
          <h3 className="text-lg font-bold">Sessions by Role</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="role" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              {/* Using the first color in our array for the bars */}
              <Bar dataKey="count" fill={COLORS[0]} radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Completion Split */}
      <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
            <PieIcon size={20} />
          </div>
          <h3 className="text-lg font-bold">Status Split</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionData}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={8}
                dataKey="value"
              >
                {/* Mapping specific colors from the array to the slices */}
                {completionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === "Completed" ? COLORS[1] : COLORS[2]} 
                    stroke="none" 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart: Activity Timeline */}
      <div className="rounded-3xl border border-white/5 bg-white/5 p-6 xl:col-span-3 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-lg font-bold">Interview Activity</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={COLORS[3]} // Using the blue color from our array
                strokeWidth={3} 
                dot={{ r: 4, fill: COLORS[3] }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}