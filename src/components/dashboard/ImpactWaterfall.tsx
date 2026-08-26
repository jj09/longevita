import React, { useState } from 'react';
import { CategorySummary } from '../../engine/types';
import { ChevronDown, ChevronUp, Activity, Apple, Dumbbell, Dna, Brain, PlusCircle, MinusCircle, Info } from 'lucide-react';

interface ImpactWaterfallProps {
  categorySummaries: CategorySummary[];
}

export const ImpactWaterfall: React.FC<ImpactWaterfallProps> = ({ categorySummaries }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'demographics':
        return <Dna className="w-4 h-4 text-purple-400" />;
      case 'biometrics':
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'fitness':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'nutrition':
        return <Apple className="w-4 h-4 text-amber-400" />;
      case 'lifestyle':
        return <Brain className="w-4 h-4 text-rose-400" />;
      default:
        return <Activity className="w-4 h-4 text-emerald-400" />;
    }
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span>Lifespan Impact by Pillar</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown of years added or deducted across the 5 core longevity pillars
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {categorySummaries.map((cat) => {
          const isExpanded = expandedCategory === cat.category;
          const isPositive = cat.yearsDelta >= 0;

          // Compute relative visual bar width (max scale +/- 15 years)
          const maxScale = 14;
          const barWidthPercent = Math.min(100, (Math.abs(cat.yearsDelta) / maxScale) * 100);

          return (
            <div
              key={cat.category}
              className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden transition-colors hover:border-slate-700/80"
            >
              {/* Category Header Row */}
              <div
                onClick={() => toggleCategory(cat.category)}
                className="p-3.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-800/80 flex items-center justify-center">
                    {getCategoryIcon(cat.category)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="text-emerald-400 font-medium">+{cat.positiveYears}y</span>
                      <span>•</span>
                      <span className="text-rose-400 font-medium">-{cat.negativeYears}y</span>
                      <span>•</span>
                      <span className="text-slate-400">{cat.items.length} factors</span>
                    </div>
                  </div>
                </div>

                {/* Net Impact & Bar */}
                <div className="flex items-center gap-3 ml-2">
                  <div className="text-right min-w-[65px]">
                    <span
                      className={`text-sm font-bold px-2 py-0.5 rounded-md ${
                        isPositive
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isPositive ? `+${cat.yearsDelta}y` : `${cat.yearsDelta}y`}
                    </span>
                  </div>

                  <button className="text-slate-400 hover:text-slate-200 transition-colors p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Visual Horizontal Impact Meter */}
              <div className="px-3.5 pb-2">
                <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden flex">
                  {isPositive ? (
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(6, barWidthPercent)}%` }}
                    />
                  ) : (
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(6, barWidthPercent)}%` }}
                    />
                  )}
                </div>
              </div>

              {/* Expanded Itemized Breakdown */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-slate-800/60 bg-slate-950/40">
                  {cat.items.map((item) => (
                    <div
                      key={item.key}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/60 flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">
                          {item.label}
                        </span>
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            item.yearsDelta > 0
                              ? 'text-emerald-400'
                              : item.yearsDelta < 0
                              ? 'text-rose-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.yearsDelta > 0 ? (
                            <PlusCircle className="w-3 h-3" />
                          ) : item.yearsDelta < 0 ? (
                            <MinusCircle className="w-3 h-3" />
                          ) : null}
                          {item.yearsDelta > 0 ? `+${item.yearsDelta}y` : `${item.yearsDelta}y`}
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-300 font-medium">
                        Current: {item.currentValueDisplay}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-1 mt-0.5">
                        <Info className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                        <span>{item.scientificExplanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
