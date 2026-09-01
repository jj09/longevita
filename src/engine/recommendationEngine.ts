import {
  UserProfile,
  LongevityRecommendation,
  EffortLevel,
} from './types';
import { calculateLongevity } from './longevityEngine';

interface ModifiableCandidate {
  parameterKey: keyof UserProfile;
  title: string;
  description: string;
  pillar: 'demographics' | 'biometrics' | 'fitness' | 'nutrition' | 'lifestyle';
  effortScore: EffortLevel;
  difficultyLabel: 'Micro-Habit (Effortless)' | 'Easy' | 'Moderate' | 'Challenging' | 'Major Transformation';
  category: 'quick_win' | 'high_impact' | 'medical_optimization' | 'longevity_habit';
  isApplicable: (profile: UserProfile) => boolean;
  getTargetProfile: (profile: UserProfile) => { targetProfile: UserProfile; targetValue: any; targetDisplay: string };
  getCurrentDisplay: (profile: UserProfile) => string;
  actionSteps: string[];
  scientificEvidence: string;
}

const MODIFIABLE_CANDIDATES: ModifiableCandidate[] = [
  // 1. DENTAL FLOSSING (Famous Living to 100 / Dr. Perls Micro-Habit)
  {
    parameterKey: 'flossing',
    title: 'Daily Dental Flossing',
    description: 'Floss teeth once daily before bed to clear subgingival periodontal biofilm.',
    pillar: 'lifestyle',
    effortScore: 1,
    difficultyLabel: 'Micro-Habit (Effortless)',
    category: 'quick_win',
    isApplicable: (p) => p.flossing !== 'daily_flossing',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, flossing: 'daily_flossing' },
      targetValue: 'daily_flossing',
      targetDisplay: 'Daily Flossing',
    }),
    getCurrentDisplay: (p) => (p.flossing === 'rarely_never' ? 'Rarely / Never' : 'Occasional'),
    actionSteps: [
      'Keep floss picks or string floss right beside your toothbrush where it is impossible to miss.',
      'Floss for just 60 seconds every night before brushing.',
      'Notice gum bleeding vanish within 7-10 days as inflammation subsides.',
    ],
    scientificEvidence:
      'Periodontal bacteria (Porphyromonas gingivalis) enter the bloodstream through inflamed gums, inducing systemic endothelial damage, elevated C-reactive protein (CRP), and accelerated coronary plaque formation. Flossing daily saves ~1.2 to 2.4 life years.',
  },

  // 2. SEATBELT & VEHICLE SAFETY
  {
    parameterKey: 'seatbeltSafety',
    title: 'Consistent Seatbelt & Safe Driving',
    description: 'Always buckle up and eliminate phone distraction while driving.',
    pillar: 'lifestyle',
    effortScore: 1,
    difficultyLabel: 'Micro-Habit (Effortless)',
    category: 'quick_win',
    isApplicable: (p) => !p.seatbeltSafety,
    getTargetProfile: (p) => ({
      targetProfile: { ...p, seatbeltSafety: true },
      targetValue: true,
      targetDisplay: 'Always Buckled / Safe Driving',
    }),
    getCurrentDisplay: () => 'Inconsistent Seatbelt / Distracted',
    actionSteps: [
      'Set phone to automatic "Do Not Disturb While Driving" mode.',
      'Click seatbelt immediately before putting the key in the ignition or pressing Start.',
    ],
    scientificEvidence:
      'Motor vehicle collisions are the leading non-medical cause of years of life lost before age 65. Seatbelt use reduces fatal injury risk by 45-50%.',
  },

  // 3. BLOOD PRESSURE OPTIMIZATION
  {
    parameterKey: 'systolicBP',
    title: 'Optimize Blood Pressure (<120/80 mmHg)',
    description: 'Bring blood pressure to optimal range via lifestyle, sodium reduction, or medication.',
    pillar: 'biometrics',
    effortScore: 2,
    difficultyLabel: 'Easy',
    category: 'medical_optimization',
    isApplicable: (p) => Boolean(p.systolicBP > 125 || p.diastolicBP > 82 || (p.bpCategory && p.bpCategory !== 'optimal')),
    getTargetProfile: (p) => ({
      targetProfile: { ...p, systolicBP: 118, diastolicBP: 78, bpCategory: 'optimal' },
      targetValue: 118,
      targetDisplay: 'Optimal (<120/80 mmHg)',
    }),
    getCurrentDisplay: (p) => `${p.systolicBP}/${p.diastolicBP} mmHg`,
    actionSteps: [
      'Track morning and evening readings with a validated home arm-cuff monitor for 7 days.',
      'Adopt DASH/Mediterranean dietary patterns: boost dietary potassium (avocados, leafy greens, bananas) and limit sodium.',
      'Discuss first-line antihypertensive therapy (e.g. ACEi/ARB) with your doctor if lifestyle modifications remain above 130/80.',
    ],
    scientificEvidence:
      'The SPRINT clinical trial demonstrated that intensive systolic BP reduction to <120 mmHg reduced cardiovascular events by 25% and all-cause mortality by 27%.',
  },

  // 4. TOBACCO / SMOKING CESSATION
  {
    parameterKey: 'smoking',
    title: 'Complete Smoking & Vaping Cessation',
    description: 'Quit smoking tobacco/vaping entirely to rapidly regenerate vascular endothelial function.',
    pillar: 'lifestyle',
    effortScore: 5,
    difficultyLabel: 'Major Transformation',
    category: 'high_impact',
    isApplicable: (p) => p.smoking === 'current_heavy' || p.smoking === 'current_light',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, smoking: 'former_recent' },
      targetValue: 'former_recent',
      targetDisplay: 'Former Smoker (Smoke-Free)',
    }),
    getCurrentDisplay: (p) => (p.smoking === 'current_heavy' ? 'Current Heavy (1+ pack/day)' : 'Current Light / Vaping'),
    actionSteps: [
      'Choose a definitive "Quit Date" within the next 14 days and clear all tobacco/vapes from your home and car.',
      'Utilize evidence-based cessation aids: Nicotine Replacement Therapy (patches/lozenges) or prescription varenicline.',
      'Within 1 year of quitting, excess coronary heart disease risk drops by 50%; within 10 years, lung cancer risk is cut in half.',
    ],
    scientificEvidence:
      'The British Doctors Study by Sir Richard Doll proved that stopping smoking before age 40 avoids 90% of the excess mortality, adding 9-10 full years of life expectancy.',
  },

  // 5. DAILY STEPS & NON-EXERCISE MOVEMENT (NEAT)
  {
    parameterKey: 'dailySteps',
    title: 'Increase Daily Steps to 8,000 - 10,000+',
    description: 'Walk 8,000 to 10,000 steps daily through post-meal strolls and movement breaks.',
    pillar: 'fitness',
    effortScore: 2,
    difficultyLabel: 'Easy',
    category: 'quick_win',
    isApplicable: (p) => p.dailySteps === 'under_4k' || p.dailySteps === '4k_to_7k',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, dailySteps: '8k_to_10k' },
      targetValue: '8k_to_10k',
      targetDisplay: '8,000 - 10,000 steps/day',
    }),
    getCurrentDisplay: (p) => (p.dailySteps === 'under_4k' ? '< 4,000 steps/day' : '4,000 - 7,000 steps/day'),
    actionSteps: [
      'Take a brisk 10-15 minute walk immediately after lunch and dinner (blunts postprandial glucose spike by 30%).',
      'Conduct 1-on-1 phone calls while walking outdoors.',
      'Use a smartwatch or pedometer with an hourly vibration reminder if sedentary for >50 minutes.',
    ],
    scientificEvidence:
      'JAMA Network Open prospective cohorts show that stepping 8,000-10,000 steps/day reduces all-cause mortality by 50-70% compared to <4,000 steps/day.',
  },

  // 6. AEROBIC CARDIO & VO2 MAX
  {
    parameterKey: 'cardio',
    title: 'Zone 2 Cardio & Aerobic Conditioning (150-300 min/wk)',
    description: 'Build mitochondrial density and cardiorespiratory endurance with Zone 2 aerobic base building.',
    pillar: 'fitness',
    effortScore: 3,
    difficultyLabel: 'Moderate',
    category: 'high_impact',
    isApplicable: (p) => p.cardio === 'sedentary' || p.cardio === 'light',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, cardio: 'moderate' },
      targetValue: 'moderate',
      targetDisplay: 'Moderate (150 min/wk)',
    }),
    getCurrentDisplay: (p) => (p.cardio === 'sedentary' ? 'Sedentary (0 min/wk)' : 'Light (<60 min/wk)'),
    actionSteps: [
      'Schedule 3x 45-minute sessions per week of conversational-pace exercise (cycling, brisk incline walking, rowing, jogging).',
      'Target Zone 2 heart rate: ~65-75% of your maximum heart rate (where you can speak full sentences without gasping).',
      'Incorporate 1 weekly session of short interval surges (e.g. 4x 4-minute intervals) to boost VO2 max.',
    ],
    scientificEvidence:
      'A study of 122,007 patients in JAMA Network Open showed that elite cardiorespiratory fitness (high VO2 max) provides a 5x reduction in all-cause mortality compared to low fitness—more potent than smoking cessation or hypertension management.',
  },

  // 7. STRENGTH & RESISTANCE TRAINING
  {
    parameterKey: 'strengthTraining',
    title: 'Progressive Strength Training (2-3x/week)',
    description: 'Lift weights, use resistance bands, or do bodyweight calisthenics to prevent sarcopenia and preserve bone mass.',
    pillar: 'fitness',
    effortScore: 3,
    difficultyLabel: 'Moderate',
    category: 'longevity_habit',
    isApplicable: (p) => p.strengthTraining === 'none' || p.strengthTraining === 'occasional',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, strengthTraining: 'optimal' },
      targetValue: 'optimal',
      targetDisplay: 'Optimal (3+ days/wk)',
    }),
    getCurrentDisplay: (p) => (p.strengthTraining === 'none' ? 'None (0 days/wk)' : 'Occasional (1-2x/wk)'),
    actionSteps: [
      'Focus on multi-joint compound movements: Squats/leg press, Deadlifts/hinges, Chest press/pushups, Rows/pullups, Overhead press.',
      'Train each major muscle group 2 to 3 times per week with 3 sets of 8-12 reps near muscular fatigue.',
      'Consume 1.2 - 1.6 grams of protein per kg of body weight to support muscle protein synthesis.',
    ],
    scientificEvidence:
      'A British Journal of Sports Medicine meta-analysis revealed that muscle-strengthening activities are associated with a 10-17% lower risk of all-cause mortality, cardiovascular disease, and cancer, and prevent catastrophic late-life hip fractures.',
  },

  // 8. MEDITERRANEAN / BLUE ZONE DIETARY PATTERN
  {
    parameterKey: 'dietPattern',
    title: 'Adopt Mediterranean / Blue Zone Dietary Pattern',
    description: 'Shift your dietary baseline to extra virgin olive oil, legumes, wild fish, nuts, and diverse whole plants.',
    pillar: 'nutrition',
    effortScore: 3,
    difficultyLabel: 'Moderate',
    category: 'high_impact',
    isApplicable: (p) => p.dietPattern === 'standard_processed' || p.dietPattern === 'moderate_balanced',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, dietPattern: 'mediterranean_bluezone', veggieFruitServings: '5_plus', ultraProcessed: 'minimal_rare' },
      targetValue: 'mediterranean_bluezone',
      targetDisplay: 'Mediterranean / Blue Zone Diet',
    }),
    getCurrentDisplay: (p) => (p.dietPattern === 'standard_processed' ? 'Standard Processed / Fast Food' : 'Balanced Whole Foods'),
    actionSteps: [
      'Use Extra Virgin Olive Oil (EVOO) as your primary culinary fat (2-3 tbsp/day).',
      'Replace refined carbs with legumes (lentils, chickpeas, black beans) and whole ancient grains (farro, quinoa, oats).',
      'Snack on raw tree nuts (walnuts, almonds, pistachios) and fresh berries instead of ultra-processed snacks.',
    ],
    scientificEvidence:
      'The PREDIMED multi-center randomized trial demonstrated a 30% reduction in major cardiovascular events for participants assigned to an EVOO/nuts Mediterranean diet, adding 3-4 healthy life years.',
  },

  // 9. PREVENTATIVE HEALTH SCREENINGS
  {
    parameterKey: 'screenings',
    title: 'Catch Up on Preventative Health Screenings',
    description: 'Get comprehensive annual blood panels, colonoscopy (at 45+), dermatologic skin check, and age-appropriate cancer screens.',
    pillar: 'lifestyle',
    effortScore: 2,
    difficultyLabel: 'Easy',
    category: 'medical_optimization',
    isApplicable: (p) => p.screenings !== 'up_to_date',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, screenings: 'up_to_date' },
      targetValue: 'up_to_date',
      targetDisplay: 'Up-to-Date on Screenings',
    }),
    getCurrentDisplay: () => 'Neglected / Avoids Screenings',
    actionSteps: [
      'Schedule a preventive wellness exam with your primary physician.',
      'Request key biomarkers: Comprehensive Metabolic Panel, ApoB / Advanced Lipids, Fasting Glucose & HbA1c, hs-CRP, and Liver Panel.',
      'Schedule recommended age-appropriate screenings: Colonoscopy (every 10 yrs starting at 45), annual dermatology mole check, and mammogram/cervical screens as indicated.',
    ],
    scientificEvidence:
      'Early detection of precancerous polyps and asymptomatic cardiovascular pathology transforms disease mortality from lethal to 90%+ curable.',
  },

  // 10. SLEEP HYGIENE & OPTIMIZATION
  {
    parameterKey: 'sleep',
    title: 'Optimize Sleep Duration (7-8 Hours Restful)',
    description: 'Establish consistent sleep/wake timing and treat underlying sleep apnea/disruptions.',
    pillar: 'lifestyle',
    effortScore: 3,
    difficultyLabel: 'Moderate',
    category: 'longevity_habit',
    isApplicable: (p) => p.sleep !== '7_to_8h_optimal',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, sleep: '7_to_8h_optimal' },
      targetValue: '7_to_8h_optimal',
      targetDisplay: '7 to 8 hours optimal sleep',
    }),
    getCurrentDisplay: (p) => {
      if (p.sleep === 'under_6h') return '< 6 hours / Deprivation';
      if (p.sleep === 'chronic_apnea_insomnia') return 'Sleep Apnea / Insomnia';
      if (p.sleep === 'over_9h') return '9+ hours (Excessive)';
      return '6 to 7 hours';
    },
    actionSteps: [
      'Maintain a rigid sleep schedule: go to bed and wake up within 30 minutes of the same time 7 days a week.',
      'Keep your bedroom completely dark, silent, and cool (65-68°F / 18-20°C).',
      'Cut off caffeine 9 hours before bed and eliminate bright blue screens / phone use 60 minutes before sleep.',
      'If you snore loudly or wake unrefreshed, get evaluated with a home sleep study for obstructive sleep apnea (OSA).',
    ],
    scientificEvidence:
      'During deep slow-wave and REM sleep, the glymphatic system flushes amyloid-beta and tau proteins from brain parenchyma. Consistent 7-8h sleep reduces Alzheimer’s and all-cause cardiovascular risks.',
  },

  // 11. SOCIAL CONNECTION & COMMUNITY
  {
    parameterKey: 'socialConnection',
    title: 'Cultivate Close Friendships & Community (Moai)',
    description: 'Build strong social bonds, join community groups, and foster 3-5 deep confidant relationships.',
    pillar: 'lifestyle',
    effortScore: 3,
    difficultyLabel: 'Moderate',
    category: 'longevity_habit',
    isApplicable: (p) => p.socialConnection !== 'strong_connected',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, socialConnection: 'strong_connected' },
      targetValue: 'strong_connected',
      targetDisplay: 'Strong Connected Community',
    }),
    getCurrentDisplay: (p) => (p.socialConnection === 'isolated' ? 'Isolated / High Loneliness' : 'Moderate Social Circle'),
    actionSteps: [
      'Commit to a recurring weekly social ritual (e.g. group hike, dinner club, book circle, team sport, volunteering).',
      'Call or message at least one friend or family member daily just to connect deeply.',
      'Emulate the Okinawan "Moai" tradition: a committed circle of lifelong friends supporting each other.',
    ],
    scientificEvidence:
      'Dr. Julianne Holt-Lunstad’s landmark Brigham Young meta-analysis of 308,849 individuals found that strong social relationships increase survival odds by 50%, equivalent to quitting a 15-cigarette/day smoking habit.',
  },

  // 12. CHRONIC STRESS REGULATION & MINDFULNESS
  {
    parameterKey: 'stress',
    title: 'Master Stress Resilience & Mindful Coping',
    description: 'Lower chronic sympathetic tone through daily breathwork, meditation, and psychological boundary-setting.',
    pillar: 'lifestyle',
    effortScore: 2,
    difficultyLabel: 'Easy',
    category: 'quick_win',
    isApplicable: (p) => p.stress === 'severe_unmanaged' || p.stress === 'moderate_daily',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, stress: 'well_managed_mindful' },
      targetValue: 'well_managed_mindful',
      targetDisplay: 'Well-Managed / Mindful Resilience',
    }),
    getCurrentDisplay: (p) => (p.stress === 'severe_unmanaged' ? 'Severe / Chronic Unmanaged' : 'Moderate Daily Stress'),
    actionSteps: [
      'Practice 5-10 minutes of physiological sighing (double inhale through nose, long slow exhale through mouth) or box breathing.',
      'Spend 20-30 minutes immersed in nature (Shinrin-yoku / Forest bathing) twice weekly to rapidly drop salivary cortisol.',
      'Establish firm work-life boundaries: no work emails after 7 PM.',
    ],
    scientificEvidence:
      'Chronic unbuffered psychological stress causes accelerated telomere attrition in leukocytes, immune senescence, and persistent coronary vasoconstriction.',
  },

  // 13. POLYPHENOLS & GREEN TEA / BERRIES
  {
    parameterKey: 'polyphenols',
    title: 'Boost Daily Polyphenols (Green Tea, Berries, Dark Cocoa)',
    description: 'Drink 2-3 cups of high-EGCG green tea or matcha and eat a daily cup of anthocyanin-rich berries.',
    pillar: 'nutrition',
    effortScore: 1,
    difficultyLabel: 'Micro-Habit (Effortless)',
    category: 'quick_win',
    isApplicable: (p) => p.polyphenols !== 'high_green_tea_berries',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, polyphenols: 'high_green_tea_berries' },
      targetValue: 'high_green_tea_berries',
      targetDisplay: 'High (Green Tea / Berries / Cocoa)',
    }),
    getCurrentDisplay: (p) => (p.polyphenols === 'none' ? 'None' : 'Moderate Coffee / Tea'),
    actionSteps: [
      'Swap afternoon coffee or soda with 1-2 cups of ceremonial Japanese green tea (Sencha, Gyokuro, or Matcha).',
      'Add 1/2 cup of organic blueberries or blackberries to your morning oats or Greek yogurt.',
    ],
    scientificEvidence:
      'The Ohsaki NHI prospective study in Japan (40,530 adults followed over 11 years) found that drinking 5+ cups of green tea daily was associated with a 26% lower risk of cardiovascular death and extended life expectancy.',
  },

  // 14. METABOLIC & BLOOD GLUCOSE MANAGEMENT
  {
    parameterKey: 'bloodSugar',
    title: 'Reverse Prediabetes & Normalize Fasting Glucose',
    description: 'Restore insulin sensitivity through carb restriction, muscle mass development, and metabolic conditioning.',
    pillar: 'biometrics',
    effortScore: 4,
    difficultyLabel: 'Challenging',
    category: 'medical_optimization',
    isApplicable: (p) => p.bloodSugar !== 'normal',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, bloodSugar: 'normal' },
      targetValue: 'normal',
      targetDisplay: 'Normal (<100 mg/dL)',
    }),
    getCurrentDisplay: (p) => {
      if (p.bloodSugar === 'prediabetes') return 'Prediabetes (100-125 mg/dL)';
      if (p.bloodSugar === 'type2_controlled') return 'Type 2 Diabetes (Controlled)';
      return 'Type 2 Diabetes (Uncontrolled)';
    },
    actionSteps: [
      'Cut liquid sugars, juices, and refined starches to keep glycemic excursion minimal.',
      'Eat dietary fiber and protein before carbohydrates at every meal ("food sequencing").',
      'Work with your physician on continuous glucose monitoring (CGM) or insulin-sensitizing protocols (e.g. Metformin, GLP-1 agonists, SGLT2i if indicated).',
    ],
    scientificEvidence:
      'Chronically elevated blood glucose creates Advanced Glycation End-products (AGEs) that cross-link arterial collagen and accelerate biological aging across every organ system.',
  },

  // 15. ALCOHOL MODERATION / REDUCTION
  {
    parameterKey: 'alcohol',
    title: 'Eliminate Binge & Heavy Alcohol Intake',
    description: 'Reduce alcohol to zero or light consumption (<= 1 drink/day) to restore liver and brain health.',
    pillar: 'lifestyle',
    effortScore: 3,
    difficultyLabel: 'Moderate',
    category: 'high_impact',
    isApplicable: (p) => p.alcohol === 'heavy_binge',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, alcohol: 'light_moderate' },
      targetValue: 'light_moderate',
      targetDisplay: 'Light / Moderate (1-7 drinks/wk)',
    }),
    getCurrentDisplay: () => 'Heavy / Binge (14+ drinks/wk)',
    actionSteps: [
      'Replace alcoholic drinks on weekdays with sparkling mineral water flavored with fresh lime, bitters, or herbal botanicals.',
      'Set a hard ceiling of maximum 1 drink on social occasions, paired with a full glass of water.',
      'Track alcohol-free days in a habit tracker app.',
    ],
    scientificEvidence:
      'Lancet meta-analysis of 599,912 drinkers revealed that alcohol consumption above 100g/week (~7 standard drinks) shows a linear reduction in life expectancy, largely driven by stroke, heart failure, and hypertensive disease.',
  },

  // 16. SUN PROTECTION & SKIN CANCER PREVENTION
  {
    parameterKey: 'sunProtection',
    title: 'Daily Broad-Spectrum Sunscreen (SPF 30+)',
    description: 'Apply daily broad-spectrum mineral sunscreen to face, neck, and hands.',
    pillar: 'lifestyle',
    effortScore: 1,
    difficultyLabel: 'Micro-Habit (Effortless)',
    category: 'quick_win',
    isApplicable: (p) => !p.sunProtection,
    getTargetProfile: (p) => ({
      targetProfile: { ...p, sunProtection: true },
      targetValue: true,
      targetDisplay: 'Consistent Sunscreen / UV Protection',
    }),
    getCurrentDisplay: () => 'Unprotected UV Exposure',
    actionSteps: [
      'Use a daily facial moisturizer that already includes broad-spectrum SPF 30-50.',
      'Keep a compact sun hat and sunglasses in your car and backpack.',
    ],
    scientificEvidence:
      'Daily sunscreen application reduces the incidence of melanoma by 50% and squamous cell carcinoma by 40% while preventing ultraviolet collagen matrix degradation.',
  },

  // 17. LIPID & CHOLESTEROL PANEL OPTIMIZATION
  {
    parameterKey: 'lipidStatus',
    title: 'Optimize Lipid Panel (ApoB < 70 / LDL < 100 mg/dL)',
    description: 'Eliminate coronary plaque accumulation through dietary fiber, plant sterols, and lipid-lowering therapies (statin/ezetimibe).',
    pillar: 'biometrics',
    effortScore: 2,
    difficultyLabel: 'Easy',
    category: 'medical_optimization',
    isApplicable: (p) => p.lipidStatus === 'high_uncontrolled' || p.lipidStatus === 'moderate_high',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, lipidStatus: 'optimal' },
      targetValue: 'optimal',
      targetDisplay: 'Optimal (ApoB < 70 / LDL < 100)',
    }),
    getCurrentDisplay: (p) => (p.lipidStatus === 'high_uncontrolled' ? 'High Unmanaged (LDL 160+)' : 'Borderline / Moderate (LDL 100–159)'),
    actionSteps: [
      'Consult your physician for an advanced lipid panel testing ApoB, LDL-P, and Lipoprotein(a).',
      'If ApoB is >80 mg/dL or LDL >100 mg/dL, discuss low-dose statin, Ezetimibe, or PCSK9 inhibitor therapy to arrest atherosclerosis.',
      'Eliminate trans-fats and increase soluble fiber (psyllium husk, oats, legumes) by 10-15g daily.',
    ],
    scientificEvidence:
      'Mendelian randomization studies establish that lifetime low levels of ApoB and LDL particles prevent the initiation of atherosclerotic plaque, adding 2 to 4 years of cardiovascular event-free survival.',
  },

  // 19. REDUCE SEDENTARY SITTING TIME
  {
    parameterKey: 'sittingHours',
    title: 'Break Up Sedentary Desk Time (< 4-6 hours/day)',
    description: 'Use a sit-stand desk and take 2-minute walking breaks every hour to maintain lipoprotein lipase activity.',
    pillar: 'fitness',
    effortScore: 2,
    difficultyLabel: 'Easy',
    category: 'quick_win',
    isApplicable: (p) => p.sittingHours === 'over_8h',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, sittingHours: 'under_4h' },
      targetValue: 'under_4h',
      targetDisplay: '< 4 hours/day (Active)',
    }),
    getCurrentDisplay: () => '8+ hours/day (High Sitting)',
    actionSteps: [
      'Alternate between standing and sitting every 45-60 minutes using an adjustable standing desk.',
      'Take a 2-minute walking or calf-raise break every hour to reactivate lower limb venous return.',
      'Stand up during phone calls and virtual audio meetings.',
    ],
    scientificEvidence:
      'Uninterrupted sitting suppresses muscular lipoprotein lipase by up to 90%. Breaking prolonged sitting lowers postprandial glucose and systemic vascular resistance, extending life expectancy by up to 1.5-2.3 years.',
  },

  // 20. DAILY HYDRATION
  {
    parameterKey: 'dailyWaterGlasses',
    title: 'Optimal Daily Hydration (6–8+ Glasses/day)',
    description: 'Maintain healthy serum sodium and renal filtration with 6 to 8 glasses of pure water daily.',
    pillar: 'nutrition',
    effortScore: 1,
    difficultyLabel: 'Micro-Habit (Effortless)',
    category: 'quick_win',
    isApplicable: (p) => p.dailyWaterGlasses < 6,
    getTargetProfile: (p) => ({
      targetProfile: { ...p, dailyWaterGlasses: 8 },
      targetValue: 8,
      targetDisplay: '8 glasses/day (Optimal)',
    }),
    getCurrentDisplay: (p) => `${p.dailyWaterGlasses} glasses/day (Suboptimal)`,
    actionSteps: [
      'Drink a 16 oz glass of water immediately upon waking to rehydrate after overnight respiratory water loss.',
      'Keep a reusable 32 oz stainless steel water bottle at your work desk and finish 2 full bottles daily.',
    ],
    scientificEvidence:
      'NIH prospective studies published in eBioMedicine showed that middle-aged adults with optimal serum sodium (138-142 mmol/L, reflecting good hydration) had significantly lower biological aging, fewer chronic diseases, and longer survival.',
  },

  // 21. RED & PROCESSED MEAT REDUCTION
  {
    parameterKey: 'redMeat',
    title: 'Replace Processed & Daily Red Meat with Fish & Plants',
    description: 'Swap sausages, bacon, and daily steaks for wild fatty fish, lentils, beans, and Mediterranean protein.',
    pillar: 'nutrition',
    effortScore: 2,
    difficultyLabel: 'Easy',
    category: 'longevity_habit',
    isApplicable: (p) => p.redMeat === 'frequent_daily',
    getTargetProfile: (p) => ({
      targetProfile: { ...p, redMeat: 'rare_none' },
      targetValue: 'rare_none',
      targetDisplay: 'Rare / None (Fish & Plants)',
    }),
    getCurrentDisplay: () => 'Daily Red / Processed Meat',
    actionSteps: [
      'Substitute processed deli meats and bacon with wild sardines, salmon, or avocado in breakfasts and lunches.',
      'Designate at least 3-4 days per week as plant-protein centered (lentil stews, chickpea curries, tempeh).',
    ],
    scientificEvidence:
      'Harvard prospective cohorts of over 120,000 participants found that substituting one daily serving of processed red meat with fish or legumes was associated with a 14-19% lower mortality rate.',
  },

  // 22. HEALTHY BODY MASS INDEX & VISCERAL ADIPOSITY
  {
    parameterKey: 'bmi',
    title: 'Optimize Body Mass Index & Visceral Adiposity (18.5–24.9)',
    description: 'Reduce visceral fat to normalize fasting insulin and decrease myocardial mechanical strain.',
    pillar: 'biometrics',
    effortScore: 4,
    difficultyLabel: 'Challenging',
    category: 'high_impact',
    isApplicable: (p) => p.bmi > 27.5,
    getTargetProfile: (p) => ({
      targetProfile: { ...p, bmi: 23.5 },
      targetValue: 23.5,
      targetDisplay: 'BMI 23.5 (Optimal Range)',
    }),
    getCurrentDisplay: (p) => `BMI ${p.bmi.toFixed(1)} (${p.bmi >= 30 ? 'Obese' : 'Overweight'})`,
    actionSteps: [
      'Maintain a modest 300-500 kcal daily deficit while consuming 1.2-1.6g/kg protein to preserve lean muscle.',
      'Combine resistance training 3x/week with 8,000+ daily steps to optimize body recomposition.',
      'Eliminate liquid calories, refined starches, and late-night snacking within 3 hours of sleep.',
    ],
    scientificEvidence:
      'Global BMI Mortality Collaboration meta-analysis (10.6 million participants across 239 studies) demonstrated that all-cause mortality is lowest in the BMI 20.0-24.9 range, adding 2.8 to 5.0 years of life expectancy compared to class I/II obesity.',
  },
];

/**
 * Calculates and ranks all actionable recommendations by Bang-for-the-Buck Index (ROI).
 */
export function getRecommendations(currentProfile: UserProfile): LongevityRecommendation[] {
  const currentResult = calculateLongevity(currentProfile);

  const recommendations: LongevityRecommendation[] = [];

  for (const candidate of MODIFIABLE_CANDIDATES) {
    if (!candidate.isApplicable(currentProfile)) {
      continue;
    }

    const { targetProfile, targetValue, targetDisplay } = candidate.getTargetProfile(currentProfile);
    const targetResult = calculateLongevity(targetProfile);
    const potentialGainYears = Number(Math.max(0, targetResult.netDelta - currentResult.netDelta).toFixed(1));

    // If there is a measurable gain:
    if (potentialGainYears > 0) {
      // Bang for buck index = (Years Gained / Effort Score) * 10
      const bangForBuckIndex = Number(((potentialGainYears / candidate.effortScore) * 10).toFixed(1));

      recommendations.push({
        id: `rec-${String(candidate.parameterKey)}`,
        pillar: candidate.pillar,
        parameterKey: candidate.parameterKey,
        title: candidate.title,
        description: candidate.description,
        currentValueDisplay: candidate.getCurrentDisplay(currentProfile),
        targetValueDisplay: targetDisplay,
        targetValue,
        potentialGainYears,
        effortScore: candidate.effortScore,
        bangForBuckIndex,
        difficultyLabel: candidate.difficultyLabel,
        actionSteps: candidate.actionSteps,
        scientificEvidence: candidate.scientificEvidence,
        category: candidate.category,
      });
    }
  }

  // Sort descending by Bang-for-the-Buck Index (highest ROI first)
  recommendations.sort((a, b) => {
    if (b.bangForBuckIndex !== a.bangForBuckIndex) {
      return b.bangForBuckIndex - a.bangForBuckIndex;
    }
    return b.potentialGainYears - a.potentialGainYears;
  });

  return recommendations;
}
