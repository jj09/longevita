import React, { useState } from 'react';
import { UserProfile } from '../../engine/types';
import { Dna, Activity, Dumbbell, Apple, Brain, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  getBMICategoryInfo,
  getSystolicBPInfo,
  getDiastolicBPInfo,
  getRestingHRInfo,
  getHydrationInfo,
  getAgeCategoryInfo,
} from './sliderHelpers';
import { BMICalculator } from './BMICalculator';

interface LiveParameterControlsProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
}

export const LiveParameterControls: React.FC<LiveParameterControlsProps> = ({ profile, onChange }) => {
  const [activeTab, setActiveTab] = useState<'demographics' | 'biometrics' | 'fitness' | 'nutrition' | 'lifestyle'>('biometrics');

  const bmiInfo = getBMICategoryInfo(profile.bmi);
  const sysInfo = getSystolicBPInfo(profile.systolicBP);
  const diaInfo = getDiastolicBPInfo(profile.diastolicBP);
  const hrInfo = getRestingHRInfo(profile.restingHeartRate);
  const waterInfo = getHydrationInfo(profile.dailyWaterGlasses);
  const ageInfo = getAgeCategoryInfo(profile.age);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    onChange({ ...profile, [key]: value });
  };

  const tabs = [
    { id: 'biometrics', label: 'Biometrics', icon: Activity, count: '5 metrics' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, count: '4 metrics' },
    { id: 'nutrition', label: 'Nutrition', icon: Apple, count: '6 metrics' },
    { id: 'lifestyle', label: 'Lifestyle & Mind', icon: Brain, count: '9 metrics' },
    { id: 'demographics', label: 'Demographics', icon: Dna, count: '5 metrics' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Live Longevity Parameter Controls</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h2>
          <p className="text-xs text-slate-400">
            Tweak any parameter below to immediately see real-time adjustments on your lifespan & ROI
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 mb-5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* ==================================================== */}
        {/* 1. BIOMETRICS & CLINICAL MARKERS */}
        {/* ==================================================== */}
        {activeTab === 'biometrics' && (
          <div className="space-y-5">
            {/* Blood Pressure Slider */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <span>Systolic Blood Pressure</span>
                  </label>
                  <p className="text-xs text-slate-400">Target: &lt;120 mmHg optimal</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => update('systolicBP', Math.max(95, profile.systolicBP - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Decrease Systolic BP"
                    >
                      −
                    </button>
                    <span className="w-px h-4 bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => update('systolicBP', Math.min(180, profile.systolicBP + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Increase Systolic BP"
                    >
                      +
                    </button>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${sysInfo.badgeClass}`}>
                    {profile.systolicBP} mmHg • {sysInfo.category}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="95"
                max="180"
                step="1"
                value={profile.systolicBP}
                onChange={(e) => update('systolicBP', Number(e.target.value))}
                className="w-full"
              />
              {/* Mathematically Accurate Segmented Visual Scale */}
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                  <div style={{ width: '29.4%' }} className="bg-emerald-500/70" title="Optimal: <120" />
                  <div style={{ width: '11.8%' }} className="bg-cyan-500/60" title="Elevated: 120-129" />
                  <div style={{ width: '11.8%' }} className="bg-amber-500/60" title="Stage 1: 130-139" />
                  <div style={{ width: '23.5%' }} className="bg-orange-500/60" title="Stage 2: 140-159" />
                  <div style={{ width: '23.5%' }} className="bg-rose-500/60" title="Severe: 160+" />
                </div>
                <div className="flex text-xs text-slate-400 font-medium">
                  <span style={{ width: '29.4%' }} className="text-emerald-400 truncate">Optimal (&lt;120)</span>
                  <span style={{ width: '11.8%' }} className="text-cyan-400 truncate pl-0.5">120-129</span>
                  <span style={{ width: '11.8%' }} className="text-amber-400 truncate pl-0.5">130-139</span>
                  <span style={{ width: '23.5%' }} className="text-orange-400 truncate pl-0.5">140-159</span>
                  <span style={{ width: '23.5%' }} className="text-rose-400 truncate text-right">160+</span>
                </div>
              </div>
            </div>

            {/* Diastolic BP Slider */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-bold text-slate-200">Diastolic Blood Pressure</label>
                  <p className="text-xs text-slate-400">Target: &lt;80 mmHg optimal</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => update('diastolicBP', Math.max(60, profile.diastolicBP - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Decrease Diastolic BP"
                    >
                      −
                    </button>
                    <span className="w-px h-4 bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => update('diastolicBP', Math.min(115, profile.diastolicBP + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Increase Diastolic BP"
                    >
                      +
                    </button>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${diaInfo.badgeClass}`}>
                    {profile.diastolicBP} mmHg • {diaInfo.category}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="60"
                max="115"
                step="1"
                value={profile.diastolicBP}
                onChange={(e) => update('diastolicBP', Number(e.target.value))}
                className="w-full"
              />
              {/* Mathematically Accurate Segmented Visual Scale */}
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                  <div style={{ width: '36.4%' }} className="bg-emerald-500/70" title="Optimal: <80" />
                  <div style={{ width: '18.2%' }} className="bg-amber-500/60" title="Stage 1: 80-89" />
                  <div style={{ width: '18.2%' }} className="bg-orange-500/60" title="Stage 2: 90-99" />
                  <div style={{ width: '27.2%' }} className="bg-rose-500/60" title="Severe: 100+" />
                </div>
                <div className="flex text-xs text-slate-400 font-medium">
                  <span style={{ width: '36.4%' }} className="text-emerald-400 truncate">Optimal (&lt;80)</span>
                  <span style={{ width: '18.2%' }} className="text-amber-400 truncate pl-0.5">80-89</span>
                  <span style={{ width: '18.2%' }} className="text-orange-400 truncate pl-0.5">90-99</span>
                  <span style={{ width: '27.2%' }} className="text-rose-400 truncate text-right">100+</span>
                </div>
              </div>
            </div>

            {/* Blood Sugar / Metabolic Status */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-sm font-bold text-slate-200 block mb-1">
                Fasting Blood Sugar & Metabolic Health
              </label>
              <p className="text-xs text-slate-400 mb-3">Fasting glucose & HbA1c control</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'normal', label: 'Normal (<100 mg/dL)', desc: 'Optimal' },
                  { value: 'prediabetes', label: 'Prediabetes (100-125)', desc: 'Early resistance' },
                  { value: 'type2_controlled', label: 'T2D Controlled', desc: 'HbA1c < 7%' },
                  { value: 'type2_uncontrolled', label: 'T2D Uncontrolled', desc: 'HbA1c >= 8%' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('bloodSugar', opt.value as any)}
                    className={`p-3 rounded-xl text-left text-xs sm:text-sm transition-all border min-h-[48px] ${
                      profile.bloodSugar === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lipid / Cholesterol Profile */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-sm font-bold text-slate-200 block mb-1">
                Lipids & Cholesterol (ApoB / LDL / Triglycerides)
              </label>
              <p className="text-xs text-slate-400 mb-3">Cardiovascular atheroma plaque risk</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'optimal', label: 'Optimal Lipids', desc: 'ApoB < 70 mg/dL' },
                  { value: 'moderate_high', label: 'Moderate High', desc: 'Mild elevation' },
                  { value: 'high_uncontrolled', label: 'High Unmanaged', desc: 'Untreated high LDL' },
                  { value: 'high_managed_statin', label: 'Statin Managed', desc: 'Controlled on med' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('lipidStatus', opt.value as any)}
                    className={`p-3 rounded-xl text-left text-xs sm:text-sm transition-all border min-h-[48px] ${
                      profile.lipidStatus === opt.value
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* BMI Slider */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-bold text-slate-200">Body Mass Index (BMI)</label>
                  <p className="text-xs text-slate-400">Healthy longevity range: 18.5 – 24.9</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => update('bmi', Math.max(16.0, Number((profile.bmi - 0.1).toFixed(1))))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Decrease BMI by 0.1"
                    >
                      −
                    </button>
                    <span className="w-px h-4 bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => update('bmi', Math.min(42.0, Number((profile.bmi + 0.1).toFixed(1))))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Increase BMI by 0.1"
                    >
                      +
                    </button>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${bmiInfo.badgeClass}`}>
                    BMI {profile.bmi.toFixed(1)} • {bmiInfo.category}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="16.0"
                max="42.0"
                step="0.1"
                value={profile.bmi}
                onChange={(e) => update('bmi', Number(e.target.value))}
                className="w-full"
              />
              {/* Mathematically Accurate Segmented Visual Scale */}
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                  <div style={{ width: '9.6%' }} className="bg-amber-500/60" title="Underweight: <18.5" />
                  <div style={{ width: '25.0%' }} className="bg-emerald-500/70" title="Optimal: 18.5 - 24.9" />
                  <div style={{ width: '19.2%' }} className="bg-amber-500/60" title="Overweight: 25.0 - 29.9" />
                  <div style={{ width: '46.2%' }} className="bg-rose-500/60" title="Obese: 30.0+" />
                </div>
                <div className="flex text-xs text-slate-400 font-medium">
                  <span style={{ width: '9.6%' }} className="text-amber-400 truncate">&lt;18.5</span>
                  <span style={{ width: '25.0%' }} className="text-emerald-400 truncate pl-0.5">18.5-24.9 Optimal</span>
                  <span style={{ width: '19.2%' }} className="text-amber-400 truncate pl-0.5">25-29.9 Overweight</span>
                  <span style={{ width: '46.2%' }} className="text-rose-400 truncate text-right">30.0+ Obese</span>
                </div>
              </div>

              {/* Integrated Height, Weight & Gender BMI Calculator */}
              <BMICalculator
                currentBMI={profile.bmi}
                currentSex={profile.sex}
                onUpdateBMI={(bmi) => update('bmi', bmi)}
                onUpdateSex={(sex) => update('sex', sex)}
                isOpenDefault={false}
              />
            </div>

            {/* Resting Heart Rate Slider */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-bold text-slate-200">Resting Heart Rate</label>
                  <p className="text-xs text-slate-400">Cardiovascular fitness & vagal tone</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => update('restingHeartRate', Math.max(45, profile.restingHeartRate - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Decrease Resting HR"
                    >
                      −
                    </button>
                    <span className="w-px h-4 bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => update('restingHeartRate', Math.min(105, profile.restingHeartRate + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Increase Resting HR"
                    >
                      +
                    </button>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${hrInfo.badgeClass}`}>
                    {profile.restingHeartRate} bpm • {hrInfo.category}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="45"
                max="105"
                step="1"
                value={profile.restingHeartRate}
                onChange={(e) => update('restingHeartRate', Number(e.target.value))}
                className="w-full"
              />
              {/* Mathematically Accurate Segmented Visual Scale */}
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                  <div style={{ width: '25.0%' }} className="bg-emerald-500/70" title="Athletic: <60 bpm" />
                  <div style={{ width: '16.7%' }} className="bg-teal-500/60" title="Good: 60-70 bpm" />
                  <div style={{ width: '16.7%' }} className="bg-cyan-500/60" title="Normal: 71-80 bpm" />
                  <div style={{ width: '16.7%' }} className="bg-amber-500/60" title="Elevated: 81-90 bpm" />
                  <div style={{ width: '24.9%' }} className="bg-rose-500/60" title="High: >90 bpm" />
                </div>
                <div className="flex text-xs text-slate-400 font-medium">
                  <span style={{ width: '25.0%' }} className="text-emerald-400 truncate">&lt;60 Athletic</span>
                  <span style={{ width: '16.7%' }} className="text-teal-400 truncate pl-0.5">60-70</span>
                  <span style={{ width: '16.7%' }} className="text-cyan-400 truncate pl-0.5">71-80</span>
                  <span style={{ width: '16.7%' }} className="text-amber-400 truncate pl-0.5">81-90</span>
                  <span style={{ width: '24.9%' }} className="text-rose-400 truncate text-right">&gt;90 High</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 2. FITNESS & PHYSICAL ACTIVITY */}
        {/* ==================================================== */}
        {activeTab === 'fitness' && (
          <div className="space-y-5">
            {/* Aerobic Cardio */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Aerobic Cardio & Zone 2 Training
              </label>
              <p className="text-[11px] text-slate-400 mb-3">Mitochondrial conditioning and VO2 max</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'sedentary', label: 'Sedentary', desc: '0 min/week' },
                  { value: 'light', label: 'Light', desc: '< 60 min/week' },
                  { value: 'moderate', label: 'Moderate', desc: '150 min/week' },
                  { value: 'high', label: 'Optimal / High', desc: '300+ min/week' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('cardio', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.cardio === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Strength Training */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Strength & Progressive Resistance Training
              </label>
              <p className="text-[11px] text-slate-400 mb-3">Preserves muscle mass (anti-sarcopenia) and bone density</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'none', label: 'None', desc: '0 days/week' },
                  { value: 'occasional', label: 'Occasional', desc: '1-2 days/week' },
                  { value: 'optimal', label: 'Optimal', desc: '3+ days/week' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('strengthTraining', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.strengthTraining === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Steps */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Daily Step Count & Non-Exercise Movement (NEAT)
              </label>
              <p className="text-[11px] text-slate-400 mb-3">Daily metabolic activity and vascular flow</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'under_4k', label: '< 4,000 steps', desc: 'Low movement' },
                  { value: '4k_to_7k', label: '4,000 - 7,000', desc: 'Moderate' },
                  { value: '8k_to_10k', label: '8,000 - 10,000', desc: 'Recommended' },
                  { value: 'over_10k', label: '10,000+ steps', desc: 'Optimal' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('dailySteps', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.dailySteps === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Sitting Hours */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Sedentary Sitting Duration
              </label>
              <p className="text-[11px] text-slate-400 mb-3">Continuous desk sitting vs active standing breaks</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'under_4h', label: '< 4 hours/day', desc: 'Active lifestyle' },
                  { value: '4h_to_8h', label: '4 - 8 hours/day', desc: 'Average desk work' },
                  { value: 'over_8h', label: '8+ hours/day', desc: 'High sedentary' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('sittingHours', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.sittingHours === opt.value
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 3. NUTRITION & BLUE ZONE DIET */}
        {/* ==================================================== */}
        {activeTab === 'nutrition' && (
          <div className="space-y-5">
            {/* Dietary Pattern */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Overall Dietary Pattern
              </label>
              <p className="text-[11px] text-slate-400 mb-3">Blue Zone whole foods vs standard processed</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'standard_processed', label: 'Standard Processed', desc: 'High refined carbs & fast food' },
                  { value: 'moderate_balanced', label: 'Balanced Whole Foods', desc: 'Home-cooked varied diet' },
                  { value: 'mediterranean_bluezone', label: 'Mediterranean / Blue Zone', desc: 'Olive oil, legumes, plants & wild fish' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('dietPattern', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.dietPattern === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Red & Processed Meat */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Red & Processed Meat Frequency
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'frequent_daily', label: 'Daily / Frequent', desc: 'Bacon, sausage, beef' },
                  { value: 'weekly_moderate', label: 'Weekly (1-2x/wk)', desc: 'Moderate' },
                  { value: 'rare_none', label: 'Rare / None', desc: 'Fish & plant proteins' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('redMeat', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.redMeat === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fruits & Vegetables */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Daily Fruits, Vegetables & Fiber
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'under_2', label: '< 2 servings/day', desc: 'Low fiber' },
                  { value: '2_to_4', label: '2 - 4 servings/day', desc: 'Moderate' },
                  { value: '5_plus', label: '5+ servings/day', desc: 'Optimal gut diversity' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('veggieFruitServings', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.veggieFruitServings === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ultra-processed / Sugar */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Ultra-Processed Foods & Sugary Drinks
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'daily_frequent', label: 'Daily / Sodas', desc: 'High sugar/snacks' },
                  { value: 'occasional', label: 'Occasional', desc: '1-2x/week' },
                  { value: 'minimal_rare', label: 'Minimal / Rare', desc: 'Clean whole foods' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('ultraProcessed', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.ultraProcessed === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Polyphenols & Green Tea */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Polyphenols (Green Tea, Coffee, Berries)
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'none', label: 'None', desc: 'No tea/berries' },
                  { value: 'moderate_coffee_tea', label: 'Moderate Coffee/Tea', desc: '1-3 cups daily' },
                  { value: 'high_green_tea_berries', label: 'High EGCG Green Tea', desc: 'Matcha & daily berries' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('polyphenols', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.polyphenols === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Water Glasses */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-bold text-slate-200">Daily Water Hydration</label>
                  <p className="text-xs text-slate-400">Optimal: 6 - 8+ glasses</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => update('dailyWaterGlasses', Math.max(2, profile.dailyWaterGlasses - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Decrease Glasses"
                    >
                      −
                    </button>
                    <span className="w-px h-4 bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => update('dailyWaterGlasses', Math.min(14, profile.dailyWaterGlasses + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Increase Glasses"
                    >
                      +
                    </button>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${waterInfo.badgeClass}`}>
                    {profile.dailyWaterGlasses} glasses/day • {waterInfo.category}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="2"
                max="14"
                step="1"
                value={profile.dailyWaterGlasses}
                onChange={(e) => update('dailyWaterGlasses', Number(e.target.value))}
                className="w-full"
              />
              {/* Mathematically Accurate Segmented Visual Scale */}
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800">
                  <div style={{ width: '33.3%' }} className="bg-amber-500/60" title="Suboptimal: 2-5 glasses" />
                  <div style={{ width: '66.7%' }} className="bg-cyan-500/70" title="Optimal: 6-14 glasses" />
                </div>
                <div className="flex text-xs text-slate-400 font-medium">
                  <span style={{ width: '33.3%' }} className="text-amber-400 truncate">2-5 Suboptimal</span>
                  <span style={{ width: '66.7%' }} className="text-cyan-400 truncate pl-1">6-14 Optimal (6-8+ Recommended)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 4. LIFESTYLE, SLEEP & MIND */}
        {/* ==================================================== */}
        {activeTab === 'lifestyle' && (
          <div className="space-y-5">
            {/* Smoking Status */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Smoking & Tobacco / Vaping Status
              </label>
              <p className="text-[11px] text-slate-400 mb-3">#1 modifiable risk factor</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { value: 'never', label: 'Never Smoked', desc: 'Clean' },
                  { value: 'former_long', label: 'Former (>10y)', desc: 'Reversed' },
                  { value: 'former_recent', label: 'Former (<5y)', desc: 'Recovering' },
                  { value: 'current_light', label: 'Light / Vape', desc: '< 10/day' },
                  { value: 'current_heavy', label: 'Heavy Smoker', desc: '1+ pack/day' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('smoking', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.smoking === opt.value
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Flossing (Living to 100 Landmark Factor!) */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 bg-emerald-950/10">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daily Dental Flossing (Oral Microbiome)</span>
                </label>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  Top Micro-Win
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Clears oral endotoxins linked to systemic inflammation and arterial plaque
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'daily_flossing', label: 'Daily Flossing', desc: '+1.2 yrs life' },
                  { value: 'occasional', label: 'Occasional', desc: '1-3x/week' },
                  { value: 'rarely_never', label: 'Rarely / Never', desc: '-1.2 yrs penalty' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('flossing', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.flossing === opt.value
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Hours & Quality */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Sleep Duration & Quality
              </label>
              <p className="text-[11px] text-slate-400 mb-3">Glymphatic brain clearance & hormonal recovery</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: '7_to_8h_optimal', label: '7-8 Hours Optimal', desc: 'Restful & deep' },
                  { value: '6_to_7h', label: '6 - 7 Hours', desc: 'Average' },
                  { value: 'under_6h', label: '< 6 Hours', desc: 'Chronic deprivation' },
                  { value: 'chronic_apnea_insomnia', label: 'Sleep Apnea / Insomnia', desc: 'Disrupted oxygen' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('sleep', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.sleep === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stress & Mindset */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Chronic Stress Management & Coping
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'well_managed_mindful', label: 'Mindful & Resilient', desc: 'Active coping/calm' },
                  { value: 'moderate_daily', label: 'Moderate Daily', desc: 'Average stress' },
                  { value: 'severe_unmanaged', label: 'Severe / Unmanaged', desc: 'High cortisol' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('stress', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.stress === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Social Connection */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Social Connection & Community (Blue Zone Moai)
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'strong_connected', label: 'Strong & Connected', desc: 'Close circle & purpose' },
                  { value: 'moderate', label: 'Moderate Network', desc: 'Occasional social' },
                  { value: 'isolated', label: 'Isolated / Lonely', desc: 'Severe isolation' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('socialConnection', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.socialConnection === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Toggles: Sunscreen, Seatbelt, Screenings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Sun Protection */}
              <div
                onClick={() => update('sunProtection', !profile.sunProtection)}
                className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                  profile.sunProtection
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">Daily Sunscreen (SPF 30+)</div>
                  <div className="text-[10px] text-slate-400">Skin cancer prevention</div>
                </div>
                <CheckCircle2 className={`w-5 h-5 ${profile.sunProtection ? 'text-emerald-400' : 'text-slate-600'}`} />
              </div>

              {/* Seatbelt Safety */}
              <div
                onClick={() => update('seatbeltSafety', !profile.seatbeltSafety)}
                className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                  profile.seatbeltSafety
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">Always Wear Seatbelt</div>
                  <div className="text-[10px] text-slate-400">Zero phone texting</div>
                </div>
                <CheckCircle2 className={`w-5 h-5 ${profile.seatbeltSafety ? 'text-emerald-400' : 'text-slate-600'}`} />
              </div>

              {/* Preventative Screenings */}
              <div
                onClick={() => update('screenings', profile.screenings === 'up_to_date' ? 'neglected' : 'up_to_date')}
                className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                  profile.screenings === 'up_to_date'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">Up-to-Date Screenings</div>
                  <div className="text-[10px] text-slate-400">Annual blood / colonoscopy</div>
                </div>
                <CheckCircle2 className={`w-5 h-5 ${profile.screenings === 'up_to_date' ? 'text-emerald-400' : 'text-slate-600'}`} />
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 5. DEMOGRAPHICS & GENETICS */}
        {/* ==================================================== */}
        {activeTab === 'demographics' && (
          <div className="space-y-5">
            {/* Age Slider */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label className="text-sm font-bold text-slate-200">Current Chronological Age</label>
                  <p className="text-xs text-slate-400">Actuarial survival tables adjust baseline dynamically</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg p-0.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => update('age', Math.max(18, profile.age - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Decrease Age"
                    >
                      −
                    </button>
                    <span className="w-px h-4 bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => update('age', Math.min(95, profile.age + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all text-base font-bold select-none"
                      title="Increase Age"
                    >
                      +
                    </button>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${ageInfo.badgeClass}`}>
                    {profile.age} years old • {ageInfo.category}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="18"
                max="95"
                step="1"
                value={profile.age}
                onChange={(e) => update('age', Number(e.target.value))}
                className="w-full"
              />
              {/* Mathematically Accurate Segmented Visual Scale */}
              <div className="mt-2 space-y-1">
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
            </div>

            {/* Biological Sex */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">Biological Sex</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: 'male', label: 'Male', desc: 'Actuarial base ~78y' },
                  { value: 'female', label: 'Female', desc: 'Actuarial base ~83y' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('sex', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.sex === opt.value
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Relationship Status */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">Relationship Status</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'partnered_married', label: 'Married / Partnered', desc: '+2.5 yrs emotional buffer' },
                  { value: 'single', label: 'Single', desc: 'Neutral baseline' },
                  { value: 'separated_divorced_widowed', label: 'Divorced / Widowed', desc: 'Bereavement risk' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('relationshipStatus', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.relationshipStatus === opt.value
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Family Longevity */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Family History & Longevity Genetics
              </label>
              <p className="text-[11px] text-slate-400 mb-3">Relatives longevity & early CVD/cancer</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'early_disease', label: 'Early CVD / Cancer (<60)', desc: '-3.0 yrs genetic risk' },
                  { value: 'average', label: 'Average (~75-80)', desc: 'Population baseline' },
                  { value: 'parents_90plus', label: 'Parents lived 90+', desc: '+3.5 yrs protective' },
                  { value: 'centenarian_family', label: 'Centenarian Family (100+)', desc: '+5.0 yrs rare genetics' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('familyLongevity', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.familyLongevity === opt.value
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Air Quality */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="text-xs font-bold text-slate-200 block mb-1">Air Quality & Environment</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'clean_rural', label: 'Clean Rural / Mountain', desc: '+1.0 yr clean air' },
                  { value: 'moderate_suburban', label: 'Moderate Suburban', desc: 'Standard air' },
                  { value: 'polluted_urban', label: 'High Urban PM2.5', desc: '-1.8 yrs particulate' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update('airQuality', opt.value as any)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                      profile.airQuality === opt.value
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
