import React from 'react';
import { LongevityRecommendation } from '../../engine/types';
import { Target } from 'lucide-react';

interface EffortGainMatrixProps {
  recommendations: LongevityRecommendation[];
  onSimulateRecommendation: (rec: LongevityRecommendation) => void;
  activeSimulationId: string | null;
}

export const EffortGainMatrix: React.FC<EffortGainMatrixProps> = ({
  recommendations,
  onSimulateRecommendation,
  activeSimulationId,
}) => {
  if (recommendations.length === 0) return null;

  // Max gain for Y-axis scaling (default min 6 years)
  const maxGain = Math.max(7, ...recommendations.map((r) => r.potentialGainYears));

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Effort vs. Lifespan Gain Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any intervention bubble to live-simulate its lifespan boost
          </p>
        </div>
      </div>

      {/* 2x2 Matrix Container */}
      <div className="relative w-full h-80 bg-slate-950/80 rounded-xl border border-slate-800 p-4 overflow-hidden select-none">
        {/* Quadrant Background Dividers */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
          {/* Top Left: Sweet Spot (Low Effort, High Gain) */}
          <div className="border-r border-b border-slate-800/80 bg-emerald-500/[0.03] p-2 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">
              ⚡ Sweet Spot (Low Effort, High Gain)
            </span>
          </div>

          {/* Top Right: Major Investment (High Effort, High Gain) */}
          <div className="border-b border-slate-800/80 bg-cyan-500/[0.03] p-2 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded w-fit border border-cyan-500/20">
              💎 Major Investment (High Effort, High Gain)
            </span>
          </div>

          {/* Bottom Left: Easy Incremental (Low Effort, Low Gain) */}
          <div className="border-r border-slate-800/80 bg-slate-900/[0.1] p-2 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded w-fit">
              🌱 Easy Incremental
            </span>
          </div>

          {/* Bottom Right: Low ROI (High Effort, Modest Gain) */}
          <div className="bg-rose-500/[0.02] p-2 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-slate-900 px-2 py-0.5 rounded w-fit">
              ⏳ Lower ROI
            </span>
          </div>
        </div>

        {/* Axis Labels */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] uppercase font-bold text-slate-500 tracking-wider pointer-events-none">
          Lifespan Gain (Years) →
        </div>
        <div className="absolute bottom-2 right-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider pointer-events-none">
          Behavioral Effort / Friction →
        </div>

        {/* Plotted Interactive Nodes */}
        <div className="relative w-full h-full pl-4 pb-4">
          {recommendations.map((rec) => {
            // X position: map effortScore (1 to 5) to (10% to 90%)
            const xPercent = 10 + ((rec.effortScore - 1) / 4) * 80;
            // Y position: map potentialGainYears (0 to maxGain) to (85% to 15%)
            const yPercent = 85 - (rec.potentialGainYears / maxGain) * 70;
            const isSimulating = activeSimulationId === rec.id;

            return (
              <button
                key={rec.id}
                onClick={() => onSimulateRecommendation(rec)}
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center gap-1.5 shadow-lg group ${
                  isSimulating
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 scale-110 z-30 shadow-cyan-500/40 ring-2 ring-cyan-400'
                    : rec.bangForBuckIndex >= 15
                    ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 hover:scale-105 z-20 hover:border-emerald-400 shadow-emerald-500/20'
                    : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:scale-105 z-10 hover:border-slate-500'
                }`}
                title={`Click to simulate ${rec.title}: +${rec.potentialGainYears} yrs (Effort: ${rec.effortScore}/5)`}
              >
                <div className="flex items-center gap-1">
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{rec.title}</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] font-bold text-amber-300">
                    +{rec.potentialGainYears}y
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
