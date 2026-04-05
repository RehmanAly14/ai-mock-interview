"use client";

import { Award, BadgeCheck, Fingerprint } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

type CertificateProps = {
  userName: string;
  role: string;
  score: number;
  date: string;
  sessionId: string;
};

export default function CertificateView({ 
  userName, 
  role, 
  score, 
  date, 
  sessionId 
}: CertificateProps) {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // Only access window on the client side
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <div 
      id="certificate-content" 
      className="relative mx-auto aspect-[1.414/1] w-full max-w-5xl overflow-hidden bg-[#030406] p-1 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)]"
    >
      <div className="h-full w-full border border-white/20 bg-[#030406] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '24px 24px' }} 
        />
        
        <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-indigo-500/40" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-indigo-500/40" />

        <div className="relative z-10 h-full flex flex-col justify-between">
          
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-indigo-400">
                <BadgeCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Verification</span>
              </div>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">ID: {sessionId.substring(0, 12).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <h4 className="text-sm font-black tracking-[0.2em] text-white">AI-MOCK-INTERVIEW</h4>
              <p className="text-[9px] text-indigo-500/60 uppercase font-bold">Advanced Assessment Series</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center py-8">
            <h1 className="font-serif text-xl uppercase tracking-[0.6em] text-slate-400 opacity-80">Certificate of Excellence</h1>
            
            <div className="my-10">
              <p className="text-sm font-medium text-slate-500 italic mb-4">
                This prestigious recognition is awarded to
              </p>
              <h2 
                id="certificate-user-name"
                className="text-6xl font-black tracking-tight text-white uppercase"
              >
                {userName}
              </h2>
              <div className="mx-auto mt-4 h-px w-64 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
            </div>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400">
              For demonstrating exceptional technical proficiency and professional communication during the 
              <span className="text-white font-semibold"> {role} </span> 
              simulated interview environment, achieving a performance metric of <br />
              <span className="text-indigo-400 font-bold"> {score}/10</span>.
            </p>
          </div>

          {/* Footer Section: Signatures, Seal & QR */}
          <div className="flex items-end justify-between px-4">
            
            {/* Issuing Authority */}
            <div className="flex flex-col items-start w-1/3">
               <div className="mb-2 h-px w-40 bg-white/20" />
               <p className="text-[10px] font-black uppercase tracking-widest text-white">AI-Mock-Interview</p>
               <p className="text-[9px] text-slate-500 uppercase">Assessment Director</p>
            </div>

            {/* Central Seal */}
            <div className="relative flex items-center justify-center w-1/3">
              <div className="absolute h-24 w-24 rounded-full border border-indigo-500/20 animate-spin-slow" />
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600/10 border border-indigo-500/40 backdrop-blur-sm">
                <Award size={32} className="text-indigo-400" />
              </div>
            </div>

            
            <div className="flex items-end justify-end gap-8 w-1/3">
             
              <div className="flex flex-col items-end">
                 <div className="mb-2 h-px w-40 bg-white/20" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">{date}</p>
                 <div className="flex items-center gap-1 text-[9px] text-slate-500 uppercase">
                   <Fingerprint size={10} /> Verified Digital Record
                 </div>
              </div>

              {/* QR Verification */}
              <div className="flex flex-col items-center gap-2 opacity-60">
                <div className="bg-white p-1 rounded-sm">
                  {baseUrl ? (
                    <QRCodeSVG 
                      value={`${baseUrl}/verify/${sessionId}`} 
                      size={50}
                      level="L"
                    />
                  ) : (
                    <div className="h-12.5 w-12.5 bg-slate-800 animate-pulse rounded-sm" />
                  )}
                </div>
                <p className="text-[6px] font-mono text-slate-500 uppercase tracking-tighter">Scan to Verify</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}