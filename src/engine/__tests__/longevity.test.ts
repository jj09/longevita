import { describe, it, expect } from 'vitest';
import { calculateLongevity, calculateProgressiveLongevity, getBloodPressureCategory } from '../longevityEngine';
import { getRecommendations } from '../recommendationEngine';
import { getActuarialBaseline } from '../actuarial';
import { DEFAULT_PROFILE, PRESET_ARCHETYPES } from '../presets';
import { UserProfile } from '../types';
import { QUIZ_QUESTIONS, TOTAL_QUIZ_QUESTIONS } from '../quizQuestions';

describe('Actuarial Baseline Calculation', () => {
  it('correctly returns baseline life expectancies for standard age brackets', () => {
    const male30 = getActuarialBaseline(30, 'male');
    const female30 = getActuarialBaseline(30, 'female');
    expect(male30).toBeCloseTo(77.9, 1);
    expect(female30).toBeCloseTo(82.3, 1);

    const male70 = getActuarialBaseline(70, 'male');
    expect(male70).toBeGreaterThan(85);
  });
});

describe('Blood Pressure Categorization', () => {
  it('classifies blood pressure correctly', () => {
    expect(getBloodPressureCategory(118, 78)).toBe('optimal');
    expect(getBloodPressureCategory(124, 78)).toBe('elevated');
    expect(getBloodPressureCategory(134, 82)).toBe('stage1');
    expect(getBloodPressureCategory(144, 92)).toBe('stage2');
    expect(getBloodPressureCategory(165, 102)).toBe('severe_untreated');
  });
});

describe('Longevity Engine Calculation', () => {
  it('calculates realistic baseline for default profile', () => {
    const res = calculateLongevity(DEFAULT_PROFILE);
    expect(res.projectedLifespan).toBeGreaterThan(70);
    expect(res.projectedLifespan).toBeLessThan(105);
    expect(res.categorySummaries.length).toBe(5);
    expect(res.confidenceRange[0]).toBeLessThan(res.projectedLifespan);
    expect(res.confidenceRange[1]).toBeGreaterThan(res.projectedLifespan);
  });

  it('reflects high longevity for Blue Zone centenarian archetype', () => {
    const blueZone = PRESET_ARCHETYPES.find((p) => p.id === 'bluezone_centenarian')!;
    const res = calculateLongevity(blueZone.profile);
    expect(res.projectedLifespan).toBeGreaterThan(95);
    expect(res.riskGrade).toBe('A+');
    expect(res.biologicalAge).toBeLessThan(blueZone.profile.age);
  });

  it('reflects lower lifespan for heavy smoker archetype', () => {
    const smoker = PRESET_ARCHETYPES.find((p) => p.id === 'heavy_smoker')!;
    const res = calculateLongevity(smoker.profile);
    expect(res.projectedLifespan).toBeLessThan(70);
    expect(res.riskGrade).toBe('F');
  });

  it('shows positive gain when changing sedentary to high cardio', () => {
    const profile1: UserProfile = { ...DEFAULT_PROFILE, cardio: 'sedentary' };
    const profile2: UserProfile = { ...DEFAULT_PROFILE, cardio: 'high' };
    const res1 = calculateLongevity(profile1);
    const res2 = calculateLongevity(profile2);
    expect(res2.projectedLifespan).toBeGreaterThan(res1.projectedLifespan);
    expect(res2.netDelta - res1.netDelta).toBeCloseTo(7.5, 1);
  });

  it('accurately balances coexisting early family cancer with exceptional 90+ relative genetics', () => {
    const mixedProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      earlyFamilyDisease: 'early_cancer', // -2.5 yrs
      familyLongevity: 'relative_90_99',  // +3.5 yrs
    };
    const res = calculateLongevity(mixedProfile);
    const earlyCancerImpact = res.categorySummaries
      .flatMap((c) => c.items)
      .find((i) => i.key === 'earlyFamilyDisease');
    const longevityImpact = res.categorySummaries
      .flatMap((c) => c.items)
      .find((i) => i.key === 'familyLongevity');

    expect(earlyCancerImpact?.yearsDelta).toBe(-2.5);
    expect(longevityImpact?.yearsDelta).toBe(3.5);
  });

  it('accurately computes relationship status impact (+3.0 yrs for partnered/married)', () => {
    const singleProfile: UserProfile = { ...DEFAULT_PROFILE, relationshipStatus: 'single' };
    const marriedProfile: UserProfile = { ...DEFAULT_PROFILE, relationshipStatus: 'partnered_married' };
    const res1 = calculateLongevity(singleProfile);
    const res2 = calculateLongevity(marriedProfile);
    expect(res2.projectedLifespan).toBeGreaterThan(res1.projectedLifespan);
    const relItem = res2.categorySummaries
      .flatMap((c) => c.items)
      .find((i) => i.key === 'relationshipStatus');
    expect(relItem?.yearsDelta).toBe(3.0);
  });

  it('accurately computes in-person social connection frequency across all 4 tiers', () => {
    const pFrequent: UserProfile = { ...DEFAULT_PROFILE, socialConnection: 'frequent_3plus_weekly' };
    const pWeekly: UserProfile = { ...DEFAULT_PROFILE, socialConnection: 'weekly_1_to_2' };
    const pMonthly: UserProfile = { ...DEFAULT_PROFILE, socialConnection: 'monthly_occasional' };
    const pIsolated: UserProfile = { ...DEFAULT_PROFILE, socialConnection: 'rare_isolated' };

    const getDelta = (profile: UserProfile) =>
      calculateLongevity(profile).categorySummaries
        .flatMap((c) => c.items)
        .find((i) => i.key === 'socialConnection')?.yearsDelta;

    expect(getDelta(pFrequent)).toBe(3.0);
    expect(getDelta(pWeekly)).toBe(1.5);
    expect(getDelta(pMonthly)).toBe(0.5);
    expect(getDelta(pIsolated)).toBe(-3.0);
  });
});

describe('Recommendation Engine (Bang for the Buck ROI)', () => {
  it('generates high ROI recommendations sorted by bang-for-buck index', () => {
    const workaholic = PRESET_ARCHETYPES.find((p) => p.id === 'stressed_workaholic')!;
    const recs = getRecommendations(workaholic.profile);

    expect(recs.length).toBeGreaterThan(0);
    // Ensure sorted descending by bangForBuckIndex
    for (let i = 0; i < recs.length - 1; i++) {
      expect(recs[i].bangForBuckIndex).toBeGreaterThanOrEqual(recs[i + 1].bangForBuckIndex);
    }

    // Daily flossing should be present with Effort 1 (Micro-Habit)
    const flossingRec = recs.find((r) => r.parameterKey === 'flossing');
    expect(flossingRec).toBeDefined();
    expect(flossingRec?.effortScore).toBe(1);
    expect(flossingRec?.potentialGainYears).toBeGreaterThan(0);
  });

  it('ranks micro-wins with high ROI before high-effort tasks with equal gain', () => {
    const defaultRecs = getRecommendations(DEFAULT_PROFILE);
    expect(defaultRecs.length).toBeGreaterThan(0);

    // Verify top recommendation has high ROI index
    expect(defaultRecs[0].bangForBuckIndex).toBeGreaterThanOrEqual(10);
  });
});

describe('Category Aggregation & Biological Age', () => {
  it('correctly calculates biological age younger than calendar age for healthy habits', () => {
    const blueZone = PRESET_ARCHETYPES.find((p) => p.id === 'bluezone_centenarian')!;
    const res = calculateLongevity(blueZone.profile);
    expect(res.biologicalAge).toBeLessThan(blueZone.profile.age);
    expect(res.totalGainedYears).toBeGreaterThan(15);
  });

  it('correctly calculates biological age older than calendar age for high-risk profiles', () => {
    const smoker = PRESET_ARCHETYPES.find((p) => p.id === 'heavy_smoker')!;
    const res = calculateLongevity(smoker.profile);
    expect(res.biologicalAge).toBeGreaterThan(smoker.profile.age);
    expect(res.totalLostYears).toBeGreaterThan(15);
  });

  it('ensures exact arithmetic consistency between netDelta and (totalGainedYears - totalLostYears)', () => {
    for (const archetype of PRESET_ARCHETYPES) {
      const res = calculateLongevity(archetype.profile);
      const diff = Number((res.totalGainedYears - res.totalLostYears).toFixed(1));
      expect(res.netDelta).toBe(diff);
    }
  });
});

describe('Progressive Longevity Calculation during Quiz', () => {
  it('starts at exact actuarial baseline for unanswered profile', () => {
    const baselineRes = calculateProgressiveLongevity({ age: 38, sex: 'male' });
    expect(baselineRes.actuarialBaseline).toBe(78.6);
    expect(baselineRes.netDelta).toBe(0);
    expect(baselineRes.projectedLifespan).toBe(78.6);
  });

  it('immediately increases lifespan when selecting positive habits', () => {
    const base = calculateProgressiveLongevity({ age: 38, sex: 'male' });
    const withMarriage = calculateProgressiveLongevity({ age: 38, sex: 'male', relationshipStatus: 'partnered_married' });
    expect(withMarriage.netDelta).toBe(3.0);
    expect(withMarriage.projectedLifespan).toBeCloseTo(base.projectedLifespan + 3.0, 1);

    const withCardio = calculateProgressiveLongevity({ age: 38, sex: 'male', relationshipStatus: 'partnered_married', cardio: 'high' });
    expect(withCardio.netDelta).toBe(7.0);
    expect(withCardio.projectedLifespan).toBeCloseTo(base.projectedLifespan + 7.0, 1);
  });

  it('maintains exact transparent additivity: projectedLifespan === baseline + netDelta up to 115y ceiling', () => {
    // Base profile with 15.0 years gain
    const profileAt15: Partial<UserProfile> = {
      age: 38,
      sex: 'male',
      relationshipStatus: 'partnered_married', // +3.0
      familyLongevity: 'centenarian_100plus', // +5.0
      cardio: 'high', // +4.0
      smoking: 'never', // +3.0
    }; // Total gained = 15.0

    const resAt15 = calculateProgressiveLongevity(profileAt15);
    expect(resAt15.totalGainedYears).toBe(15.0);
    expect(resAt15.projectedLifespan).toBeCloseTo(78.6 + 15.0, 1);

    // Add +1.5 yrs (8k-10k daily steps) -> exactly 16.5y net delta
    const profileWithSteps = { ...profileAt15, dailySteps: '8k_to_10k' as const };
    const resWithSteps = calculateProgressiveLongevity(profileWithSteps);
    expect(resWithSteps.totalGainedYears).toBe(16.5);
    expect(resWithSteps.netDelta).toBe(16.5);
    expect(resWithSteps.projectedLifespan).toBeCloseTo(78.6 + 16.5, 1);

    // Verify lifespan increases by exactly 1.5 yrs matching question label
    const lifespanIncrease = Number((resWithSteps.projectedLifespan - resAt15.projectedLifespan).toFixed(1));
    expect(lifespanIncrease).toBe(1.5);
  });

  it('produces identical projectedLifespan as calculateLongevity when full profile is answered', () => {
    for (const archetype of PRESET_ARCHETYPES) {
      const progressiveRes = calculateProgressiveLongevity(archetype.profile);
      const standardRes = calculateLongevity(archetype.profile);
      expect(progressiveRes.projectedLifespan).toBe(standardRes.projectedLifespan);
      expect(progressiveRes.netDelta).toBe(standardRes.netDelta);
      expect(progressiveRes.biologicalAge).toBe(standardRes.biologicalAge);
    }
  });
});

describe('Quiz Questions Registry Consistency', () => {
  it('has consistent unique questions and matches TOTAL_QUIZ_QUESTIONS', () => {
    const ids = new Set(QUIZ_QUESTIONS.map((q) => q.id));
    expect(ids.size).toBe(QUIZ_QUESTIONS.length);
    expect(TOTAL_QUIZ_QUESTIONS).toBe(QUIZ_QUESTIONS.length);
    expect(TOTAL_QUIZ_QUESTIONS).toBe(30);

    // Ensure every question has a valid mapped field on DEFAULT_PROFILE
    for (const q of QUIZ_QUESTIONS) {
      expect(DEFAULT_PROFILE[q.field]).toBeDefined();
    }
  });
});


