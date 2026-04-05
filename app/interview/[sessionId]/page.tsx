// @/app/interview/[sessionId]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Layout, Shield,  Clock } from "lucide-react";
import InterviewQuestions from "@/components/interview-questions";
import DeleteInterviewButton from "@/components/delete-interview-button";

export default async function InterviewSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { sessionId } = await params;
  const interview = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
  });

  if (!interview) notFound();

  return (
    <main className="min-h-screen bg-slate-950/80 text-white selection:bg-indigo-500/30">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Breadcrumb & Actions */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            {interview.status === "completed" && (
               <Link href={`/interview/${interview.id}/report`} className="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium border border-white/10 hover:bg-white/10 transition">
              View Report
             </Link>
            )}
            <DeleteInterviewButton sessionId={interview.id} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
              <h1 className="text-2xl font-bold tracking-tight">Interview Session</h1>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                  <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400"><Layout size={18}/></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Role</p>
                    <p className="font-semibold">{interview.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                  <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400"><Shield size={18}/></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Difficulty</p>
                    <p className="font-semibold capitalize">{interview.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                  <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400"><Clock size={18}/></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</p>
                    <p className="font-semibold capitalize">{interview.status.replace("_", " ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-8">
            <InterviewQuestions sessionId={interview.id} initialStatus={interview.status} />
          </div>
        </div>
      </div>
    </main>
  );
}