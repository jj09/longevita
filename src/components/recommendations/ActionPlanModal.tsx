import React from 'react';
import { LongevityRecommendation, LongevityCalculationResult, UserProfile } from '../../engine/types';
import { X, Printer, CheckCircle, Flame, HeartPulse, Sparkles, Calendar, ShieldCheck } from 'lucide-react';

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: LongevityCalculationResult;
  recommendations: LongevityRecommendation[];
  profile: UserProfile;
}

export const ActionPlanModal: React.FC<ActionPlanModalProps> = ({
  isOpen,
  onClose,
  result,
  recommendations,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const topWins = recommendations.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Personalized Longevity Action Blueprint</h2>
              <p className="text-xs text-slate-400">
                Evidence-based longevity roadmap optimized for highest life expectancy ROI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 text-center">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Projected Lifespan</span>
              <div className="text-2xl font-black text-emerald-400">{result.projectedLifespan} yrs</div>
              <div className="text-[10px] text-slate-400">Baseline: {result.actuarialBaseline} yrs</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Biological Age</span>
              <div className="text-2xl font-black text-cyan-300">{result.biologicalAge} yrs</div>
              <div className="text-[10px] text-slate-400">Chronological: {result.chronologicalAge} yrs</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Longevity Grade</span>
              <div className="text-2xl font-black text-amber-300">Grade {result.riskGrade}</div>
              <div className="text-[10px] text-slate-400">90% Range: {result.confidenceRange[0]}-{result.confidenceRange[1]}y</div>
            </div>
          </div>

          {/* Top 5 High-ROI Priorities */}
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Top High-Yield Interventions (Highest ROI)</span>
            </h3>

            <div className="space-y-3">
              {topWins.map((rec, i) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-200">{rec.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        +{rec.potentialGainYears} Years
                      </span>
                      <span className="text-xs font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        ROI {rec.bangForBuckIndex}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">{rec.description}</p>

                  <div className="pl-4 border-l-2 border-emerald-500/40 text-xs text-slate-300 space-y-1 mt-1">
                    {rec.actionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily & Weekly Habit Checklist */}
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Daily & Weekly Habit Matrix</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Daily Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Daily Protocol
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>Floss teeth once daily at bedtime (60 sec)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>Accumulate 8,000 - 10,000 daily steps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>Eat 5+ servings of whole plants/veggies & EVOO</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>Drink 1-2 cups green tea / polyphenols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>Protect 7-8 hours restful sleep window</span>
                  </li>
                </ul>
              </div>

              {/* Weekly & Clinical Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Weekly & Clinical Checklist
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>150 min Zone 2 aerobic cardio + 1 HIIT session</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>2-3x progressive resistance strength training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>Dedicated community / friend circle gathering (Moai)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-emerald-500 bg-slate-800 border-slate-700" />
                    <span>Check BP (target &lt;120/80) & annual blood panel</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Derived from New England Centenarian Study & Actuarial Life Science</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
