"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter, Calendar, ChevronRight, Inbox } from "lucide-react";

type SessionItem = {
  id: string;
  role: string;
  status: string;
  difficulty: string;
  updatedAt: string;
};

export default function DashboardFilters({ sessions }: { sessions: SessionItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = session.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || session.status === status;
      const matchesDifficulty = difficulty === "all" || session.difficulty === difficulty;
      return matchesSearch && matchesStatus && matchesDifficulty;
    });
  }, [sessions, search, status, difficulty]);

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search roles (e.g. React Developer)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white transition-all focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none rounded-2xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="all" className="bg-slate-900 text-white">All Status</option>
              <option value="in_progress" className="bg-slate-900 text-white">In Progress</option>
              <option value="completed" className="bg-slate-900 text-white">Completed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="appearance-none rounded-2xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="all" className="bg-slate-900 text-white">All Levels</option>
              <option value="junior" className="bg-slate-900 text-white">Junior</option>
              <option value="mid" className="bg-slate-900 text-white">Mid</option>
              <option value="senior" className="bg-slate-900 text-white">Senior</option>
            </select>
            <Filter className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 py-20 text-center">
          <div className="rounded-full bg-slate-800/50 p-4 text-slate-500">
            <Inbox size={32} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-300">No sessions found</h3>
          <p className="text-sm text-slate-500">Try adjusting your filters or start a new interview.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSessions.map((interview) => (
            <div
              key={interview.id}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/8 hover:border-indigo-500/30"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                      {interview.role}
                    </h3>
                    <span className="rounded-md bg-white/5 px-2.5 py-0.5  text-xs   border border-white/5">
                      {interview.difficulty}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        interview.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${interview.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                      {interview.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={14} />
                    <span>
                      {interview.updatedAt}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/interview/${interview.id}`}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    interview.status === "completed"
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                  }`}
                >
                  {interview.status === "completed" ? "Review Performance" : "Resume Session"}
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}