import React from 'react';
import { Award, BarChart3, Flame, Target, Sliders, ChevronRight } from 'lucide-react';

export interface SectionItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const SECTIONS: SectionItem[] = [
  { id: 'section-gauge', label: 'Lifespan & Grade', shortLabel: 'Grade & Dial', icon: Award },
  { id: 'section-impact', label: 'Impact by Pillar', shortLabel: 'Pillar Impact', icon: BarChart3 },
  { id: 'section-recommendations', label: 'Bang for Buck ROI', shortLabel: 'ROI Optimizer', icon: Flame, badge: 'ROI' },
  { id: 'section-matrix', label: 'Effort vs. Gain Matrix', shortLabel: 'Effort Matrix', icon: Target },
  { id: 'section-controls', label: 'Live Parameter Controls', shortLabel: 'Live Controls', icon: Sliders },
];

interface TableOfContentsProps {
  activeSectionId: string;
  onScrollTo: (id: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  activeSectionId,
  onScrollTo,
}) => {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center justify-between">
            <span>Navigation Outline</span>
            <span className="text-[10px] text-slate-500 font-medium">Jump to</span>
          </div>

          <nav className="space-y-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSectionId === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => onScrollTo(section.id)}
                  className={`w-full group text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 translate-x-1'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{section.label}</span>
                  </div>

                  {section.badge && !isActive && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                      {section.badge}
                    </span>
                  )}

                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick helper tip */}
        <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/50 text-[11px] text-slate-500 leading-relaxed">
          💡 <strong className="text-slate-400">Pro Tip:</strong> Tweak parameters in <em>Live Controls</em> to see the Lifespan & ROI update in real-time.
        </div>
      </div>
    </aside>
  );
};
