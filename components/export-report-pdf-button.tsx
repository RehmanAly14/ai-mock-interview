// @/components/export-report-pdf-button.tsx
"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { Download, Loader2, Share2, Award, CheckCircle } from "lucide-react";

type ExportProps = {
  targetId: string;
  fileName: string;
  role?: string;
  score?: number;
  variant?: "report" | "certificate";
};

export default function ExportReportPdfButton({
  targetId,
  fileName,
  role,
  score,
  variant = "report",
}: ExportProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isCert = variant === "certificate";

  const handleLinkedInShare = () => {
    const base = "https://www.linkedin.com/feed/?shareActive=true&text=";
    const shareText = `I'm proud to share my ${role} Interview Certification from AI-Mock-Interview! 🏆\n\nFinal Score: ${score}/10\n\nCheck out the platform here: ${window.location.origin}`;
    window.open(`${base}${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
      setLoading(true);
      await document.fonts.ready;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#030406",
        onclone: (clonedDoc) => {
          const nameEl = clonedDoc.getElementById("certificate-user-name");
          if (nameEl) nameEl.style.fontFamily = "sans-serif";
        },
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // --- LOGIC SPLIT ---
      if (isCert) {
        // LANDSCAPE SINGLE PAGE (No white space)
        const pdf = new jsPDF("l", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth(); // 297mm
        const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.save(`${fileName}.pdf`);
      } else {
        // PORTRAIT MULTI-PAGE (Report Slicing)
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save(`${fileName}.pdf`);
      }

      if (isCert) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess && isCert && (
        <div className="fixed inset-0 z-999 h-screen w-screen flex flex-col items-center justify-center bg-[#000000f2] backdrop-blur-xl animate-in fade-in duration-500">
          <div className="relative flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-700">
            {/* Animated Icon */}
            <div className="relative mb-10 flex h-48 w-48 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/30 animate-[spin_10s_linear_infinite]" />
              <Award
                size={110}
                className="relative z-10 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              />
            </div>
            <h2 className="text-6xl font-black text-white italic tracking-tighter sm:text-7xl">
              CERTIFIED
            </h2>
            <h2 className="text-5xl font-black text-amber-400 tracking-[0.2em] sm:text-6xl -mt-2">
              EXCELLENCE
            </h2>

            <p className="mt-6 text-xs font-mono tracking-[0.4em] text-slate-500 uppercase">
              Verification Signature: Validated
            </p>

            {/* Success Badge */}
            <div className="mt-12 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 backdrop-blur-md">
              <CheckCircle className="text-emerald-500" size={24} />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </p>
                <p className="text-sm font-bold text-white">
                  Document Saved to Device
                </p>
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 h-1 bg-amber-400 animate-[progress_4s_linear]"
            style={{ width: "100%" }}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleExport}
          disabled={loading}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold  transition ${
            isCert
              ? "bg-white text-black hover:bg-slate-200"
              : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Download size={18} />
          )}
          {isCert
            ? loading
              ? "Verifying..."
              : "Download Certificate"
            : "Download Report"}
        </button>

        {isCert && (
          <button
            onClick={handleLinkedInShare}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-[#0077b5] transition hover:bg-[#0077b5]/10"
          >
            <Share2 size={18} />
            Share on LinkedIn
          </button>
        )}
      </div>
    </>
  );
}
