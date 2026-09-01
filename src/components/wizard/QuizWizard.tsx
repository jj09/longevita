import React, { useState } from 'react';
import { UserProfile } from '../../engine/types';
import { ArrowLeft, ArrowRight, CheckCircle2, HeartPulse, Dna, Activity, Dumbbell, Apple, Brain, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getBMICategoryInfo,
  getSystolicBPInfo,
  getRestingHRInfo,
  getAgeCategoryInfo,
} from '../calculator/sliderHelpers';
import { BMICalculator } from '../calculator/BMICalculator';

import { QUIZ_QUESTIONS } from '../../engine/quizQuestions';

interface QuizWizardProps {
  initialProfile: UserProfile;
  onComplete: (completedProfile: UserProfile) => void;
  onExit: () => void;
}

export const QuizWizard: React.FC<QuizWizardProps> = ({
  initialProfile,
  onComplete,
  onExit,
}) => {
  const [answers, setAnswers] = useState<Partial<UserProfile>>({
    age: initialProfile.age,
    systolicBP: initialProfile.systolicBP,
    diastolicBP: initialProfile.diastolicBP,
    bmi: initialProfile.bmi,
    restingHeartRate: initialProfile.restingHeartRate,
    dailyWaterGlasses: initialProfile.dailyWaterGlasses,
  });
  const [completedProfile, setCompletedProfile] = useState<UserProfile | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const questions = QUIZ_QUESTIONS;

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const isCurrentAnswered =
    currentQ.type === 'slider'
      ? true
      : answers[currentQ.field] !== undefined;

  const getPillarIcon = (pillar: string) => {
    switch (pillar) {
      case 'demographics': return <Dna className="w-4 h-4 text-purple-400" />;
      case 'biometrics': return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'fitness': return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'nutrition': return <Apple className="w-4 h-4 text-amber-400" />;
      case 'lifestyle': return <Brain className="w-4 h-4 text-rose-400" />;
      default: return <HeartPulse className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleSliderValue = (field: keyof UserProfile, value: number) => {
    if (field === 'systolicBP') {
      const estimatedDiastolic = Math.round(70 + (value - 100) * 0.35);
      setAnswers((prev) => ({ ...prev, systolicBP: value, diastolicBP: estimatedDiastolic }));
    } else {
      setAnswers((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSelectOption = (value: any) => {
    setAnswers((prev) => ({ ...prev, [currentQ.field]: value }));
  };

  const handleNext = () => {
    if (!isCurrentAnswered) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const systolic = answers.systolicBP ?? initialProfile.systolicBP;
      const diastolic = answers.diastolicBP ?? Math.round(70 + (systolic - 100) * 0.35);
      const finalProfile: UserProfile = {
        ...initialProfile,
        ...answers,
        diastolicBP: diastolic,
      };
      setCompletedProfile(finalProfile);
      triggerCompletion(finalProfile);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const triggerCompletion = (_finalProfile: UserProfile) => {
    setIsCompleted(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899'],
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Wizard Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-emerald-400 font-bold">({progressPercent}%)</span>
          </div>
        </div>

        {/* Top Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Wizard Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col justify-center">
        {!isCompleted ? (
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative">
            {/* Pillar Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 mb-4">
              {getPillarIcon(currentQ.pillar)}
              <span>{currentQ.pillarLabel}</span>
            </div>

            {/* Question Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
              {currentQ.title}
            </h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              {currentQ.subtitle}
            </p>

            {/* Render Question Input: Options */}
            {currentQ.type === 'options' && (
              <div className="space-y-3">
                {currentQ.options?.map((opt) => {
                  const isSelected = answers[currentQ.field] === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      onClick={() => handleSelectOption(opt.value)}
                      className={`w-full p-4 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                          : 'bg-slate-900/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <div className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {opt.label}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {opt.description}
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                            : 'border-slate-700 group-hover:border-slate-500'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4 fill-current stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Render Question Input: Slider */}
            {currentQ.type === 'slider' && currentQ.sliderConfig && (
              <div className="py-6 space-y-6">
                {/* Dynamic Value & Category Card with Prominent Steppers */}
                <div className="flex flex-col items-center justify-center">
                  <div className="px-6 py-5 rounded-2xl bg-slate-900 border border-slate-700 text-center shadow-xl min-w-[260px]">
                    <div className="flex items-center justify-center gap-4 sm:gap-6">
                      {/* Stepper Decrement */}
                      <button
                        type="button"
                        onClick={() => {
                          const current = (answers[currentQ.field] ?? initialProfile[currentQ.field]) as number;
                          const step = currentQ.sliderConfig!.step;
                          const min = currentQ.sliderConfig!.min;
                          const next = Math.max(min, Number((current - step).toFixed(step < 1 ? 1 : 0)));
                          handleSliderValue(currentQ.field, next);
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-950 border border-slate-700/80 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-slate-600 active:scale-90 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all select-none shadow-md"
                        title="Decrease value"
                      >
                        −
                      </button>

                      <div className="flex items-baseline justify-center gap-1.5 min-w-[120px]">
                        <span className="text-4xl sm:text-5xl font-black text-cyan-300">
                          {currentQ.id === 'bmi'
                            ? ((answers.bmi ?? initialProfile.bmi) as number).toFixed(1)
                            : ((answers[currentQ.field] ?? initialProfile[currentQ.field]) as number)}
                        </span>
                        <span className="text-slate-400 text-sm font-semibold">
                          {currentQ.sliderConfig.unit}
                        </span>
                      </div>

                      {/* Stepper Increment */}
                      <button
                        type="button"
                        onClick={() => {
                          const current = (answers[currentQ.field] ?? initialProfile[currentQ.field]) as number;
                          const step = currentQ.sliderConfig!.step;
                          const max = currentQ.sliderConfig!.max;
                          const next = Math.min(max, Number((current + step).toFixed(step < 1 ? 1 : 0)));
                          handleSliderValue(currentQ.field, next);
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-950 border border-slate-700/80 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-slate-600 active:scale-90 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all select-none shadow-md"
                        title="Increase value"
                      >
                        +
                      </button>
                    </div>

                    {/* Dynamic Category Pill for BMI, Systolic BP, Resting HR, Age, Water */}
                    {currentQ.id === 'bmi' && (() => {
                      const info = getBMICategoryInfo(answers.bmi ?? initialProfile.bmi);
                      return (
                        <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold border ${info.badgeClass}`}>
                          {info.category} ({info.label})
                        </div>
                      );
                    })()}

                    {currentQ.id === 'systolicBP' && (() => {
                      const info = getSystolicBPInfo(answers.systolicBP ?? initialProfile.systolicBP);
                      return (
                        <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold border ${info.badgeClass}`}>
                          {info.category} ({info.label})
                        </div>
                      );
                    })()}

                    {currentQ.id === 'restingHeartRate' && (() => {
                      const info = getRestingHRInfo(answers.restingHeartRate ?? initialProfile.restingHeartRate);
                      return (
                        <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold border ${info.badgeClass}`}>
                          {info.category} ({info.label})
                        </div>
                      );
                    })()}

                    {currentQ.id === 'age' && (() => {
                      const info = getAgeCategoryInfo(answers.age ?? initialProfile.age);
                      return (
                        <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold border ${info.badgeClass}`}>
                          {info.category} ({info.label})
                        </div>
                      );
                    })()}

                    {currentQ.id === 'dailyWaterGlasses' && (() => {
                      const glasses = (answers.dailyWaterGlasses ?? initialProfile.dailyWaterGlasses) as number;
                      const isOptimal = glasses >= 6;
                      return (
                        <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold border ${isOptimal ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`}>
                          {isOptimal ? 'Optimal Hydration (6-8+ glasses)' : 'Suboptimal (< 6 glasses)'}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <input
                  type="range"
                  min={currentQ.sliderConfig.min}
                  max={currentQ.sliderConfig.max}
                  step={currentQ.sliderConfig.step}
                  value={((answers[currentQ.field] ?? initialProfile[currentQ.field]) as number)}
                  onChange={(e) =>
                    handleSliderValue(currentQ.field, Number(e.target.value))
                  }
                  className="w-full"
                />

                {/* Accurate Segmented Scales for Specific Sliders */}
                {currentQ.id === 'bmi' && (
                  <>
                    <div className="space-y-1">
                      <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                        <div style={{ width: '9.6%' }} className="bg-amber-500/60" title="Underweight: <18.5" />
                        <div style={{ width: '25.0%' }} className="bg-emerald-500/70" title="Optimal: 18.5 - 24.9" />
                        <div style={{ width: '19.2%' }} className="bg-amber-500/60" title="Overweight: 25.0 - 29.9" />
                        <div style={{ width: '46.2%' }} className="bg-rose-500/60" title="Obese: 30.0+" />
                      </div>
                      <div className="flex text-xs text-slate-400 font-medium">
                        <span style={{ width: '9.6%' }} className="text-amber-400 truncate">&lt;18.5</span>
                        <span style={{ width: '25.0%' }} className="text-emerald-400 truncate pl-1">18.5-24.9 Optimal</span>
                        <span style={{ width: '19.2%' }} className="text-amber-400 truncate pl-1">25-29.9 Overweight</span>
                        <span style={{ width: '46.2%' }} className="text-rose-400 truncate text-right">30.0+ Obese</span>
                      </div>
                    </div>

                    {/* Integrated Height, Weight & Gender BMI Calculator */}
                    <BMICalculator
                      currentBMI={answers.bmi ?? initialProfile.bmi}
                      currentSex={answers.sex ?? initialProfile.sex}
                      onUpdateBMI={(bmi) => setAnswers((prev) => ({ ...prev, bmi }))}
                      onUpdateSex={(sex) => setAnswers((prev) => ({ ...prev, sex }))}
                      isOpenDefault={false}
                    />
                  </>
                )}

                {currentQ.id === 'systolicBP' && (
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                      <div style={{ width: '26.7%' }} className="bg-emerald-500/70" title="Optimal: <120" />
                      <div style={{ width: '13.3%' }} className="bg-cyan-500/60" title="Elevated: 120-129" />
                      <div style={{ width: '13.3%' }} className="bg-amber-500/60" title="Stage 1: 130-139" />
                      <div style={{ width: '26.7%' }} className="bg-orange-500/60" title="Stage 2: 140-159" />
                      <div style={{ width: '20.0%' }} className="bg-rose-500/60" title="Severe: 160+" />
                    </div>
                    <div className="flex text-xs text-slate-400 font-medium">
                      <span style={{ width: '26.7%' }} className="text-emerald-400 truncate">&lt;120 Optimal</span>
                      <span style={{ width: '13.3%' }} className="text-cyan-400 truncate pl-0.5">120-129</span>
                      <span style={{ width: '13.3%' }} className="text-amber-400 truncate pl-0.5">130-139</span>
                      <span style={{ width: '26.7%' }} className="text-orange-400 truncate pl-0.5">140-159</span>
                      <span style={{ width: '20.0%' }} className="text-rose-400 truncate text-right">160+</span>
                    </div>
                  </div>
                )}

                {currentQ.id === 'restingHeartRate' && (
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                      <div style={{ width: '27.3%' }} className="bg-emerald-500/70" title="Athletic: <60 bpm" />
                      <div style={{ width: '18.2%' }} className="bg-teal-500/60" title="Good: 60-70 bpm" />
                      <div style={{ width: '18.2%' }} className="bg-cyan-500/60" title="Normal: 71-80 bpm" />
                      <div style={{ width: '18.2%' }} className="bg-amber-500/60" title="Elevated: 81-90 bpm" />
                      <div style={{ width: '18.1%' }} className="bg-rose-500/60" title="High: >90 bpm" />
                    </div>
                    <div className="flex text-xs text-slate-400 font-medium">
                      <span style={{ width: '27.3%' }} className="text-emerald-400 truncate">&lt;60 Athletic</span>
                      <span style={{ width: '18.2%' }} className="text-teal-400 truncate pl-0.5">60-70</span>
                      <span style={{ width: '18.2%' }} className="text-cyan-400 truncate pl-0.5">71-80</span>
                      <span style={{ width: '18.2%' }} className="text-amber-400 truncate pl-0.5">81-90</span>
                      <span style={{ width: '18.1%' }} className="text-rose-400 truncate text-right">&gt;90 High</span>
                    </div>
                  </div>
                )}

                {currentQ.id === 'dailyWaterGlasses' && (
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                      <div style={{ width: '33.3%' }} className="bg-amber-500/60" title="Suboptimal: 2-5 glasses" />
                      <div style={{ width: '66.7%' }} className="bg-cyan-500/70" title="Optimal: 6-14 glasses" />
                    </div>
                    <div className="flex text-xs text-slate-400 font-medium">
                      <span style={{ width: '33.3%' }} className="text-amber-400 truncate">2-5 Suboptimal</span>
                      <span style={{ width: '66.7%' }} className="text-cyan-400 truncate pl-1">6-14 Optimal (6-8+ Recommended)</span>
                    </div>
                  </div>
                )}

                {currentQ.id === 'age' && (
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                      <div style={{ width: '22.1%' }} className="bg-cyan-500/60" title="Young Adult: 18–34" />
                      <div style={{ width: '26.0%' }} className="bg-emerald-500/70" title="Prime Midlife: 35–54" />
                      <div style={{ width: '26.0%' }} className="bg-amber-500/60" title="Mature Adult: 55–74" />
                      <div style={{ width: '25.9%' }} className="bg-purple-500/60" title="Senior Horizon: 75–95" />
                    </div>
                    <div className="flex text-xs text-slate-400 font-medium">
                      <span style={{ width: '22.1%' }} className="text-cyan-400 truncate">18 Min</span>
                      <span style={{ width: '26.0%' }} className="text-emerald-400 truncate pl-0.5">35y Prime</span>
                      <span style={{ width: '26.0%' }} className="text-amber-400 truncate pl-0.5">55y Mature</span>
                      <span style={{ width: '25.9%' }} className="text-purple-400 truncate text-right">75-95y Senior</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Step Navigation Buttons */}
            <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <button
                onClick={handleBack}
                disabled={currentIndex === 0}
                className={`px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all min-h-[48px] ${
                  currentIndex === 0
                    ? 'text-slate-600 cursor-not-allowed opacity-50'
                    : 'text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 active:scale-95'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className={`px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center gap-2 shadow-lg min-h-[48px] ${
                  isCurrentAnswered
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-95 cursor-pointer'
                    : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed shadow-none opacity-60'
                }`}
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish & Calculate' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="glass-panel rounded-3xl p-6 sm:p-12 border border-emerald-500/40 text-center shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Assessment Complete!
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto mt-3 leading-relaxed">
              Your personalized longevity analysis is ready with real-time live parameter controls and 
              Bang-for-the-Buck recommendations.
            </p>

            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={() => onComplete(completedProfile || initialProfile)}
                className="w-full sm:w-auto px-6 py-4 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-extrabold text-base sm:text-lg transition-all hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-emerald-500/40 flex items-center justify-center gap-3 min-h-[52px]"
              >
                <span>View My Longevity Report & Live Optimizer</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
