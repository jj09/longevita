import React, { useState } from 'react';
import { UserProfile } from '../../engine/types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Dna,
  Activity,
  Dumbbell,
  Apple,
  Brain,
  Trophy,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getBMICategoryInfo,
  getSystolicBPInfo,
  getDiastolicBPInfo,
  getRestingHRInfo,
  getAgeCategoryInfo,
} from '../calculator/sliderHelpers';
import { getBloodPressureCategory, calculateProgressiveLongevity } from '../../engine/longevityEngine';
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
  });
  const [completedProfile, setCompletedProfile] = useState<UserProfile | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const questions = QUIZ_QUESTIONS;

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const isCurrentAnswered =
    currentQ.type === 'slider' || currentQ.type === 'bp_slider'
      ? true
      : answers[currentQ.field] !== undefined;

  // Include active question defaults for sliders so live engine responds immediately to slider changes
  const effectiveAnswers: Partial<UserProfile> = { ...answers };
  if (currentQ.type === 'slider' && effectiveAnswers[currentQ.field] === undefined) {
    effectiveAnswers[currentQ.field] = initialProfile[currentQ.field] as any;
  }
  if (currentQ.type === 'bp_slider') {
    if (effectiveAnswers.systolicBP === undefined) effectiveAnswers.systolicBP = initialProfile.systolicBP;
    if (effectiveAnswers.diastolicBP === undefined) effectiveAnswers.diastolicBP = initialProfile.diastolicBP;
  }

  // Real-Time Longevity Engine Calculation (Progressive Accumulation)
  const liveResult = calculateProgressiveLongevity(
    effectiveAnswers,
    initialProfile.age,
    (effectiveAnswers.sex ?? initialProfile.sex)
  );
  const liveLifespan = liveResult.projectedLifespan;
  const liveNetDelta = liveResult.netDelta;

  const totalQuestions = questions.length;
  const calibrationStep = Math.max(1, Math.min(totalQuestions, currentIndex + 1));

  // Progressive narrowing uncertainty margin (±12.0y at Q1 -> ±2.5y at Q30)
  const uncertaintyMargin = Number(
    (11.5 * Math.sqrt((totalQuestions - calibrationStep) / totalQuestions) + 2.5).toFixed(1)
  );

  const ciLow = Number((liveLifespan - uncertaintyMargin).toFixed(1));
  const ciHigh = Number((liveLifespan + uncertaintyMargin).toFixed(1));

  // Model calibration precision score (25% at Q1 -> 98% at Q30)
  const precisionPercent = Math.min(
    98,
    Math.round(25 + (calibrationStep / totalQuestions) * 73)
  );

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
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectOption = (value: any) => {
    setAnswers((prev) => ({ ...prev, [currentQ.field]: value }));
  };

  const handleNext = () => {
    if (!isCurrentAnswered) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalProfile: UserProfile = {
        ...initialProfile,
        ...effectiveAnswers,
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
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 md:py-10 flex flex-col justify-center">
        {!isCompleted ? (
          <>
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
              <div className="py-4 space-y-6">
                {currentQ.id === 'systolicBP' ? (
                  /* ==================================================== */
                  /* DUAL BLOOD PRESSURE INPUTS (SYSTOLIC & DIASTOLIC) */
                  /* ==================================================== */
                  <div className="space-y-5">
                    {/* Overall Clinical BP Status Badge */}
                    {(() => {
                      const systolic = (answers.systolicBP ?? initialProfile.systolicBP) as number;
                      const diastolic = (answers.diastolicBP ?? initialProfile.diastolicBP) as number;
                      const bpCategory = getBloodPressureCategory(systolic, diastolic);

                      const categoryConfig: Record<string, { label: string; delta: string; badge: string }> = {
                        optimal: { label: 'Optimal Blood Pressure', delta: '+2.0 yrs', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
                        elevated: { label: 'Elevated Blood Pressure', delta: '0.0 yrs baseline', badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
                        stage1: { label: 'Stage 1 Hypertension', delta: '-1.5 yrs', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
                        stage2: { label: 'Stage 2 Hypertension', delta: '-3.5 yrs', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
                        severe_untreated: { label: 'Severe Hypertension', delta: '-6.0 yrs', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
                      };

                      const meta = categoryConfig[bpCategory] || categoryConfig.optimal;

                      return (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-sm">
                              BP
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Clinical Reading</div>
                              <div className="text-base sm:text-lg font-extrabold text-white">
                                {systolic} / {diastolic} <span className="text-xs font-normal text-slate-400">mmHg</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${meta.badge}`}>
                            {meta.label} ({meta.delta})
                          </div>
                        </div>
                      );
                    })()}

                    {/* Dual Inputs Grid: Systolic & Diastolic */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      {/* 1. Systolic Blood Pressure (Top Number) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-slate-200">Systolic (Upper)</div>
                            <div className="text-xs text-slate-400">Peak arterial contraction</div>
                          </div>
                          {(() => {
                            const info = getSystolicBPInfo((answers.systolicBP ?? initialProfile.systolicBP) as number);
                            return (
                              <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${info.badgeClass}`}>
                                {info.category}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Stepper + Big Value */}
                        <div className="flex items-center justify-center gap-3 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              const current = (answers.systolicBP ?? initialProfile.systolicBP) as number;
                              handleSliderValue('systolicBP', Math.max(100, current - 1));
                            }}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 hover:text-white hover:bg-slate-800 active:scale-90 flex items-center justify-center text-xl font-black transition-all select-none shadow-md"
                            title="Decrease Systolic"
                          >
                            −
                          </button>
                          <div className="flex items-baseline justify-center gap-1 min-w-[90px] text-center">
                            <span className="text-3xl font-black text-cyan-300">
                              {answers.systolicBP ?? initialProfile.systolicBP}
                            </span>
                            <span className="text-slate-400 text-xs font-semibold">mmHg</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const current = (answers.systolicBP ?? initialProfile.systolicBP) as number;
                              handleSliderValue('systolicBP', Math.min(175, current + 1));
                            }}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 hover:text-white hover:bg-slate-800 active:scale-90 flex items-center justify-center text-xl font-black transition-all select-none shadow-md"
                            title="Increase Systolic"
                          >
                            +
                          </button>
                        </div>

                        <input
                          type="range"
                          min={100}
                          max={175}
                          step={1}
                          value={(answers.systolicBP ?? initialProfile.systolicBP) as number}
                          onChange={(e) => handleSliderValue('systolicBP', Number(e.target.value))}
                          className="w-full"
                        />

                        {/* Systolic Segmented Scale */}
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded-full flex overflow-hidden bg-slate-800">
                            <div style={{ width: '26.7%' }} className="bg-emerald-500/70" title="Optimal: <120" />
                            <div style={{ width: '13.3%' }} className="bg-cyan-500/60" title="Elevated: 120-129" />
                            <div style={{ width: '13.3%' }} className="bg-amber-500/60" title="Stage 1: 130-139" />
                            <div style={{ width: '26.7%' }} className="bg-orange-500/60" title="Stage 2: 140-159" />
                            <div style={{ width: '20.0%' }} className="bg-rose-500/60" title="Severe: 160+" />
                          </div>
                          <div className="flex text-[10px] text-slate-400 font-medium">
                            <span style={{ width: '26.7%' }} className="text-emerald-400 truncate">&lt;120</span>
                            <span style={{ width: '13.3%' }} className="text-cyan-400 truncate pl-0.5">120-129</span>
                            <span style={{ width: '13.3%' }} className="text-amber-400 truncate pl-0.5">130-139</span>
                            <span style={{ width: '26.7%' }} className="text-orange-400 truncate pl-0.5">140-159</span>
                            <span style={{ width: '20.0%' }} className="text-rose-400 truncate text-right">160+</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Diastolic Blood Pressure (Bottom Number) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-slate-200">Diastolic (Lower)</div>
                            <div className="text-xs text-slate-400">Resting arterial pressure</div>
                          </div>
                          {(() => {
                            const info = getDiastolicBPInfo((answers.diastolicBP ?? initialProfile.diastolicBP) as number);
                            return (
                              <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${info.badgeClass}`}>
                                {info.category}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Stepper + Big Value */}
                        <div className="flex items-center justify-center gap-3 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              const current = (answers.diastolicBP ?? initialProfile.diastolicBP) as number;
                              handleSliderValue('diastolicBP', Math.max(60, current - 1));
                            }}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 hover:text-white hover:bg-slate-800 active:scale-90 flex items-center justify-center text-xl font-black transition-all select-none shadow-md"
                            title="Decrease Diastolic"
                          >
                            −
                          </button>
                          <div className="flex items-baseline justify-center gap-1 min-w-[90px] text-center">
                            <span className="text-3xl font-black text-cyan-300">
                              {answers.diastolicBP ?? initialProfile.diastolicBP}
                            </span>
                            <span className="text-slate-400 text-xs font-semibold">mmHg</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const current = (answers.diastolicBP ?? initialProfile.diastolicBP) as number;
                              handleSliderValue('diastolicBP', Math.min(115, current + 1));
                            }}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 hover:text-white hover:bg-slate-800 active:scale-90 flex items-center justify-center text-xl font-black transition-all select-none shadow-md"
                            title="Increase Diastolic"
                          >
                            +
                          </button>
                        </div>

                        <input
                          type="range"
                          min={60}
                          max={115}
                          step={1}
                          value={(answers.diastolicBP ?? initialProfile.diastolicBP) as number}
                          onChange={(e) => handleSliderValue('diastolicBP', Number(e.target.value))}
                          className="w-full"
                        />

                        {/* Diastolic Segmented Scale */}
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded-full flex overflow-hidden bg-slate-800">
                            <div style={{ width: '36.4%' }} className="bg-emerald-500/70" title="Optimal: <80" />
                            <div style={{ width: '18.2%' }} className="bg-amber-500/60" title="Stage 1: 80-89" />
                            <div style={{ width: '18.2%' }} className="bg-orange-500/60" title="Stage 2: 90-99" />
                            <div style={{ width: '27.2%' }} className="bg-rose-500/60" title="Severe: 100+" />
                          </div>
                          <div className="flex text-[10px] text-slate-400 font-medium">
                            <span style={{ width: '36.4%' }} className="text-emerald-400 truncate">&lt;80</span>
                            <span style={{ width: '18.2%' }} className="text-amber-400 truncate pl-0.5">80-89</span>
                            <span style={{ width: '18.2%' }} className="text-orange-400 truncate pl-0.5">90-99</span>
                            <span style={{ width: '27.2%' }} className="text-rose-400 truncate text-right">100+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ==================================================== */
                  /* STANDARD SINGLE SLIDER (BMI, RESTING HR, WATER, AGE) */
                  /* ==================================================== */
                  <>
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

                        {/* Dynamic Category Pill for BMI, Resting HR, Age, Water */}
                        {currentQ.id === 'bmi' && (() => {
                          const info = getBMICategoryInfo(answers.bmi ?? initialProfile.bmi);
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
                  </>
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

          {/* Real-Time Telemetry HUD (Positioned Below Question) */}
          <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Live Projected Lifespan + Delta */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span>Live Longevity Projection</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {liveLifespan} <span className="text-xs sm:text-sm font-semibold text-slate-400">yrs</span>
                      </span>
                      <span
                        className={`text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
                          liveNetDelta >= 0
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {liveNetDelta >= 0 ? `+${liveNetDelta}y vs base` : `${liveNetDelta}y vs base`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Confidence Interval & Narrowing Precision */}
                <div className="flex flex-col sm:items-end justify-center bg-slate-950/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-slate-800/60 sm:border-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                    <span className="text-slate-400 font-normal">Likely Horizon:</span>
                    <span className="font-bold text-cyan-300">{ciLow} – {ciHigh} yrs</span>
                    <span className="text-[11px] text-slate-400 font-mono">(±{uncertaintyMargin}y)</span>
                  </div>

                  {/* Precision Caliper Progress */}
                  <div className="flex items-center gap-2 mt-1.5 w-full sm:w-48">
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${precisionPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 flex-shrink-0">
                      {precisionPercent}% Calibrated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
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
