import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ExportReportPdfButton from "@/components/export-report-pdf-button";
import SkillsRadar from "@/components/skills-radar"; 
import {
  ChevronLeft,
  Award,
  BarChart3,
  Target,
  CheckCircle,
  Zap,
  BookOpen,
} from "lucide-react";
import CopyShareLink from "@/components/copy-link-button";

type PageProps = { params: Promise<{ sessionId: string }> };

export default async function InterviewReportPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { sessionId } = await params;
  const interview = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
    include: {
      questions: {
        include: { answers: { include: { feedback: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!interview) notFound();

  const answers = interview.questions.map((q) => q.answers[0]).filter(Boolean);
  const scores = answers
    .map((a) => a?.feedback?.score)
    .filter((s): s is number => typeof s === "number");
  
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  const accuracy = averageScore * 10;

  // Function to prepare chart data
  const getChartData = (questions: any[]) => {
    const categories: Record<string, { total: number; count: number }> = {};

    questions.forEach((q) => {
      const feedback = q.answers[0]?.feedback;
      if (feedback) {
        const cat = feedback.category || "General";
        if (!categories[cat]) categories[cat] = { total: 0, count: 0 };
        categories[cat].total += feedback.score;
        categories[cat].count += 1;
      }
    });

    return Object.keys(categories).map((name) => ({
      subject: name,
      score: Math.round(categories[name].total / categories[name].count),
      fullMark: 10,
    }));
  };

  const chartData = getChartData(interview.questions);

  const getPerformanceTheme = (score: number) => {
    if (score >= 8)
      return {
        label: "Exceptional",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      };
    if (score >= 6)
      return {
        label: "Professional",
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
      };
    return {
      label: "Developing",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    };
  };

  const theme = getPerformanceTheme(averageScore);

  return (
    <main className="min-h-screen bg-slate-950/80 text-white selection:bg-indigo-500/30 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/interview/${interview.id}`}
            className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Workspace
          </Link>
          <div className="flex items-center gap-4">
            <ExportReportPdfButton
              targetId="report-container"
              fileName={`${interview.role.toLowerCase()}-report`}
            />
            {averageScore >= 6 && (
              <CopyShareLink slug={interview.shareSlug || interview.id} />
            )}
          </div>
        </div>

        {averageScore >= 6 && (
          <Link
            href={`/interview/${interview.id}/certificate`}
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-amber-500 to-yellow-600 px-6 py-2.5 text-sm font-black text-black transition hover:scale-105 active:scale-95 w-fit"
          >
            <Award size={18} className="animate-bounce" />
            Claim Achievement Certificate
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </Link>
        )}

        <div id="report-container" className="space-y-8 bg-slate-950/80 p-2 md:p-6">
          
          {/* ANALYTICS SECTION: Score + Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Score Summary */}
            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-linear-to-b from-white/10 to-transparent p-8 flex flex-col justify-center items-center text-center">
                <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${theme.bg} ${theme.color} border ${theme.border}`}>
                   {theme.label} Candidate
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-6">{interview.role}</h1>
                
                <div className="flex items-center gap-6 rounded-3xl bg-black/40 border border-white/5 p-6 backdrop-blur-xl w-full">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Score</p>
                    <p className="text-4xl font-black text-white">{averageScore}<span className="text-lg text-slate-600">/10</span></p>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Accuracy</p>
                    <p className="text-4xl font-black text-indigo-400">{accuracy}%</p>
                  </div>
                </div>
            </div>

            {/* Radar Chart Component (Spans 2 columns on large screens) */}
            <div className="lg:col-span-2">
              <SkillsRadar data={chartData} />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Questions", val: interview.questions.length, icon: BookOpen, color: "text-blue-400" },
              { label: "Completion", val: `${Math.round((answers.length / interview.questions.length) * 100)}%`, icon: CheckCircle, color: "text-emerald-400" },
              { label: "Feedback", val: `${scores.length}`, icon: Target, color: "text-purple-400" },
              { label: "Status", val: interview.status.replace("_", " "), icon: BarChart3, color: "text-amber-400" },
            ].map((stat, i) => (
              <div key={i} className="rounded-3xl border border-white/5 bg-white/5 p-5">
                <stat.icon size={20} className={`${stat.color} mb-3`} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className="mt-1 text-xl font-bold capitalize">{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Question breakdown list (Mapping through your interview.questions) */}
          <div className="space-y-6 pt-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="text-indigo-400" fill="currentColor" size={24} />
              Performance Deep-Dive
            </h2>
            {interview.questions.map((question, index) => {
              const answer = question.answers[0];
              const fb = answer?.feedback;
              return (
                <div key={question.id} className="group rounded-4xl border border-white/5 bg-white/5 p-8 transition hover:border-white/10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-xs font-black text-indigo-500/50 uppercase tracking-tighter">QUESTION 0{index + 1}</span>
                      <h3 className="text-xl font-bold mt-1">{question.content}</h3>
                      {fb?.category && (
                        <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md border border-indigo-400/20">
                          {fb.category}
                        </span>
                      )}
                    </div>
                    {fb && (
                      <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 font-mono font-black text-xl">
                        {fb.score}<span className="text-xs text-slate-600">/10</span>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Response</p>
                      <p className="text-sm leading-relaxed text-slate-300 bg-black/20 rounded-2xl p-4 border border-white/5 italic">
                        "{answer?.content || "No response provided."}"
                      </p>
                    </div>
                    {fb && (
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4">
                          <p className="text-[10px] font-black uppercase text-emerald-500 mb-1">Strengths</p>
                          <p className="text-sm text-slate-300">{fb.strengths}</p>
                        </div>
                        <div className="rounded-2xl bg-amber-500/5 border border-amber-500/10 p-4">
                          <p className="text-[10px] font-black uppercase text-amber-500 mb-1">Growth Areas</p>
                          <p className="text-sm text-slate-300">{fb.improvements}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}