import React from 'react';
import { UserProfile, LongevityCalculationResult } from '../../engine/types';
import { calculateLongevity } from '../../engine/longevityEngine';
import { GitCompare, ArrowRight, Check, X, TrendingUp } from 'lucide-react';

interface ComparisonDrawerProps {
  baselineProfile: UserProfile;
  currentProfile: UserProfile;
  currentResult: LongevityCalculationResult;
  onSetAsBaseline: () => void;
  onRevertToBaseline: () => void;
  onClose: () => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  baselineProfile,
  currentProfile,
  currentResult,
  onSetAsBaseline,
  onRevertToBaseline,
  onClose,
}) => {
  const baselineResult = calculateLongevity(baselineProfile);
  const lifespanDelta = Number((currentResult.projectedLifespan - baselineResult.projectedLifespan).toFixed(1));
  const bioAgeDelta = Number((baselineResult.biologicalAge - currentResult.biologicalAge).toFixed(1));

  // Find all keys that differ between baseline and current
  const changedKeys = Object.keys(currentProfile).filter((k) => {
    const key = k as keyof UserProfile;
    return baselineProfile[key] !== currentProfile[key];
  }) as Array<keyof UserProfile>;

  const formatKeyName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/40 bg-cyan-950/20 shadow-2xl mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>What-If Sandbox Comparison Mode</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparing your initial baseline profile against current live adjustments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSetAsBaseline}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5"
            title="Save current parameters as the new baseline"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Lock as Baseline</span>
          </button>
          <button
            onClick={onRevertToBaseline}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Revert all live tweaks back to baseline"
          >
            Revert
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Close compare view"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Lifespan Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Baseline Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Initial Baseline
          </span>
          <div className="text-3xl font-black text-slate-200 mt-1">
            {baselineResult.projectedLifespan} <span className="text-xs font-normal text-slate-400">yrs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Biological Age: <span className="font-semibold text-slate-300">{baselineResult.biologicalAge} yrs</span>
          </div>
        </div>

        {/* Live Scenario Card */}
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
            Live Scenario
          </span>
          <div className="text-3xl font-black text-cyan-300 mt-1">
            {currentResult.projectedLifespan} <span className="text-xs font-normal text-slate-400">yrs</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            Biological Age: <span className="font-semibold text-cyan-200">{currentResult.biologicalAge} yrs</span>
          </div>
        </div>

        {/* Total Net Differential */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center flex flex-col justify-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Lifespan Extended By
          </span>
          <div className="text-3xl font-black text-emerald-400 mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>+{lifespanDelta} yrs</span>
          </div>
          <div className="text-[11px] text-emerald-300 mt-1">
            Bio Age reduced by {bioAgeDelta} years
          </div>
        </div>
      </div>

      {/* Changed Parameters List */}
      <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
        <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>Active Modifications ({changedKeys.length})</span>
          {changedKeys.length === 0 && (
            <span className="text-slate-500 font-normal">No parameters modified yet. Move any slider to simulate!</span>
          )}
        </div>

        {changedKeys.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {changedKeys.map((key) => {
              const fromVal = String(baselineProfile[key]);
              const toVal = String(currentProfile[key]);

              return (
                <div
                  key={String(key)}
                  className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-300">{formatKeyName(String(key))}:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[11px]">
                      {fromVal}
                    </span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                    <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                      {toVal}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
