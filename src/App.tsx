import React, { useState, useMemo } from 'react';
import { UserProfile, PresetArchetype, LongevityRecommendation } from './engine/types';
import { DEFAULT_PROFILE } from './engine/presets';
import { calculateLongevity } from './engine/longevityEngine';
import { getRecommendations } from './engine/recommendationEngine';
import { Header } from './components/Header';
import { LifespanGauge } from './components/dashboard/LifespanGauge';
import { ImpactWaterfall } from './components/dashboard/ImpactWaterfall';
import { BangForBuckLeaderboard } from './components/recommendations/BangForBuckLeaderboard';
import { EffortGainMatrix } from './components/recommendations/EffortGainMatrix';
import { LiveParameterControls } from './components/calculator/LiveParameterControls';
import { ComparisonDrawer } from './components/dashboard/ComparisonDrawer';
import { ActionPlanModal } from './components/recommendations/ActionPlanModal';
import { Dna, Zap } from 'lucide-react';

export const App: React.FC = () => {
  // Active user profile state
  const [profile, setProfile] = useState<UserProfile>(() => ({ ...DEFAULT_PROFILE }));
  // Baseline profile for comparison mode
  const [baselineProfile, setBaselineProfile] = useState<UserProfile>(() => ({ ...DEFAULT_PROFILE }));
  const [currentPresetId, setCurrentPresetId] = useState<string>('average_us');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isActionPlanOpen, setIsActionPlanOpen] = useState<boolean>(false);

  // Simulation state for testing individual recommendations
  const [simulatedProfile, setSimulatedProfile] = useState<UserProfile | null>(null);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);

  // Active profile being calculated (either simulated or actual)
  const activeProfile = simulatedProfile || profile;

  // Real-time calculations
  const calculationResult = useMemo(() => {
    return calculateLongevity(activeProfile);
  }, [activeProfile]);

  // Real-time recommendations derived from actual profile
  const recommendations = useMemo(() => {
    return getRecommendations(profile);
  }, [profile]);

  // Handlers
  const handleParameterChange = (updated: UserProfile) => {
    setProfile(updated);
    // Clear any active temporary simulation when user manually tweaks
    if (simulatedProfile) {
      setSimulatedProfile(null);
      setActiveSimulationId(null);
    }
  };

  const handleSelectPreset = (preset: PresetArchetype) => {
    setCurrentPresetId(preset.id);
    setProfile({ ...preset.profile });
    setBaselineProfile({ ...preset.profile });
    setSimulatedProfile(null);
    setActiveSimulationId(null);
  };

  const handleReset = () => {
    setProfile({ ...DEFAULT_PROFILE });
    setBaselineProfile({ ...DEFAULT_PROFILE });
    setCurrentPresetId('average_us');
    setSimulatedProfile(null);
    setActiveSimulationId(null);
    setIsCompareMode(false);
  };

  const handleSimulateRecommendation = (rec: LongevityRecommendation) => {
    if (activeSimulationId === rec.id) {
      // Toggle off simulation
      setSimulatedProfile(null);
      setActiveSimulationId(null);
    } else {
      // Apply recommendation target to a cloned simulated profile
      let target: Partial<UserProfile> = {};
      if (rec.parameterKey === 'systolicBP') {
        target = { systolicBP: 118, diastolicBP: 78, bpCategory: 'optimal' };
      } else if (rec.parameterKey === 'dietPattern') {
        target = { dietPattern: 'mediterranean_bluezone', veggieFruitServings: '5_plus', ultraProcessed: 'minimal_rare' };
      } else {
        target = { [rec.parameterKey]: rec.targetValue };
      }

      setSimulatedProfile({ ...profile, ...target });
      setActiveSimulationId(rec.id);
    }
  };

  const handleApplyRecommendation = (rec: LongevityRecommendation) => {
    let target: Partial<UserProfile> = {};
    if (rec.parameterKey === 'systolicBP') {
      target = { systolicBP: 118, diastolicBP: 78, bpCategory: 'optimal' };
    } else if (rec.parameterKey === 'dietPattern') {
      target = { dietPattern: 'mediterranean_bluezone', veggieFruitServings: '5_plus', ultraProcessed: 'minimal_rare' };
    } else {
      target = { [rec.parameterKey]: rec.targetValue };
    }

    const updated = { ...profile, ...target };
    setProfile(updated);
    setSimulatedProfile(null);
    setActiveSimulationId(null);
  };

  const handleSetAsBaseline = () => {
    setBaselineProfile({ ...profile });
  };

  const handleRevertToBaseline = () => {
    setProfile({ ...baselineProfile });
    setSimulatedProfile(null);
    setActiveSimulationId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Header
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        isCompareMode={isCompareMode}
        onToggleCompareMode={() => setIsCompareMode(!isCompareMode)}
        onOpenActionPlan={() => setIsActionPlanOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Simulation Banner Notice if active */}
        {activeSimulationId && (
          <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-cyan-950/80 to-emerald-950/80 border border-cyan-500/50 flex items-center justify-between shadow-lg shadow-cyan-500/10">
            <div className="flex items-center gap-2 text-xs text-cyan-200">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>
                <strong>Live Simulation Active:</strong> Testing intervention effect.
              </span>
            </div>
            <button
              onClick={() => {
                setSimulatedProfile(null);
                setActiveSimulationId(null);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-850 bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              Exit Simulation
            </button>
          </div>
        )}

        {/* Side-by-Side Comparison Drawer if Compare Mode active */}
        {isCompareMode && (
          <ComparisonDrawer
            baselineProfile={baselineProfile}
            currentProfile={profile}
            currentResult={calculationResult}
            onSetAsBaseline={handleSetAsBaseline}
            onRevertToBaseline={handleRevertToBaseline}
            onClose={() => setIsCompareMode(false)}
          />
        )}

        {/* Dashboard 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Gauge, Impact Breakdown & Quick Info (5 Cols on large) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Lifespan Radial Dial & Biological Age */}
            <LifespanGauge result={calculationResult} />

            {/* Pillar Impact Waterfall & Breakdown */}
            <ImpactWaterfall categorySummaries={calculationResult.categorySummaries} />

            {/* Scientific Grounding Badge */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
              <Dna className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-slate-300 font-semibold">Evidence-Based Longevity Engine: </strong>
                Model synthesizes actuarial cohort tables (CDC/SSA), hazard ratios from the New England Centenarian Study (Dr. Thomas Perls), Framingham cardiovascular algorithms, and Blue Zone demographic analyses.
              </div>
            </div>
          </div>

          {/* Right Column: ROI Optimizer, Effort Matrix & Live Parameter Controls (7 Cols on large) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bang for Your Buck Longevity Optimizer Leaderboard (Primary Requirement #2) */}
            <BangForBuckLeaderboard
              recommendations={recommendations}
              onApplyRecommendation={handleApplyRecommendation}
              onSimulateRecommendation={handleSimulateRecommendation}
              activeSimulationId={activeSimulationId}
            />

            {/* Effort vs Lifespan Gain 2x2 Matrix */}
            <EffortGainMatrix
              recommendations={recommendations}
              onSimulateRecommendation={handleSimulateRecommendation}
              activeSimulationId={activeSimulationId}
            />

            {/* Live Parameter Controls (Primary Requirement #1) */}
            <LiveParameterControls
              profile={activeProfile}
              onChange={handleParameterChange}
            />
          </div>
        </div>
      </main>

      {/* Personalized Longevity Action Blueprint Modal */}
      <ActionPlanModal
        isOpen={isActionPlanOpen}
        onClose={() => setIsActionPlanOpen(false)}
        result={calculationResult}
        recommendations={recommendations}
        profile={profile}
      />
    </div>
  );
};
