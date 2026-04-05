
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CertificateView from "@/components/Certificate"; 
import { BadgeCheck } from "lucide-react"; 

export default async function VerificationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const interview = await prisma.interviewSession.findUnique({
    where: { shareSlug: slug },
    include: { 
        user: true,
        questions: { include: { answers: { include: { feedback: true } } } } 
    }
  });

  if (!interview) notFound();

  const scores = interview.questions.flatMap(q => q.answers.map(a => a.feedback?.score)).filter((s): s is number => s != null);
  const avg = scores.length > 0 ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0;

  return (
    <main className="min-h-screen bg-slate-950/80 py-20 px-4">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-emerald-500 border border-emerald-500/20">
          <BadgeCheck className="h-4 w-4" /> 
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
            Official Verified Record
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-black text-white italic tracking-tighter sm:text-4xl">
           CREDENTIAL VERIFICATION
        </h1>
        <p className="mt-2 text-slate-500 text-sm max-w-md mx-auto">
          This digital certificate is a verified record of professional assessment performance issued by AI-Mock-Interview.
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
        <CertificateView 
          userName={interview.user.name || "Candidate"} 
          role={interview.role} 
          score={avg} 
          date={new Date(interview.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
          sessionId={interview.id}
        />
      </div>
      
      <div className="mt-20 text-center">
         <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
           Platform Security ID: {interview.id.toUpperCase()}
         </p>
      </div>
    </main>
  );
}