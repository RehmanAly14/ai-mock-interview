// @/app/interview/[sessionId]/certificate/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CertificateView from "@/components/Certificate";
import ExportReportPdfButton from "@/components/export-report-pdf-button";

export default async function CertificatePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { sessionId } = await params;
  const interview = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
    include: { questions: { include: { answers: { include: { feedback: true } } } } }
  });

  if (!interview || interview.status !== "completed") notFound();

  const scores = interview.questions.flatMap(q => q.answers.map(a => a.feedback?.score)).filter((s): s is number => s != null);
  const avg = scores.length > 0 ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0;

  return (
    <main className="min-h-screen bg-slate-950/80 selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50  bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link 
            href={`/interview/${sessionId}/report`} 
            className="group flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Return to Report
          </Link>
          
         

          <ExportReportPdfButton 
            targetId="certificate-content" 
            fileName={`AI-Mock-Certificate-${interview.role}`} 
            role={interview.role}
            score={avg}
            variant="certificate"
          />
        </div>
      </nav>

       <div className="text-center flex justify-center align-middle mt-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Official Certification Portal</p>
          </div>

      {/* Certificate Display Area */}
      <div className="flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <CertificateView 
              userName={session.user.name || "Candidate"} 
              role={interview.role} 
              score={avg} 
              date={new Date(interview.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
              sessionId={interview.id}
           />
           
           <div className="mt-12 text-center">
             <p className="text-sm text-slate-500">
               This certificate is a permanent record of your performance. 
               <br /> You can access it anytime via your dashboard.
             </p>
           </div>
        </div>
      </div>
    </main>
  );
}