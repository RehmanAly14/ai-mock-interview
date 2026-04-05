// @/components/analytics/skills-radar.tsx
"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  subject: string;
  score: number;
  fullMark: number;
};

export default function SkillsRadar({ data }: { data: ChartData[] }) {
  // If no data yet, show a placeholder
  if (data.length === 0) return <div className="text-slate-500 text-xs">Awaiting data...</div>;

  return (
    <div className="h-75 w-full bg-white/5 rounded-3xl border border-white/10 p-4 backdrop-blur-sm">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2 ml-2">
        Competency Matrix
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }} 
          />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="#818cf8"
            fill="#818cf8"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}