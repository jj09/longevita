import React, { useState } from 'react';
import { LongevityRecommendation } from '../../engine/types';
import { Flame, Zap, Trophy, Activity, Apple, Check, Play, ChevronDown, ChevronUp, BookOpen, Sparkles } from 'lucide-react';

interface BangForBuckLeaderboardProps {
  recommendations: LongevityRecommendation[];
  onApplyRecommendation: (rec: LongevityRecommendation) => void;
  onSimulateRecommendation: (rec: LongevityRecommendation) => void;
  activeSimulationId: string | null;
}

export const BangForBuckLeaderboard: React.FC<BangForBuckLeaderboardProps> = ({
  recommendations,
  onApplyRecommendation,
  onSimulateRecommendation,
  activeSimulationId,
}) => {
  const [filter, setFilter] = useState<'all' | 'quick_win' | 'high_gain' | 'medical' | 'fitness' | 'nutrition'>('all');
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  // Filter and sort recommendations
  let filteredRecs = [...recommendations];

  if (filter === 'quick_win') {
    filteredRecs = filteredRecs.filter((r) => r.effortScore <= 2);
  } else if (filter === 'high_gain') {
    filteredRecs.sort((a, b) => b.potentialGainYears - a.potentialGainYears);
  } else if (filter === 'medical') {
    filteredRecs = filteredRecs.filter((r) => r.pillar === 'biometrics' || r.category === 'medical_optimization');
  } else if (filter === 'fitness') {
    filteredRecs = filteredRecs.filter((r) => r.pillar === 'fitness');
  } else if (filter === 'nutrition') {
    filteredRecs = filteredRecs.filter((r) => r.pillar === 'nutrition');
  }

  const toggleExpand = (id: string) => {
    setExpandedRecId(expandedRecId === id ? null : id);
  };

  const renderEffortDots = (effort: number, label: string) => {
    return (
      <div className="flex items-center gap-1.5" title={`Effort Rating: ${effort}/5 (${label})`}>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((dot) => (
            <span
              key={dot}
              className={`w-2 h-2 rounded-full ${
                dot <= effort
                  ? effort <= 2
                    ? 'bg-emerald-400'
                    : effort === 3
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-slate-300 font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Bang for Your Buck Longevity Optimizer</span>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  ROI Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Interventions ranked by highest lifespan yield per unit of behavioral effort
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              filter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Top ROI
          </button>
          <button
            onClick={() => setFilter('quick_win')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              filter === 'quick_win'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Micro-Wins
          </button>
          <button
            onClick={() => setFilter('high_gain')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              filter === 'high_gain'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Max Years
          </button>
          <button
            onClick={() => setFilter('fitness')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              filter === 'fitness'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Fitness
          </button>
          <button
            onClick={() => setFilter('nutrition')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              filter === 'nutrition'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            Diet
          </button>
        </div>
      </div>

      {/* Recommendations List */}
      {filteredRecs.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800/80">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-semibold text-slate-200">
            Optimal Longevity Profile Reached!
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            All parameters in this category are already at their peak scientific targets. You are living like a true centenarian!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecs.map((rec, index) => {
            const isSimulating = activeSimulationId === rec.id;
            const isExpanded = expandedRecId === rec.id;

            return (
              <div
                key={rec.id}
                className={`rounded-xl border transition-all duration-200 ${
                  isSimulating
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Main Card Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Rank, Title, Metrics */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-slate-700">
                      #{index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">
                          {rec.title}
                        </h4>

                        {/* ROI Score Badge */}
                        <span className="px-2 py-0.5 text-[11px] font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 rounded-md flex items-center gap-1 shadow-sm">
                          <Flame className="w-3 h-3 text-amber-400" />
                          ROI {rec.bangForBuckIndex}
                        </span>

                        {/* Lifespan Potential Gain */}
                        <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-md">
                          +{rec.potentialGainYears} Years
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {rec.description}
                      </p>

                      {/* Current vs Target Value & Effort Meter */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Current:</span>
                          <span className="text-rose-300 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 text-[11px]">
                            {rec.currentValueDisplay}
                          </span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-300 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                            {rec.targetValueDisplay}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Effort:</span>
                          {renderEffortDots(rec.effortScore, rec.difficultyLabel)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                    {/* Expand Evidence Button */}
                    <button
                      onClick={() => toggleExpand(rec.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1"
                      title="View scientific evidence and step-by-step instructions"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Guide</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Simulate Button */}
                    <button
                      onClick={() => onSimulateRecommendation(rec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        isSimulating
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25'
                      }`}
                      title="Live-test this recommendation to see the projected lifespan update immediately"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      {isSimulating ? 'Simulating...' : 'Simulate'}
                    </button>

                    {/* Apply Permanently Button */}
                    <button
                      onClick={() => onApplyRecommendation(rec)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm flex items-center gap-1"
                      title="Apply this recommendation into your current active parameters"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Apply</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Action Plan & Evidence Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/60 rounded-b-xl space-y-3 text-xs">
                    {/* Actionable Steps */}
                    <div>
                      <h5 className="font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Actionable Step-by-Step Prescription:</span>
                      </h5>
                      <ul className="space-y-1.5 pl-5 list-disc text-slate-300 leading-relaxed">
                        {rec.actionSteps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Scientific Evidence */}
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] leading-relaxed text-slate-400 flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-300 font-semibold">Scientific Rationale: </strong>
                        <span>{rec.scientificEvidence}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
