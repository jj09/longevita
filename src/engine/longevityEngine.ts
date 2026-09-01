import {
  UserProfile,
  LongevityCalculationResult,
  ImpactBreakdownItem,
  CategorySummary,
  BloodPressureCategory,
} from './types';
import { getActuarialBaseline } from './actuarial';

/**
 * Computes BP category from numeric systolic and diastolic values if not explicitly set
 */
export function getBloodPressureCategory(systolic: number, diastolic: number): BloodPressureCategory {
  if (systolic >= 160 || diastolic >= 100) return 'severe_untreated';
  if (systolic >= 140 || diastolic >= 90) return 'stage2';
  if (systolic >= 130 || diastolic >= 80) return 'stage1';
  if (systolic >= 120 && diastolic < 80) return 'elevated';
  return 'optimal';
}

/**
 * Calculates comprehensive longevity projection, biological age, and itemized impact breakdowns.
 */
export function calculateLongevity(profile: UserProfile): LongevityCalculationResult {
  const actuarialBaseline = getActuarialBaseline(profile.age, profile.sex);
  const impacts: ImpactBreakdownItem[] = [];

  // ==========================================
  // 1. DEMOGRAPHICS & GENETICS
  // ==========================================
  // Relationship Status
  let relDelta = 0;
  let relDisplay = 'Single';
  let relExpl = 'Single status represents the baseline standard demographic risk.';
  if (profile.relationshipStatus === 'partnered_married') {
    relDelta = 3.0;
    relDisplay = 'Partnered / Married';
    relExpl = 'Long-term partnership provides cohabitation safety, emotional security, mutual care, and crisis support (+3.0 yrs).';
  } else if (profile.relationshipStatus === 'separated_divorced_widowed') {
    relDelta = -1.5;
    relDisplay = 'Separated / Divorced / Widowed';
    relExpl = 'Marital disruption or bereavement is associated with acute chronic stress and reduced social support (-1.5 yrs).';
  }
  impacts.push({
    key: 'relationshipStatus',
    label: 'Relationship & Partnership',
    category: 'demographics',
    yearsDelta: relDelta,
    currentValueDisplay: relDisplay,
    scientificExplanation: relExpl,
    isPositive: relDelta >= 0,
  });

  // 1. Early Family Disease History (First-degree relatives <60)
  let disDelta = 0;
  let disDisplay = 'No Early CVD / Cancer (<60)';
  let disExpl = 'No history of premature fatal cardiovascular disease or cancer in parents or siblings.';
  if (profile.earlyFamilyDisease === 'early_cvd') {
    disDelta = -2.5;
    disDisplay = 'Early Heart Disease / Stroke (<60)';
    disExpl = 'First-degree relative with premature cardiovascular disease or stroke before 60 indicates elevated genetic vascular risk (-2.5 yrs).';
  } else if (profile.earlyFamilyDisease === 'early_cancer') {
    disDelta = -2.5;
    disDisplay = 'Early Cancer (<60)';
    disExpl = 'First-degree relative with cancer before age 60 indicates hereditary cancer predisposition pathways (-2.5 yrs).';
  } else if (profile.earlyFamilyDisease === 'multiple_early') {
    disDelta = -4.0;
    disDisplay = 'Multiple Early CVD / Cancers (<60)';
    disExpl = 'Two or more first-degree relatives with premature disease before age 60 confers compounded hereditary risk (-4.0 yrs).';
  }
  impacts.push({
    key: 'earlyFamilyDisease',
    label: 'Early Family Disease Risk',
    category: 'demographics',
    yearsDelta: disDelta,
    currentValueDisplay: disDisplay,
    scientificExplanation: disExpl,
    isPositive: disDelta >= 0,
  });

  // 2. Exceptional Family Longevity Genetics
  let famDelta = 0;
  let famDisplay = 'Typical Lifespans (Under 85)';
  let famExpl = 'Average family longevity reflects standard population genetic baseline.';
  if (profile.familyLongevity === 'relative_85_89') {
    famDelta = 1.5;
    famDisplay = 'At Least One Reached 85–89';
    famExpl = 'At least one parent or grandparent living past 85 indicates favorable baseline metabolic and vascular resilience (+1.5 yrs).';
  } else if (profile.familyLongevity === 'relative_90_99') {
    famDelta = 3.5;
    famDisplay = 'At Least One Reached 90–99';
    famExpl = 'At least one parent or grandparent surviving past 90 strongly correlates with exceptional longevity protective alleles (+3.5 yrs).';
  } else if (profile.familyLongevity === 'centenarian_100plus') {
    famDelta = 5.0;
    famDisplay = 'Centenarian Relative (100+)';
    famExpl = 'New England Centenarian Study shows 100+ relatives confer marked genetic protection against age-related degeneration (+5.0 yrs).';
  }
  impacts.push({
    key: 'familyLongevity',
    label: 'Exceptional Family Longevity',
    category: 'demographics',
    yearsDelta: famDelta,
    currentValueDisplay: famDisplay,
    scientificExplanation: famExpl,
    isPositive: famDelta >= 0,
  });

  // Air Quality & Environment
  let airDelta = 0;
  let airDisplay = 'Moderate Suburban Air';
  let airExpl = 'Standard suburban particulate exposure.';
  if (profile.airQuality === 'clean_rural') {
    airDelta = 1.0;
    airDisplay = 'Clean Mountain / Coastal Air';
    airExpl = 'Low PM2.5 particulate matter and clean air reduce pulmonary and vascular inflammation (+1.0 yr).';
  } else if (profile.airQuality === 'polluted_urban') {
    airDelta = -1.8;
    airDisplay = 'High Urban Pollution';
    airExpl = 'Chronic exposure to high PM2.5 air pollution increases atherosclerosis and respiratory disease risks (-1.8 yrs).';
  }
  impacts.push({
    key: 'airQuality',
    label: 'Air Quality & Environment',
    category: 'demographics',
    yearsDelta: airDelta,
    currentValueDisplay: airDisplay,
    scientificExplanation: airExpl,
    isPositive: airDelta >= 0,
  });

  // ==========================================
  // 2. BIOMETRICS & CLINICAL MARKERS
  // ==========================================
  // Blood Pressure
  const bpCat = profile.bpCategory || getBloodPressureCategory(profile.systolicBP, profile.diastolicBP);
  let bpDelta = 0;
  let bpDisplay = `${profile.systolicBP}/${profile.diastolicBP} mmHg (${bpCat})`;
  let bpExpl = '';
  if (bpCat === 'optimal') {
    bpDelta = 1.8;
    bpExpl = 'Optimal BP (<120/80) preserves arterial elasticity, prevents endothelial damage, and minimizes stroke/heart failure risk (+1.8 yrs).';
  } else if (bpCat === 'elevated') {
    bpDelta = 0.0;
    bpExpl = 'Elevated BP (120-129/<80) represents early vascular stiffening.';
  } else if (bpCat === 'stage1') {
    bpDelta = -1.5;
    bpExpl = 'Stage 1 Hypertension (130-139/80-89) steadily increases microvascular strain and renal decline (-1.5 yrs).';
  } else if (bpCat === 'stage2') {
    bpDelta = -3.2;
    bpExpl = 'Stage 2 Hypertension (140+/90+) significantly accelerates coronary artery disease, stroke, and cognitive impairment (-3.2 yrs).';
  } else {
    bpDelta = -5.5;
    bpExpl = 'Severe / Untreated Hypertension (160+/100+) is a critical risk multiplier for acute cardiovascular events (-5.5 yrs).';
  }
  impacts.push({
    key: 'bloodPressure',
    label: 'Blood Pressure',
    category: 'biometrics',
    yearsDelta: bpDelta,
    currentValueDisplay: bpDisplay,
    scientificExplanation: bpExpl,
    isPositive: bpDelta >= 0,
  });

  // Blood Sugar / Diabetes
  let sugarDelta = 0;
  let sugarDisplay = 'Normal (<100 mg/dL)';
  let sugarExpl = 'Normal glycemic regulation preserves microvascular capillary networks (+1.0 yr).';
  if (profile.bloodSugar === 'normal') {
    sugarDelta = 1.0;
  } else if (profile.bloodSugar === 'prediabetes') {
    sugarDelta = -1.2;
    sugarDisplay = 'Prediabetes (100-125 mg/dL)';
    sugarExpl = 'Elevated fasting glucose indicates insulin resistance and systemic subclinical inflammation (-1.2 yrs).';
  } else if (profile.bloodSugar === 'type2_controlled') {
    sugarDelta = -2.5;
    sugarDisplay = 'Type 2 Diabetes (Controlled)';
    sugarExpl = 'Managed diabetes carries moderate cumulative vascular and renal risk over decades (-2.5 yrs).';
  } else if (profile.bloodSugar === 'type2_uncontrolled') {
    sugarDelta = -6.0;
    sugarDisplay = 'Type 2 Diabetes (Uncontrolled)';
    sugarExpl = 'Chronic hyperglycemia causes advanced glycation end-products, nephropathy, and major CVD risks (-6.0 yrs).';
  }
  impacts.push({
    key: 'bloodSugar',
    label: 'Blood Glucose & Metabolic Health',
    category: 'biometrics',
    yearsDelta: sugarDelta,
    currentValueDisplay: sugarDisplay,
    scientificExplanation: sugarExpl,
    isPositive: sugarDelta >= 0,
  });

  // Lipid / Cholesterol Status
  let lipidDelta = 0;
  let lipidDisplay = 'Optimal (LDL < 100 / ApoB < 70)';
  let lipidExpl = 'Optimal lipid particle count (LDL-C < 100 mg/dL, ApoB < 70 mg/dL, Triglycerides < 100 mg/dL) minimizes coronary atheroma plaque accumulation (+1.2 yrs).';
  if (profile.lipidStatus === 'optimal') {
    lipidDelta = 1.2;
  } else if (profile.lipidStatus === 'moderate_high') {
    lipidDelta = -1.0;
    lipidDisplay = 'Borderline / Moderate (LDL 100–159)';
    lipidExpl = 'Borderline elevated cholesterol (LDL 100–159 mg/dL, ApoB 70–100 mg/dL) gradually contributes to arterial plaque formation (-1.0 yr).';
  } else if (profile.lipidStatus === 'high_uncontrolled') {
    lipidDelta = -3.0;
    lipidDisplay = 'High Unmanaged (LDL 160+ / ApoB > 100)';
    lipidExpl = 'High untreated LDL-C (≥160 mg/dL) or ApoB (>100 mg/dL) drives accelerated plaque calcification and coronary events (-3.0 yrs).';
  } else if (profile.lipidStatus === 'high_managed_statin') {
    lipidDelta = 0.2;
    lipidDisplay = 'Medication Managed (On Statin / Rx)';
    lipidExpl = 'Lipid-lowering statin/Ezetimibe therapy stabilizes coronary plaques and brings vascular event risk close to baseline (+0.2 yrs).';
  }
  impacts.push({
    key: 'lipidStatus',
    label: 'Lipid & Cholesterol Profile',
    category: 'biometrics',
    yearsDelta: lipidDelta,
    currentValueDisplay: lipidDisplay,
    scientificExplanation: lipidExpl,
    isPositive: lipidDelta >= 0,
  });

  // BMI / Body Composition
  let bmiDelta = 0;
  let bmiDisplay = `BMI ${profile.bmi.toFixed(1)}`;
  let bmiExpl = '';
  if (profile.bmi < 18.5) {
    bmiDelta = -2.0;
    bmiDisplay += ' (Underweight)';
    bmiExpl = 'Low body weight is linked to sarcopenia, osteoporosis, and increased mortality in later life (-2.0 yrs).';
  } else if (profile.bmi <= 24.9) {
    bmiDelta = 1.5;
    bmiDisplay += ' (Optimal 18.5 - 24.9)';
    bmiExpl = 'Healthy body mass index minimizes visceral adiposity, fatty liver, and metabolic strain (+1.5 yrs).';
  } else if (profile.bmi <= 27.5) {
    bmiDelta = 0.0;
    bmiDisplay += ' (Mild Overweight)';
    bmiExpl = 'Slight overweight with adequate muscle mass has minimal mortality impact in mid-to-late life.';
  } else if (profile.bmi <= 29.9) {
    bmiDelta = -1.2;
    bmiDisplay += ' (Overweight 27.6 - 29.9)';
    bmiExpl = 'Excess visceral adipose tissue triggers inflammatory cytokine release and insulin resistance (-1.2 yrs).';
  } else if (profile.bmi <= 34.9) {
    bmiDelta = -2.8;
    bmiDisplay += ' (Obesity Class I)';
    bmiExpl = 'Class 1 obesity significantly stresses the heart, joints, and metabolic pathways (-2.8 yrs).';
  } else {
    bmiDelta = -5.0;
    bmiDisplay += ' (Severe Obesity Class II/III)';
    bmiExpl = 'Severe obesity leads to severe cardiometabolic risk, sleep apnea, and reduced mobility (-5.0 yrs).';
  }
  impacts.push({
    key: 'bmi',
    label: 'Body Mass Index & Adiposity',
    category: 'biometrics',
    yearsDelta: bmiDelta,
    currentValueDisplay: bmiDisplay,
    scientificExplanation: bmiExpl,
    isPositive: bmiDelta >= 0,
  });

  // Resting Heart Rate
  let rhrDelta = 0;
  let rhrDisplay = `${profile.restingHeartRate} bpm`;
  let rhrExpl = '';
  if (profile.restingHeartRate < 60) {
    rhrDelta = 1.2;
    rhrExpl = 'Low resting HR indicates strong stroke volume and high parasympathetic vagal tone (+1.2 yrs).';
  } else if (profile.restingHeartRate <= 70) {
    rhrDelta = 0.5;
    rhrExpl = 'Good resting heart rate reflecting healthy myocardial conditioning (+0.5 yrs).';
  } else if (profile.restingHeartRate <= 80) {
    rhrDelta = 0.0;
    rhrExpl = 'Average resting heart rate in normal range.';
  } else if (profile.restingHeartRate <= 90) {
    rhrDelta = -1.2;
    rhrExpl = 'Elevated resting HR (>80 bpm) indicates sympathetic dominance and higher cardiovascular workload (-1.2 yrs).';
  } else {
    rhrDelta = -2.5;
    rhrExpl = 'Tachycardia / High resting HR (>90 bpm) strongly correlates with increased all-cause mortality (-2.5 yrs).';
  }
  impacts.push({
    key: 'restingHeartRate',
    label: 'Resting Heart Rate',
    category: 'biometrics',
    yearsDelta: rhrDelta,
    currentValueDisplay: rhrDisplay,
    scientificExplanation: rhrExpl,
    isPositive: rhrDelta >= 0,
  });

  // ==========================================
  // 3. FITNESS & PHYSICAL ACTIVITY
  // ==========================================
  // Aerobic Cardio
  let cardioDelta = 0;
  let cardioDisplay = 'Moderate (150 min/wk)';
  let cardioExpl = '150 min/week moderate aerobic cardio meets WHO/AHA longevity guidelines (+2.5 yrs).';
  if (profile.cardio === 'sedentary') {
    cardioDelta = -3.5;
    cardioDisplay = 'Sedentary (0 min/wk)';
    cardioExpl = 'Physical inactivity is as hazardous as mild smoking, accelerating cardiorespiratory deconditioning (-3.5 yrs).';
  } else if (profile.cardio === 'light') {
    cardioDelta = -1.0;
    cardioDisplay = 'Light (<60 min/wk)';
    cardioExpl = 'Light exercise provides partial protection but falls short of ideal cardiovascular conditioning (-1.0 yr).';
  } else if (profile.cardio === 'moderate') {
    cardioDelta = 2.5;
  } else if (profile.cardio === 'high') {
    cardioDelta = 4.0;
    cardioDisplay = 'High (300+ min/wk Zone 2 + HIIT)';
    cardioExpl = 'High VO2 max and regular aerobic conditioning provide elite longevity protection and mitochondrial biogenesis (+4.0 yrs).';
  }
  impacts.push({
    key: 'cardio',
    label: 'Aerobic Exercise & Cardio',
    category: 'fitness',
    yearsDelta: cardioDelta,
    currentValueDisplay: cardioDisplay,
    scientificExplanation: cardioExpl,
    isPositive: cardioDelta >= 0,
  });

  // Strength / Resistance Training
  let strengthDelta = 0;
  let strengthDisplay = 'Occasional (1-2x/wk)';
  let strengthExpl = 'Occasional resistance training offers basic muscular maintenance (+1.0 yr).';
  if (profile.strengthTraining === 'none') {
    strengthDelta = -1.2;
    strengthDisplay = 'None (0 days/wk)';
    strengthExpl = 'Lack of resistance exercise accelerates age-related sarcopenia, bone density loss, and fall risk in late life (-1.2 yrs).';
  } else if (profile.strengthTraining === 'occasional') {
    strengthDelta = 1.0;
  } else if (profile.strengthTraining === 'optimal') {
    strengthDelta = 2.2;
    strengthDisplay = 'Optimal (3+ days/wk)';
    strengthExpl = 'Consistent progressive resistance training preserves metabolic sink, bone density, and functional independence (+2.2 yrs).';
  }
  impacts.push({
    key: 'strengthTraining',
    label: 'Strength & Resistance Training',
    category: 'fitness',
    yearsDelta: strengthDelta,
    currentValueDisplay: strengthDisplay,
    scientificExplanation: strengthExpl,
    isPositive: strengthDelta >= 0,
  });

  // Daily Steps
  let stepDelta = 0;
  let stepDisplay = '8,000 - 10,000 steps/day';
  let stepExpl = 'Walking 8k-10k steps/day optimizes glucose clearance and all-cause survival (+1.5 yrs).';
  if (profile.dailySteps === 'under_4k') {
    stepDelta = -2.0;
    stepDisplay = '< 4,000 steps/day';
    stepExpl = 'Low daily step count (<4,000) corresponds to severe non-exercise physical inactivity (-2.0 yrs).';
  } else if (profile.dailySteps === '4k_to_7k') {
    stepDelta = 0.0;
    stepDisplay = '4,000 - 7,000 steps/day';
    stepExpl = 'Moderate daily movement provides a baseline level of activity.';
  } else if (profile.dailySteps === '8k_to_10k') {
    stepDelta = 1.5;
  } else if (profile.dailySteps === 'over_10k') {
    stepDelta = 2.5;
    stepDisplay = '10,000+ steps/day';
    stepExpl = '10k+ daily steps maintains vigorous vascular endothelial shear stress and high NEAT (+2.5 yrs).';
  }
  impacts.push({
    key: 'dailySteps',
    label: 'Daily Movement & Step Count',
    category: 'fitness',
    yearsDelta: stepDelta,
    currentValueDisplay: stepDisplay,
    scientificExplanation: stepExpl,
    isPositive: stepDelta >= 0,
  });

  // Sedentary Sitting Time
  let sitDelta = 0;
  let sitDisplay = '4 to 8 hours/day';
  let sitExpl = 'Standard sitting time with typical daily activity breaks.';
  if (profile.sittingHours === 'under_4h') {
    sitDelta = 0.8;
    sitDisplay = '< 4 hours/day (Active)';
    sitExpl = 'Low sitting time reduces venous stasis and improves lipid metabolism (+0.8 yrs).';
  } else if (profile.sittingHours === 'over_8h') {
    sitDelta = -1.5;
    sitDisplay = '8+ hours/day (High Sitting)';
    sitExpl = 'Prolonged uninterrupted sitting blunts lipoprotein lipase activity and increases metabolic disease risk (-1.5 yrs).';
  }
  impacts.push({
    key: 'sittingHours',
    label: 'Sedentary Sitting Duration',
    category: 'fitness',
    yearsDelta: sitDelta,
    currentValueDisplay: sitDisplay,
    scientificExplanation: sitExpl,
    isPositive: sitDelta >= 0,
  });

  // ==========================================
  // 4. NUTRITION & BLUE ZONE DIET
  // ==========================================
  // Overall Dietary Pattern
  let dietDelta = 0;
  let dietDisplay = 'Mediterranean / Blue Zone Diet';
  let dietExpl = 'Whole plant-forward diet rich in extra virgin olive oil, polyphenols, legumes, and nuts (+3.5 yrs).';
  if (profile.dietPattern === 'standard_processed') {
    dietDelta = -3.0;
    dietDisplay = 'Standard Processed / Fast Food';
    dietExpl = 'Diet high in refined carbs, trans-fats, and ultra-processed foods drives systemic oxidative stress (-3.0 yrs).';
  } else if (profile.dietPattern === 'moderate_balanced') {
    dietDelta = 1.0;
    dietDisplay = 'Balanced Whole Foods';
    dietExpl = 'Balanced home-cooked whole food diet provides solid micronutrient density (+1.0 yr).';
  } else if (profile.dietPattern === 'mediterranean_bluezone') {
    dietDelta = 3.5;
  }
  impacts.push({
    key: 'dietPattern',
    label: 'Dietary Quality & Blue Zone Pattern',
    category: 'nutrition',
    yearsDelta: dietDelta,
    currentValueDisplay: dietDisplay,
    scientificExplanation: dietExpl,
    isPositive: dietDelta >= 0,
  });

  // Red & Processed Meat
  let meatDelta = 0;
  let meatDisplay = 'Moderate / Weekly';
  let meatExpl = 'Occasional meat consumption with balanced protein sources.';
  if (profile.redMeat === 'frequent_daily') {
    meatDelta = -2.0;
    meatDisplay = 'Daily Red / Processed Meat';
    meatExpl = 'High intake of processed meats (sausages, bacon) and daily red meat increases colorectal cancer and TMAO vascular risk (-2.0 yrs).';
  } else if (profile.redMeat === 'rare_none') {
    meatDelta = 1.5;
    meatDisplay = 'Rare / None (Fish & Plants)';
    meatExpl = 'Plant-centric protein and wild fish (Okinawa/Sardinia Blue Zone) reduce IGF-1 overstimulation and CVD (+1.5 yrs).';
  }
  impacts.push({
    key: 'redMeat',
    label: 'Red & Processed Meat Intake',
    category: 'nutrition',
    yearsDelta: meatDelta,
    currentValueDisplay: meatDisplay,
    scientificExplanation: meatExpl,
    isPositive: meatDelta >= 0,
  });

  // Fruits, Vegetables & Fiber
  let vegDelta = 0;
  let vegDisplay = '5+ servings / day';
  let vegExpl = 'High dietary fiber and micronutrients fuel gut microbiome diversity and short-chain fatty acid production (+2.0 yrs).';
  if (profile.veggieFruitServings === 'under_2') {
    vegDelta = -1.5;
    vegDisplay = '< 2 servings / day';
    vegExpl = 'Low fiber intake compromises gut microbiota barrier integrity and increases chronic inflammation (-1.5 yrs).';
  } else if (profile.veggieFruitServings === '2_to_4') {
    vegDelta = 0.5;
    vegDisplay = '2 to 4 servings / day';
    vegExpl = 'Moderate fruit and vegetable intake (+0.5 yrs).';
  } else if (profile.veggieFruitServings === '5_plus') {
    vegDelta = 2.0;
  }
  impacts.push({
    key: 'veggieFruitServings',
    label: 'Fruits, Vegetables & Fiber',
    category: 'nutrition',
    yearsDelta: vegDelta,
    currentValueDisplay: vegDisplay,
    scientificExplanation: vegExpl,
    isPositive: vegDelta >= 0,
  });

  // Ultra-processed Foods & Sugary Drinks
  let upfDelta = 0;
  let upfDisplay = 'Minimal / Rare';
  let upfExpl = 'Avoiding sugary sodas and packaged snacks prevents glycemic spikes and visceral fat (+1.5 yrs).';
  if (profile.ultraProcessed === 'daily_frequent') {
    upfDelta = -2.2;
    upfDisplay = 'Daily / Frequent';
    upfExpl = 'Frequent soda and packaged snack foods spike insulin, promoting non-alcoholic fatty liver disease (-2.2 yrs).';
  } else if (profile.ultraProcessed === 'occasional') {
    upfDelta = 0.0;
    upfDisplay = 'Occasional';
    upfExpl = 'Occasional indulgence in moderation.';
  } else if (profile.ultraProcessed === 'minimal_rare') {
    upfDelta = 1.5;
  }
  impacts.push({
    key: 'ultraProcessed',
    label: 'Ultra-Processed Foods & Sugary Drinks',
    category: 'nutrition',
    yearsDelta: upfDelta,
    currentValueDisplay: upfDisplay,
    scientificExplanation: upfExpl,
    isPositive: upfDelta >= 0,
  });

  // Polyphenols & Green Tea / Coffee
  let polyDelta = 0;
  let polyDisplay = 'Moderate Coffee / Tea (1-3 cups)';
  let polyExpl = 'Moderate coffee/tea intake provides catechins and chlorogenic acid associated with lower all-cause mortality (+0.6 yrs).';
  if (profile.polyphenols === 'none') {
    polyDelta = 0.0;
    polyDisplay = 'None';
    polyExpl = 'Zero regular polyphenol beverage intake.';
  } else if (profile.polyphenols === 'high_green_tea_berries') {
    polyDelta = 1.2;
    polyDisplay = 'High (Green Tea / Berries / Cocoa)';
    polyExpl = 'High EGCG green tea and anthocyanin berries boost autophagy and protect cellular DNA (+1.2 yrs).';
  } else {
    polyDelta = 0.6;
  }
  impacts.push({
    key: 'polyphenols',
    label: 'Polyphenols (Green Tea, Coffee, Berries)',
    category: 'nutrition',
    yearsDelta: polyDelta,
    currentValueDisplay: polyDisplay,
    scientificExplanation: polyExpl,
    isPositive: polyDelta >= 0,
  });

  // Hydration
  let waterDelta = 0;
  let waterDisplay = `${profile.dailyWaterGlasses} glasses/day`;
  let waterExpl = '';
  if (profile.dailyWaterGlasses >= 6) {
    waterDelta = 0.5;
    waterExpl = 'Adequate hydration maintains serum sodium balance, renal filtration, and blood viscosity (+0.5 yrs).';
  } else {
    waterDelta = -0.5;
    waterExpl = 'Suboptimal hydration (<5 glasses) puts mild chronic strain on renal tubules and raises serum sodium (-0.5 yrs).';
  }
  impacts.push({
    key: 'dailyWaterGlasses',
    label: 'Daily Hydration',
    category: 'nutrition',
    yearsDelta: waterDelta,
    currentValueDisplay: waterDisplay,
    scientificExplanation: waterExpl,
    isPositive: waterDelta >= 0,
  });

  // ==========================================
  // 5. LIFESTYLE, SLEEP & MIND
  // ==========================================
  // Smoking / Tobacco / Vaping
  let smokeDelta = 0;
  let smokeDisplay = 'Never Smoked';
  let smokeExpl = 'Never smoking protects coronary vasculature, pulmonary alveoli, and genomic stability (+3.0 yrs vs mixed population).';
  if (profile.smoking === 'current_heavy') {
    smokeDelta = -9.5;
    smokeDisplay = 'Current Heavy (1+ pack/day)';
    smokeExpl = 'Heavy tobacco smoking severely degrades endothelial function, damages DNA, and is the #1 preventable cause of premature death (-9.5 yrs).';
  } else if (profile.smoking === 'current_light') {
    smokeDelta = -4.5;
    smokeDisplay = 'Current Light / Vaping (<10/day)';
    smokeExpl = 'Light smoking or regular vaping causes chronic airway inflammation and accelerated arterial plaque (-4.5 yrs).';
  } else if (profile.smoking === 'former_recent') {
    smokeDelta = 0.5;
    smokeDisplay = 'Former Smoker (<5 yrs quit)';
    smokeExpl = 'Quitting recently has already begun reversing cardiovascular risk, recovering significant lost years (+0.5 yrs).';
  } else if (profile.smoking === 'former_long') {
    smokeDelta = 2.0;
    smokeDisplay = 'Former Smoker (10+ yrs quit)';
    smokeExpl = '10+ years after quitting, cardiovascular risk approaches that of a non-smoker (+2.0 yrs).';
  } else if (profile.smoking === 'never') {
    smokeDelta = 3.0;
  }
  impacts.push({
    key: 'smoking',
    label: 'Smoking & Tobacco Use',
    category: 'lifestyle',
    yearsDelta: smokeDelta,
    currentValueDisplay: smokeDisplay,
    scientificExplanation: smokeExpl,
    isPositive: smokeDelta >= 0,
  });

  // Alcohol Intake
  let alcDelta = 0;
  let alcDisplay = 'Light / Moderate (1-7 drinks/wk)';
  let alcExpl = 'Light alcohol consumption represents low risk.';
  if (profile.alcohol === 'none') {
    alcDelta = 0.5;
    alcDisplay = 'Zero Alcohol (Non-drinker)';
    alcExpl = 'Zero alcohol eliminates hepatic toxicity, sleep architecture disruption, and alcohol-induced carcinogenesis (+0.5 yrs).';
  } else if (profile.alcohol === 'heavy_binge') {
    alcDelta = -5.0;
    alcDisplay = 'Heavy / Binge (14+ drinks/wk)';
    alcExpl = 'Heavy alcohol intake causes hepatic steatosis, cardiomyopathy, elevated blood pressure, and neural atrophy (-5.0 yrs).';
  }
  impacts.push({
    key: 'alcohol',
    label: 'Alcohol Consumption',
    category: 'lifestyle',
    yearsDelta: alcDelta,
    currentValueDisplay: alcDisplay,
    scientificExplanation: alcExpl,
    isPositive: alcDelta >= 0,
  });

  // Sleep Quality & Duration
  let sleepDelta = 0;
  let sleepDisplay = '7 to 8 hours optimal';
  let sleepExpl = '7-8 hours of restful sleep enables glymphatic brain waste clearance and hormonal circadian recovery (+2.2 yrs).';
  if (profile.sleep === 'under_6h') {
    sleepDelta = -2.8;
    sleepDisplay = '< 6 hours / Chronic Deprivation';
    sleepExpl = 'Chronic short sleep increases sympathetic tone, morning blood pressure spikes, and amyloid deposition (-2.8 yrs).';
  } else if (profile.sleep === '6_to_7h') {
    sleepDelta = 0.0;
    sleepDisplay = '6 to 7 hours';
    sleepExpl = 'Moderate sleep duration, slightly below optimal longevity threshold.';
  } else if (profile.sleep === '7_to_8h_optimal') {
    sleepDelta = 2.2;
  } else if (profile.sleep === 'over_9h') {
    sleepDelta = -1.5;
    sleepDisplay = '9+ hours (Excessive)';
    sleepExpl = 'Excessive sleep duration is statistically correlated with chronic underlying inflammatory or metabolic conditions (-1.5 yrs).';
  } else if (profile.sleep === 'chronic_apnea_insomnia') {
    sleepDelta = -4.0;
    sleepDisplay = 'Untreated Sleep Apnea / Severe Insomnia';
    sleepExpl = 'Nocturnal hypoxia from sleep apnea causes repeated pulmonary hypertension and vascular oxidative bursts (-4.0 yrs).';
  }
  impacts.push({
    key: 'sleep',
    label: 'Sleep Duration & Quality',
    category: 'lifestyle',
    yearsDelta: sleepDelta,
    currentValueDisplay: sleepDisplay,
    scientificExplanation: sleepExpl,
    isPositive: sleepDelta >= 0,
  });

  // Stress & Coping
  let stressDelta = 0;
  let stressDisplay = 'Moderate Daily Stress';
  let stressExpl = 'Typical everyday stress levels.';
  if (profile.stress === 'severe_unmanaged') {
    stressDelta = -3.5;
    stressDisplay = 'Severe / Chronic Unmanaged';
    stressExpl = 'Constant hypercortisolemia accelerates telomere shortening and damages hippocampal neurons (-3.5 yrs).';
  } else if (profile.stress === 'well_managed_mindful') {
    stressDelta = 2.0;
    stressDisplay = 'Well-Managed / Mindful Resilience';
    stressExpl = 'Active stress mitigation (meditation, nature, calm mindset) protects immune function and vagal tone (+2.0 yrs).';
  }
  impacts.push({
    key: 'stress',
    label: 'Stress Management & Psychological Coping',
    category: 'lifestyle',
    yearsDelta: stressDelta,
    currentValueDisplay: stressDisplay,
    scientificExplanation: stressExpl,
    isPositive: stressDelta >= 0,
  });

  // In-Person Social Connection & Community (Dr. Perls Living to 100 Factor)
  let socDelta = 0;
  let socDisplay = 'Weekly (1–2 times / week)';
  let socExpl = 'Regular weekly face-to-face meetups provide sustained emotional connection and stress buffering (+1.5 yrs).';
  if (profile.socialConnection === 'rare_isolated') {
    socDelta = -3.0;
    socDisplay = '< 1 time / month (Rare / Isolated)';
    socExpl = 'Lack of in-person social connection triggers chronic neuroendocrine stress responses and cardiovascular strain (-3.0 yrs).';
  } else if (profile.socialConnection === 'monthly_occasional') {
    socDelta = 0.5;
    socDisplay = '1–3 times / month (Occasional)';
    socExpl = 'Occasional in-person social contact provides periodic emotional grounding (+0.5 yrs).';
  } else if (profile.socialConnection === 'weekly_1_to_2') {
    socDelta = 1.5;
  } else if (profile.socialConnection === 'frequent_3plus_weekly') {
    socDelta = 3.0;
    socDisplay = '3+ times / week (Frequent)';
    socExpl = 'Frequent in-person connection, shared meals, and community rituals strongly mirror Blue Zone longevity (+3.0 yrs).';
  }
  impacts.push({
    key: 'socialConnection',
    label: 'In-Person Social Connection',
    category: 'lifestyle',
    yearsDelta: socDelta,
    currentValueDisplay: socDisplay,
    scientificExplanation: socExpl,
    isPositive: socDelta >= 0,
  });

  // Dental Flossing / Oral Health (Famous Dr. Perls / Living to 100 Factor!)
  let flossDelta = 0;
  let flossDisplay = 'Daily Flossing';
  let flossExpl = 'Flossing daily removes subgingival bacterial biofilm, preventing oral pathogens (e.g. P. gingivalis) from entering bloodstream and causing coronary endothelitis (+1.2 yrs).';
  if (profile.flossing === 'rarely_never') {
    flossDelta = -1.2;
    flossDisplay = 'Rarely / Never';
    flossExpl = 'Chronic periodontal inflammation releases systemic inflammatory cytokines (CRP, IL-6) directly linked to cardiovascular plaques (-1.2 yrs).';
  } else if (profile.flossing === 'occasional') {
    flossDelta = 0.0;
    flossDisplay = 'Occasional';
    flossExpl = 'Occasional flossing provides partial periodontal protection.';
  } else if (profile.flossing === 'daily_flossing') {
    flossDelta = 1.2;
  }
  impacts.push({
    key: 'flossing',
    label: 'Daily Dental Flossing (Oral Microbiome)',
    category: 'lifestyle',
    yearsDelta: flossDelta,
    currentValueDisplay: flossDisplay,
    scientificExplanation: flossExpl,
    isPositive: flossDelta >= 0,
  });

  // Sun Protection
  let sunDelta = profile.sunProtection ? 0.6 : -0.6;
  impacts.push({
    key: 'sunProtection',
    label: 'Sun Protection & Skin Health',
    category: 'lifestyle',
    yearsDelta: sunDelta,
    currentValueDisplay: profile.sunProtection ? 'Consistent Sunscreen / UV Care' : 'Unprotected UV Exposure',
    scientificExplanation: profile.sunProtection
      ? 'Daily UV protection prevents cutaneous photoaging and reduces melanoma risks (+0.6 yrs).'
      : 'Chronic unprotected UV exposure increases skin carcinoma and melanoma vulnerability (-0.6 yrs).',
    isPositive: sunDelta >= 0,
  });

  // Seatbelt & Driving Safety
  let seatDelta = profile.seatbeltSafety ? 0.8 : -2.0;
  impacts.push({
    key: 'seatbeltSafety',
    label: 'Seatbelt & Transport Safety',
    category: 'lifestyle',
    yearsDelta: seatDelta,
    currentValueDisplay: profile.seatbeltSafety ? 'Always Buckled / Safe Driver' : 'Inconsistent Seatbelt / Distracted Driving',
    scientificExplanation: profile.seatbeltSafety
      ? 'Habitual seatbelt usage protects against the leading non-medical cause of premature mortality (+0.8 yrs).'
      : 'Inconsistent seatbelt use dramatically elevates fatal motor vehicle accident risks (-2.0 yrs).',
    isPositive: seatDelta >= 0,
  });

  // Preventative Screenings
  let screenDelta = profile.screenings === 'up_to_date' ? 1.8 : -2.0;
  impacts.push({
    key: 'screenings',
    label: 'Preventative Medical Screenings',
    category: 'lifestyle',
    yearsDelta: screenDelta,
    currentValueDisplay: profile.screenings === 'up_to_date' ? 'Up-to-Date on Screenings' : 'Neglected / Avoids Screenings',
    scientificExplanation: profile.screenings === 'up_to_date'
      ? 'Regular blood panels, colonoscopy, and cancer screenings catch early neoplasia and cardiometabolic issues when highly curable (+1.8 yrs).'
      : 'Avoiding preventative screenings risks unmonitored progression of silent chronic diseases (-2.0 yrs).',
    isPositive: screenDelta >= 0,
  });

  // ==========================================
  // AGGREGATION & LIFESPAN COMPUTATION
  // ==========================================
  const categories: Array<'demographics' | 'biometrics' | 'fitness' | 'nutrition' | 'lifestyle'> = [
    'demographics',
    'biometrics',
    'fitness',
    'nutrition',
    'lifestyle',
  ];

  const categoryLabels: Record<string, string> = {
    demographics: 'Demographics & Genetics',
    biometrics: 'Biometrics & Clinical Markers',
    fitness: 'Fitness & Physical Activity',
    nutrition: 'Nutrition & Blue Zone Diet',
    lifestyle: 'Lifestyle, Sleep & Mind',
  };

  const categorySummaries: CategorySummary[] = categories.map((cat) => {
    const items = impacts.filter((item) => item.category === cat);
    const yearsDelta = Number(items.reduce((acc, it) => acc + it.yearsDelta, 0).toFixed(1));
    const positiveYears = Number(items.filter((it) => it.yearsDelta > 0).reduce((acc, it) => acc + it.yearsDelta, 0).toFixed(1));
    const negativeYears = Number(items.filter((it) => it.yearsDelta < 0).reduce((acc, it) => acc + Math.abs(it.yearsDelta), 0).toFixed(1));

    return {
      category: cat,
      label: categoryLabels[cat],
      yearsDelta,
      positiveYears,
      negativeYears,
      items,
    };
  });

  const totalGainedYears = Number(impacts.filter((it) => it.yearsDelta > 0).reduce((acc, it) => acc + it.yearsDelta, 0).toFixed(1));
  const totalLostYears = Number(impacts.filter((it) => it.yearsDelta < 0).reduce((acc, it) => acc + Math.abs(it.yearsDelta), 0).toFixed(1));
  // Exact arithmetic consistency: netDelta is strictly (totalGained - totalLost)
  const netDelta = Number((totalGainedYears - totalLostYears).toFixed(1));

  // Sub-linear actuarial dampening (diminishing returns for stacked independent factors)
  const effectiveGained = totalGainedYears <= 15
    ? totalGainedYears
    : 15 + Math.sqrt(totalGainedYears - 15) * 3.6;

  const effectiveLost = totalLostYears <= 20
    ? totalLostYears
    : 20 + Math.sqrt(totalLostYears - 20) * 2.8;

  const effectiveDelta = effectiveGained - effectiveLost;

  // Projected Lifespan: Actuarial baseline + Effective Delta (bounded between age + 1 and 115)
  const rawProjected = actuarialBaseline + effectiveDelta;
  const projectedLifespan = Number(Math.max(profile.age + 1, Math.min(115, rawProjected)).toFixed(1));

  // Biological Age calculation:
  // Reflects biological wear vs chronological age based on healthspan acceleration/deceleration.
  const bioAgeDiff = -(effectiveDelta * 0.45);
  const biologicalAge = Number(Math.max(18, Math.min(105, profile.age + bioAgeDiff)).toFixed(1));

  // Confidence Interval (+/- 3.5 to 5.0 years based on age)
  const margin = Number((3.5 + Math.max(0, (profile.age - 40) * 0.03)).toFixed(1));
  const confidenceRange: [number, number] = [
    Number(Math.max(profile.age, projectedLifespan - margin).toFixed(1)),
    Number((projectedLifespan + margin).toFixed(1)),
  ];

  // Longevity Grade
  let riskGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'B';
  if (projectedLifespan >= 98) riskGrade = 'A+';
  else if (projectedLifespan >= 90) riskGrade = 'A';
  else if (projectedLifespan >= 82) riskGrade = 'B';
  else if (projectedLifespan >= 76) riskGrade = 'C';
  else if (projectedLifespan >= 70) riskGrade = 'D';
  else riskGrade = 'F';

  return {
    projectedLifespan,
    biologicalAge,
    chronologicalAge: profile.age,
    actuarialBaseline,
    totalGainedYears,
    totalLostYears,
    netDelta,
    confidenceRange,
    categorySummaries,
    allImpacts: impacts,
    riskGrade,
  };
}
