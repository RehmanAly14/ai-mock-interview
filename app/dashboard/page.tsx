import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DashboardAnalytics from "@/components/dashboard-analytics";
import DashboardFilters from "@/components/dashboard-filters";

import { LayoutDashboard, Plus, History, Activity, CheckCircle2, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const interviews = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const stats = [
    { label: "Total Sessions", value: interviews.length, icon: Activity, color: "text-blue-400" },
    { label: "In Progress", value: interviews.filter(i => i.status === "in_progress").length, icon: Clock, color: "text-amber-400" },
    { label: "Completed", value: interviews.filter(i => i.status === "completed").length, icon: CheckCircle2, color: "text-emerald-400" },
  ];

  return (
    <main className="min-h-screen bg-slate-950/80 text-white selection:bg-indigo-500/30">
      <section className="mx-auto max-w-7xl px-14 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <LayoutDashboard size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Candidate Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Welcome, {session.user.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="mt-3 text-slate-400 max-w-xl">
              Track your performance, resume previous sessions, and master your next career move with AI.
            </p>
          </div>

          <Link
            href="/interview/start"
            className="group flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90" />
            New Interview
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="group rounded-2xl border border-white/5 bg-white/5 p-6 transition-all hover:border-indigo-500/30">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <stat.icon size={20} className={stat.color} />
              </div>
              <h2 className="text-4xl font-bold tracking-tight">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="mt-12">
          <div className="mb-6 flex items-center gap-2">
            <Activity size={20} className="text-indigo-400" />
            <h2 className="text-xl font-bold">Performance Analytics</h2>
          </div>
          <DashboardAnalytics sessions={interviews.map(i => ({ ...i, createdAt: i.createdAt.toISOString() }))} />
        </div>

        {/* Previous Sessions */}
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-2">
            <History size={20} className="text-indigo-400" />
            <h2 className="text-xl font-bold">Session History</h2>
          </div>
          <DashboardFilters
  sessions={interviews.map(i => ({
    ...i,
    updatedAt: i.updatedAt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }))}
/>
        </div>
      </section>
    </main>
  );
}