import React, { useEffect, useRef } from 'react';
import { LongevityCalculationResult } from '../../engine/types';
import { Award, ShieldAlert, TrendingUp, TrendingDown, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LifespanGaugeProps {
  result: LongevityCalculationResult;
}

export const LifespanGauge: React.FC<LifespanGaugeProps> = ({ result }) => {
  const {
    projectedLifespan,
    biologicalAge,
    chronologicalAge,
    actuarialBaseline,
    netDelta,
    confidenceRange,
    totalGainedYears,
    totalLostYears,
    riskGrade,
  } = result;

  const hasCelebratedCentenarian = useRef(false);

  useEffect(() => {
    if (projectedLifespan >= 100 && !hasCelebratedCentenarian.current) {
      hasCelebratedCentenarian.current = true;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899'],
      });
    } else if (projectedLifespan < 99) {
      hasCelebratedCentenarian.current = false;
    }
  }, [projectedLifespan]);

  // Map projected lifespan (range 50 to 110) to gauge percentage (0 to 100)
  const minGauge = 55;
  const maxGauge = 108;
  const gaugePercent = Math.max(0, Math.min(100, ((projectedLifespan - minGauge) / (maxGauge - minGauge)) * 100));

  // Circular gauge arc calculations
  const strokeWidth = 14;
  const radius = 85;
  const circumference = Math.PI * radius; // Half circle (180 deg)
  const strokeDashoffset = circumference - (circumference * gaugePercent) / 100;

  // Grade styling
  const gradeColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
    'A+': { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', label: 'Centenarian Tier' },
    'A': { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/40', label: 'Exceptional Longevity' },
    'B': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40', label: 'Above Average' },
    'C': { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40', label: 'Average Baseline' },
    'D': { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/40', label: 'Elevated Risk' },
    'F': { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40', label: 'High Accelerated Risk' },
  };

  const currentGrade = gradeColors[riskGrade] || gradeColors['B'];
  const bioAgeDelta = Number((chronologicalAge - biologicalAge).toFixed(1));

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 relative overflow-hidden border border-slate-800/80 shadow-2xl">
      {/* Background ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{
          background: projectedLifespan >= 90 ? 'radial-gradient(circle, #10b981, transparent)' : 'radial-gradient(circle, #06b6d4, transparent)',
        }}
      />

      <div className="flex flex-col items-center text-center">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between w-full mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${currentGrade.bg} ${currentGrade.text} ${currentGrade.border} flex items-center gap-1.5`}>
              <Award className="w-4 h-4" />
              Grade {riskGrade}: {currentGrade.label}
            </span>
          </div>

          {projectedLifespan >= 100 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              100+ Club!
            </span>
          )}
        </div>

        {/* Central Radial SVG Gauge */}
        <div className="relative w-64 h-36 flex items-center justify-center mt-2">
          <svg className="w-64 h-64 overflow-visible" viewBox="0 -10 200 145">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="85%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <filter id="gaugeGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Arc */}
            <path
              d="M 15 105 A 85 85 0 0 1 185 105"
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Progress Arc */}
            <path
              d="M 15 105 A 85 85 0 0 1 185 105"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              filter="url(#gaugeGlow)"
            />

            {/* Tick Markers with generous margins */}
            <text x="15" y="128" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">60y</text>
            <text x="100" y="4" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">85y</text>
            <text x="185" y="128" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">105y+</text>
          </svg>

          {/* Central Lifespan Number & Label Below */}
          <div className="absolute top-14 flex flex-col items-center select-none pointer-events-none">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-[46px] font-black tracking-tight text-white drop-shadow-md leading-none">
                {projectedLifespan}
              </span>
              <span className="text-slate-400 text-base sm:text-lg font-bold">yrs</span>
            </div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-400 font-bold mt-2">
              Projected Lifespan
            </span>
          </div>
        </div>

        {/* Delta vs Actuarial Baseline */}
        <div className="mt-4 flex items-center justify-center text-center">
          {netDelta >= 0 ? (
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-emerald-500/20 text-center flex-wrap">
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              <span>+{netDelta} years vs actuarial baseline ({actuarialBaseline} yrs)</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-rose-500/20 text-center flex-wrap">
              <TrendingDown className="w-4 h-4 flex-shrink-0" />
              <span>{netDelta} years vs actuarial baseline ({actuarialBaseline} yrs)</span>
            </div>
          )}
        </div>

        {/* Biological Age & Confidence Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-4 border-t border-slate-800/80">
          {/* Biological Age Box */}
          <div className="bg-slate-900/70 rounded-xl p-3 sm:p-4 border border-slate-800 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Biological Age</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-cyan-300 mt-1">
              {biologicalAge} <span className="text-xs text-slate-400 font-normal">yrs</span>
            </div>
            <div className="text-xs sm:text-sm mt-1 font-medium text-center">
              {bioAgeDelta > 0 ? (
                <span className="text-emerald-400">{bioAgeDelta} yrs younger</span>
              ) : bioAgeDelta < 0 ? (
                <span className="text-rose-400">{Math.abs(bioAgeDelta)} yrs older</span>
              ) : (
                <span className="text-slate-400">Equals calendar age</span>
              )}
            </div>
          </div>

          {/* 90% Confidence Interval Box */}
          <div className="bg-slate-900/70 rounded-xl p-3 sm:p-4 border border-slate-800 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Likely Range (90% CI)</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-1">
              {confidenceRange[0]} - {confidenceRange[1]}
            </div>
            <div className="text-xs text-slate-400 mt-1 text-center">
              Statistical variance
            </div>
          </div>
        </div>

        {/* Positive Gains vs Deductions breakdown pill */}
        <div className="w-full mt-3 flex items-center justify-between text-xs sm:text-sm bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-800/50 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span>Bonus: <strong>+{totalGainedYears}y</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
            <span>Risk: <strong>-{totalLostYears}y</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
