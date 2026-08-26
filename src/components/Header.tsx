import React from 'react';
import { Sparkles, RotateCcw, GitCompare, FileText, HeartPulse } from 'lucide-react';
import { PRESET_ARCHETYPES } from '../engine/presets';
import { PresetArchetype } from '../engine/types';

interface HeaderProps {
  currentPresetId: string;
  onSelectPreset: (preset: PresetArchetype) => void;
  onReset: () => void;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  onOpenActionPlan: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPresetId,
  onSelectPreset,
  onReset,
  isCompareMode,
  onToggleCompareMode,
  onOpenActionPlan,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <HeartPulse className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                LongevityOS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                LIVE 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Actuarial Lifespan & ROI Optimizer
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Preset Selector */}
          <div className="relative flex items-center">
            <label className="text-xs text-slate-400 mr-2 hidden md:inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Archetype:
            </label>
            <select
              value={currentPresetId}
              onChange={(e) => {
                const found = PRESET_ARCHETYPES.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="bg-slate-900/90 text-xs sm:text-sm font-medium text-slate-200 border border-slate-700/80 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-slate-600 transition-colors"
            >
              {PRESET_ARCHETYPES.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.icon} {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Compare Mode Toggle */}
          <button
            onClick={onToggleCompareMode}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border flex items-center gap-1.5 transition-all ${
              isCompareMode
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-slate-100'
            }`}
            title="Toggle split comparison between your initial baseline and live modifications"
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Compare</span>
            {isCompareMode && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          {/* Action Plan Blueprint Modal Button */}
          <button
            onClick={onOpenActionPlan}
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/10"
            title="View and print your personalized longevity roadmap"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Action Plan</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700 transition-colors flex items-center gap-1"
            title="Reset all parameters to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
