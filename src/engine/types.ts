export type BiologicalSex = 'male' | 'female';
export type RelationshipStatus = 'single' | 'partnered_married' | 'separated_divorced_widowed';
export type EarlyFamilyDisease = 'none' | 'early_cvd' | 'early_cancer' | 'multiple_early';
export type FamilyLongevity = 'average' | 'relative_85_89' | 'relative_90_99' | 'centenarian_100plus';
export type AirQuality = 'polluted_urban' | 'moderate_suburban' | 'clean_rural';

export type BloodPressureCategory = 'optimal' | 'elevated' | 'stage1' | 'stage2' | 'severe_untreated';
export type BloodSugarCategory = 'normal' | 'prediabetes' | 'type2_controlled' | 'type2_uncontrolled';
export type LipidCategory = 'optimal' | 'moderate_high' | 'high_uncontrolled' | 'high_managed_statin';

export type CardioFrequency = 'sedentary' | 'light' | 'moderate' | 'high'; // 0, <60m, 150m, 300m+
export type StrengthTrainingFrequency = 'none' | 'occasional' | 'optimal'; // 0, 1-2 days, 3+ days
export type DailyStepCategory = 'under_4k' | '4k_to_7k' | '8k_to_10k' | 'over_10k';
export type SedentarySittingTime = 'under_4h' | '4h_to_8h' | 'over_8h';

export type DietPattern = 'standard_processed' | 'moderate_balanced' | 'mediterranean_bluezone';
export type RedMeatIntake = 'frequent_daily' | 'weekly_moderate' | 'rare_none';
export type VeggieFruitServings = 'under_2' | '2_to_4' | '5_plus';
export type UltraProcessedIntake = 'daily_frequent' | 'occasional' | 'minimal_rare';
export type PolyphenolIntake = 'none' | 'moderate_coffee_tea' | 'high_green_tea_berries';

export type SmokingStatus = 'current_heavy' | 'current_light' | 'former_recent' | 'former_long' | 'never';
export type AlcoholIntake = 'none' | 'light_moderate' | 'heavy_binge'; // 0, 1-7/wk, 14+/wk
export type SleepDurationQuality = 'under_6h' | '6_to_7h' | '7_to_8h_optimal' | 'over_9h' | 'chronic_apnea_insomnia';
export type StressLevel = 'severe_unmanaged' | 'moderate_daily' | 'well_managed_mindful';
export type SocialConnection = 'isolated' | 'moderate' | 'strong_connected';
export type IntimacyFrequency = 'rare_none' | 'monthly_occasional' | 'weekly_optimal' | 'frequent_active';
export type OralHealth = 'rarely_never' | 'occasional' | 'daily_flossing';
export type PreventativeScreening = 'neglected' | 'up_to_date';

export interface UserProfile {
  // Demographics & Genetics
  age: number;
  sex: BiologicalSex;
  relationshipStatus: RelationshipStatus;
  earlyFamilyDisease: EarlyFamilyDisease;
  familyLongevity: FamilyLongevity;
  airQuality: AirQuality;

  // Biometrics & Clinical
  systolicBP: number; // e.g. 120
  diastolicBP: number; // e.g. 80
  bpCategory?: BloodPressureCategory;
  bloodSugar: BloodSugarCategory;
  lipidStatus: LipidCategory;
  bmi: number; // e.g. 23.5
  restingHeartRate: number; // e.g. 64

  // Fitness & Movement
  cardio: CardioFrequency;
  strengthTraining: StrengthTrainingFrequency;
  dailySteps: DailyStepCategory;
  sittingHours: SedentarySittingTime;

  // Nutrition & Blue Zone Diet
  dietPattern: DietPattern;
  redMeat: RedMeatIntake;
  veggieFruitServings: VeggieFruitServings;
  ultraProcessed: UltraProcessedIntake;
  polyphenols: PolyphenolIntake;
  dailyWaterGlasses: number;

  // Lifestyle, Sleep & Mind
  smoking: SmokingStatus;
  alcohol: AlcoholIntake;
  sleep: SleepDurationQuality;
  stress: StressLevel;
  socialConnection: SocialConnection;
  intimacyFrequency: IntimacyFrequency;
  flossing: OralHealth;
  sunProtection: boolean;
  seatbeltSafety: boolean;
  screenings: PreventativeScreening;
}

export interface ImpactBreakdownItem {
  key: string;
  label: string;
  category: 'demographics' | 'biometrics' | 'fitness' | 'nutrition' | 'lifestyle';
  yearsDelta: number; // e.g. +3.2 or -4.5
  currentValueDisplay: string;
  scientificExplanation: string;
  isPositive: boolean;
}

export interface CategorySummary {
  category: 'demographics' | 'biometrics' | 'fitness' | 'nutrition' | 'lifestyle';
  label: string;
  yearsDelta: number;
  positiveYears: number;
  negativeYears: number;
  items: ImpactBreakdownItem[];
}

export interface LongevityCalculationResult {
  projectedLifespan: number;
  biologicalAge: number;
  chronologicalAge: number;
  actuarialBaseline: number;
  totalGainedYears: number;
  totalLostYears: number;
  netDelta: number;
  confidenceRange: [number, number]; // [min, max]
  categorySummaries: CategorySummary[];
  allImpacts: ImpactBreakdownItem[];
  riskGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export type EffortLevel = 1 | 2 | 3 | 4 | 5; // 1 = Minimal / Micro-Habit, 5 = Extreme Transformation

export interface LongevityRecommendation {
  id: string;
  pillar: 'demographics' | 'biometrics' | 'fitness' | 'nutrition' | 'lifestyle';
  parameterKey: keyof UserProfile;
  title: string;
  description: string;
  currentValueDisplay: string;
  targetValueDisplay: string;
  targetValue: any; // value to apply on simulation
  potentialGainYears: number; // e.g. +2.4 years
  effortScore: EffortLevel; // 1 to 5
  bangForBuckIndex: number; // (potentialGainYears / effortScore) * 10
  difficultyLabel: 'Micro-Habit (Effortless)' | 'Easy' | 'Moderate' | 'Challenging' | 'Major Transformation';
  actionSteps: string[];
  scientificEvidence: string;
  category: 'quick_win' | 'high_impact' | 'medical_optimization' | 'longevity_habit';
}

export interface PresetArchetype {
  id: string;
  name: string;
  shortDesc: string;
  icon: string;
  profile: UserProfile;
}
