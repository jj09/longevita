import React from 'react';
import { PRESET_ARCHETYPES } from '../../engine/presets';
import { PresetArchetype } from '../../engine/types';
import { TOTAL_QUIZ_QUESTIONS } from '../../engine/quizQuestions';
import { HeartPulse, ArrowRight, Sparkles, Flame, Sliders, Trophy, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onStartQuiz: () => void;
  onSelectArchetype: (archetype: PresetArchetype) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartQuiz,
  onSelectArchetype,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <HeartPulse className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Longevita
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Actuarial Lifespan & Bang-for-Buck ROI Optimizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartQuiz}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Take the Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-sm shadow-emerald-500/10">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Scientific Longevity Calculator & ROI Optimizer</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight md:leading-[1.15]">
          Discover Your True Lifespan & the{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
            Highest-ROI Tweaks
          </span>{' '}
          to Extend It
        </h1>

        {/* Hero Description */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Inspired by the scientific research of the <strong>New England Centenarian Study</strong> and actuarial life tables. 
          Answer a personalized questionnaire, <strong>tweak parameters live</strong> to see immediate adjustments, and get 
          instant recommendations on which lifestyle changes give you the <strong>most bang for your buck</strong>.
        </p>

        {/* Value Highlights Pill Grid */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>29+ Evidence-Based Biomarkers & Habits</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Zero-Latency Live Parameter Tweaking</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Bang-for-the-Buck ROI Index</span>
          </div>
        </div>

        {/* Primary CTA Button: Take the Quiz */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center w-full px-4">
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto group relative px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-extrabold text-lg sm:text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95 flex items-center justify-center gap-3 ring-4 ring-emerald-500/20 min-h-[52px]"
          >
            <span>Take the Quiz</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-xs sm:text-sm text-slate-400 mt-2.5 font-medium text-center">
            {TOTAL_QUIZ_QUESTIONS} questions • Takes ~2 minutes • 100% Private & Client-side
          </span>
        </div>

        {/* Divider */}
        <div className="w-full max-w-3xl my-12 sm:my-16 border-t border-slate-800/80" />

        {/* Archetype Cards Section */}
        <div className="w-full max-w-5xl text-left">
          <div className="mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Explore Pre-Configured Lifestyle Archetypes</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select any profile below to jump straight to the live simulator and test recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_ARCHETYPES.map((archetype) => (
              <div
                key={archetype.id}
                onClick={() => onSelectArchetype(archetype)}
                className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-3xl p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform">
                      {archetype.icon}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      Explore Profile →
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {archetype.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    {archetype.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Age: {archetype.profile.age}</span>
                  <span>BP: {archetype.profile.systolicBP}/{archetype.profile.diastolicBP}</span>
                  <span className="font-semibold text-slate-300 capitalize">{archetype.profile.cardio} cardio</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Scientific Credits */}
        <div className="mt-20 pt-8 border-t border-slate-900 w-full max-w-4xl text-center text-xs text-slate-500 leading-relaxed">
          <p>
            Developed with evidence-based longevity modeling from the <strong>New England Centenarian Study</strong> (Dr. Thomas Perls), 
            <strong>CDC/Social Security Administration</strong> actuarial survival tables, and Blue Zone demographic research.
          </p>
        </div>
      </main>
    </div>
  );
};
