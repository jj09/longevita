import { UserProfile } from './types';

export interface QuestionOption {
  value: any;
  label: string;
  description: string;
  icon?: string;
}

export interface QuestionConfig {
  id: string;
  pillar: 'demographics' | 'biometrics' | 'fitness' | 'nutrition' | 'lifestyle';
  pillarLabel: string;
  title: string;
  subtitle: string;
  type: 'options' | 'slider' | 'bp_slider' | 'toggle_group';
  field: keyof UserProfile;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    unit: string;
    labels: { [key: number]: string };
  };
  options?: QuestionOption[];
}

export const QUIZ_QUESTIONS: QuestionConfig[] = [
  // 1. Age
  {
    id: 'age',
    pillar: 'demographics',
    pillarLabel: 'Demographics & Genetics',
    title: 'What is your current chronological age?',
    subtitle: 'Actuarial life expectancy baseline adjusts dynamically with age.',
    type: 'slider',
    field: 'age',
    sliderConfig: {
      min: 18,
      max: 95,
      step: 1,
      unit: 'years old',
      labels: { 18: '18y', 35: '35y', 50: '50y', 70: '70y', 95: '95y' },
    },
  },
  // 2. Biological Sex
  {
    id: 'sex',
    pillar: 'demographics',
    pillarLabel: 'Demographics & Genetics',
    title: 'What is your biological sex?',
    subtitle: 'Biological sex provides the foundational actuarial survival curve.',
    type: 'options',
    field: 'sex',
    options: [
      { value: 'male', label: 'Male', description: 'Actuarial base ~78.0 years' },
      { value: 'female', label: 'Female', description: 'Actuarial base ~82.5 years' },
    ],
  },
  // 3. Relationship Status
  {
    id: 'relationshipStatus',
    pillar: 'demographics',
    pillarLabel: 'Demographics & Genetics',
    title: 'What is your relationship / partnership status?',
    subtitle: 'Long-term partnership provides emotional resilience and mutual care.',
    type: 'options',
    field: 'relationshipStatus',
    options: [
      { value: 'partnered_married', label: 'Married / Partnered', description: 'Cohabitation support, mutual care & crisis intervention (+2.0 yrs)' },
      { value: 'single', label: 'Single', description: 'Neutral population baseline' },
      { value: 'separated_divorced_widowed', label: 'Divorced / Widowed', description: 'Associated with elevated bereavement stress (-1.5 yrs)' },
    ],
  },
  // 4. Early Family Disease History
  {
    id: 'earlyFamilyDisease',
    pillar: 'demographics',
    pillarLabel: 'Demographics & Genetics',
    title: 'Early Family Disease History',
    subtitle: 'Did any biological parent or sibling pass away from cardiovascular disease or cancer before age 60?',
    type: 'options',
    field: 'earlyFamilyDisease',
    options: [
      { value: 'none', label: 'No Early CVD or Cancer (<60)', description: 'No biological parents or siblings passed away from premature illness' },
      { value: 'early_cvd', label: 'Early Heart Disease or Stroke (<60)', description: 'A biological parent or sibling had fatal heart disease or stroke before 60 (-2.5 yrs)' },
      { value: 'early_cancer', label: 'Early Cancer (<60)', description: 'A biological parent or sibling passed away from cancer before 60 (-2.5 yrs)' },
      { value: 'multiple_early', label: 'Multiple Early Relatives (<60)', description: 'Two or more first-degree relatives passed away before 60 (-4.0 yrs)' },
    ],
  },
  // 5. Exceptional Family Longevity History
  {
    id: 'familyLongevity',
    pillar: 'demographics',
    pillarLabel: 'Demographics & Genetics',
    title: 'Exceptional Family Longevity Genetics',
    subtitle: 'What is the oldest age reached (or currently reached) by any biological parent or grandparent?',
    type: 'options',
    field: 'familyLongevity',
    options: [
      { value: 'centenarian_100plus', label: 'Centenarian (100+)', description: 'At least one parent or grandparent reached 100 or beyond (+5.0 yrs)' },
      { value: 'relative_90_99', label: 'At Least One Reached 90–99', description: 'At least one parent or grandparent reached 90–99 (+3.5 yrs)' },
      { value: 'relative_85_89', label: 'At Least One Reached 85–89', description: 'At least one parent or grandparent reached 85–89 (+1.5 yrs)' },
      { value: 'average', label: 'Typical Lifespans (Under 85)', description: 'Parents and grandparents lived average lifespans under 85 (0 yrs baseline)' },
    ],
  },
  // 6. Air Quality
  {
    id: 'airQuality',
    pillar: 'demographics',
    pillarLabel: 'Demographics & Genetics',
    title: 'What is your primary living environment & air quality?',
    subtitle: 'Fine particulate matter (PM2.5) drives vascular inflammation.',
    type: 'options',
    field: 'airQuality',
    options: [
      { value: 'clean_rural', label: 'Clean Rural / Mountain / Coastal', description: 'Low particulate exposure (+1.0 yr)' },
      { value: 'moderate_suburban', label: 'Moderate Suburban Area', description: 'Standard air quality' },
      { value: 'polluted_urban', label: 'High Urban Smog / PM2.5', description: 'Chronic urban air pollution exposure' },
    ],
  },
  // 7. Blood Pressure
  {
    id: 'systolicBP',
    pillar: 'biometrics',
    pillarLabel: 'Biometrics & Clinical',
    title: 'What is your typical Systolic Blood Pressure?',
    subtitle: 'Optimal systolic is <120 mmHg. (Diastolic will be estimated proportionally)',
    type: 'slider',
    field: 'systolicBP',
    sliderConfig: {
      min: 100,
      max: 175,
      step: 1,
      unit: 'mmHg',
      labels: { 100: '100 (Optimal)', 120: '120 (Normal)', 135: '135 (Stage 1)', 150: '150 (Stage 2)', 175: '175+' },
    },
  },
  // 8. Fasting Glucose / Diabetes
  {
    id: 'bloodSugar',
    pillar: 'biometrics',
    pillarLabel: 'Biometrics & Clinical',
    title: 'What is your fasting blood glucose / diabetes status?',
    subtitle: 'Glycemic regulation prevents Advanced Glycation End-products (AGEs).',
    type: 'options',
    field: 'bloodSugar',
    options: [
      { value: 'normal', label: 'Normal (<100 mg/dL)', description: 'Optimal insulin sensitivity (+1.0 yr)' },
      { value: 'prediabetes', label: 'Prediabetes (100-125 mg/dL)', description: 'Early metabolic resistance' },
      { value: 'type2_controlled', label: 'Type 2 Diabetes (Managed/Medicated)', description: 'Controlled HbA1c < 7.0%' },
      { value: 'type2_uncontrolled', label: 'Type 2 Diabetes (Uncontrolled)', description: 'High HbA1c >= 8.0%' },
    ],
  },
  // 9. Lipids & Cholesterol
  {
    id: 'lipidStatus',
    pillar: 'biometrics',
    pillarLabel: 'Biometrics & Clinical',
    title: 'What is your cholesterol & lipid panel status (LDL / ApoB)?',
    subtitle: 'From your annual physical exam or Function Health test. If your doctor said your cholesterol is normal, choose Optimal.',
    type: 'options',
    field: 'lipidStatus',
    options: [
      {
        value: 'optimal',
        label: 'Optimal',
        description: 'LDL < 100 mg/dL or ApoB < 70 mg/dL (+1.2 yrs)',
      },
      {
        value: 'moderate_high',
        label: 'Borderline / Moderate',
        description: 'LDL 100–159 mg/dL or ApoB 70–100 (-1.0 yr)',
      },
      {
        value: 'high_uncontrolled',
        label: 'High Unmanaged',
        description: 'LDL ≥ 160 mg/dL or ApoB > 100 (-3.0 yrs)',
      },
      {
        value: 'high_managed_statin',
        label: 'Medication Managed',
        description: 'Elevated baseline but actively controlled on lipid-lowering medication (+0.2 yrs)',
      },
    ],
  },
  // 10. BMI / Body Composition
  {
    id: 'bmi',
    pillar: 'biometrics',
    pillarLabel: 'Biometrics & Clinical',
    title: 'What is your Body Mass Index (BMI)?',
    subtitle: 'Healthy longevity range is typically 18.5 to 24.9.',
    type: 'slider',
    field: 'bmi',
    sliderConfig: {
      min: 16.0,
      max: 42.0,
      step: 0.1,
      unit: 'BMI',
      labels: { 18.5: '18.5 Normal', 22.0: '22 Optimal', 25.0: '25.0 Overweight', 30.0: '30.0 Obese' },
    },
  },
  // 11. Resting Heart Rate
  {
    id: 'restingHeartRate',
    pillar: 'biometrics',
    pillarLabel: 'Biometrics & Clinical',
    title: 'What is your average Resting Heart Rate?',
    subtitle: 'Lower resting heart rate indicates strong stroke volume and vagal tone.',
    type: 'slider',
    field: 'restingHeartRate',
    sliderConfig: {
      min: 45,
      max: 100,
      step: 1,
      unit: 'bpm',
      labels: { 45: '<50 Athlete', 60: '60 Great', 75: '75 Average', 90: '90+ High' },
    },
  },
  // 12. Aerobic Cardio
  {
    id: 'cardio',
    pillar: 'fitness',
    pillarLabel: 'Fitness & Movement',
    title: 'How much aerobic cardio or brisk exercise do you get weekly?',
    subtitle: 'Includes brisk walking (3+ mph where heart rate is elevated), cycling, jogging, swimming, or elliptical.',
    type: 'options',
    field: 'cardio',
    options: [
      { value: 'high', label: 'Optimal / High (300+ min/wk)', description: '~45–60 min/day of brisk walking, cycling, or jogging (+4.0 yrs)' },
      { value: 'moderate', label: 'Moderate (150 min/wk)', description: '~30 min/day, 5 days/wk of brisk exercise or cardio (+2.5 yrs)' },
      { value: 'light', label: 'Light (<60 min/wk)', description: 'Irregular or occasional cardio sessions' },
      { value: 'sedentary', label: 'Sedentary (0 min/wk)', description: 'No intentional brisk aerobic exercise (-3.5 yrs)' },
    ],
  },
  // 13. Strength Training
  {
    id: 'strengthTraining',
    pillar: 'fitness',
    pillarLabel: 'Fitness & Movement',
    title: 'How often do you perform progressive strength / resistance training?',
    subtitle: 'Preserves lean muscle mass (anti-sarcopenia) and prevents fatal late-life falls.',
    type: 'options',
    field: 'strengthTraining',
    options: [
      { value: 'optimal', label: 'Optimal (3+ days/wk)', description: 'Compound resistance lifts & calisthenics (+2.2 yrs)' },
      { value: 'occasional', label: 'Occasional (1-2 days/wk)', description: 'Basic muscle maintenance (+1.0 yr)' },
      { value: 'none', label: 'None (0 days/wk)', description: 'Accelerated sarcopenia risk' },
    ],
  },
  // 14. Daily Steps
  {
    id: 'dailySteps',
    pillar: 'fitness',
    pillarLabel: 'Fitness & Movement',
    title: 'What is your average total daily step count?',
    subtitle: 'All daily walking, errands, leisure strolls, and movement tracked on your phone/watch.',
    type: 'options',
    field: 'dailySteps',
    options: [
      { value: 'over_10k', label: '10,000+ steps / day', description: 'Active everyday movement (+2.5 yrs)' },
      { value: '8k_to_10k', label: '8,000 - 10,000 steps / day', description: 'Optimal longevity threshold (+1.5 yrs)' },
      { value: '4k_to_7k', label: '4,000 - 7,000 steps / day', description: 'Moderate daily movement baseline' },
      { value: 'under_4k', label: '< 4,000 steps / day', description: 'Sedentary day-to-day lifestyle' },
    ],
  },
  // 15. Sitting Hours
  {
    id: 'sittingHours',
    pillar: 'fitness',
    pillarLabel: 'Fitness & Movement',
    title: 'How many hours per day do you spend seated (desk/couch)?',
    subtitle: 'Prolonged uninterrupted sitting suppresses lipoprotein lipase activity.',
    type: 'options',
    field: 'sittingHours',
    options: [
      { value: 'under_4h', label: '< 4 hours/day', description: 'Active on feet / standing desk (+0.8 yrs)' },
      { value: '4h_to_8h', label: '4 - 8 hours/day', description: 'Typical desk work' },
      { value: 'over_8h', label: '8+ hours/day', description: 'High sedentary desk time' },
    ],
  },
  // 16. Dietary Pattern
  {
    id: 'dietPattern',
    pillar: 'nutrition',
    pillarLabel: 'Nutrition & Blue Zone Diet',
    title: 'Which pattern best describes your daily nutrition?',
    subtitle: 'Mediterranean/Blue Zone diets emphasize whole plants, olive oil, legumes, and nuts.',
    type: 'options',
    field: 'dietPattern',
    options: [
      { value: 'mediterranean_bluezone', label: 'Mediterranean / Blue Zone Diet', description: 'EVOO, legumes, diverse plants, nuts & wild fish (+3.5 yrs)' },
      { value: 'moderate_balanced', label: 'Balanced Whole Foods', description: 'Home-cooked varied meals (+1.0 yr)' },
      { value: 'standard_processed', label: 'Standard Processed / Fast Food', description: 'High refined carbohydrates and seed oils' },
    ],
  },
  // 17. Red Meat
  {
    id: 'redMeat',
    pillar: 'nutrition',
    pillarLabel: 'Nutrition & Blue Zone Diet',
    title: 'How often do you consume red and processed meats (bacon, sausage, beef)?',
    subtitle: 'High processed meat is classified as a Group 1 carcinogen by WHO.',
    type: 'options',
    field: 'redMeat',
    options: [
      { value: 'rare_none', label: 'Rare / None (Plant & Wild Fish)', description: 'Blue Zone style protein intake (+1.5 yrs)' },
      { value: 'weekly_moderate', label: 'Weekly (1-2 times/week)', description: 'Moderate consumption' },
      { value: 'frequent_daily', label: 'Daily / Frequent', description: 'High processed meat intake' },
    ],
  },
  // 18. Fruits, Veggies & Fiber
  {
    id: 'veggieFruitServings',
    pillar: 'nutrition',
    pillarLabel: 'Nutrition & Blue Zone Diet',
    title: 'How many daily servings of vegetables, fruits, and legumes do you eat?',
    subtitle: 'Dietary fiber feeds microbiome species producing short-chain fatty acids.',
    type: 'options',
    field: 'veggieFruitServings',
    options: [
      { value: '5_plus', label: '5+ servings per day', description: 'Rich microbiome diversity (+2.0 yrs)' },
      { value: '2_to_4', label: '2 - 4 servings per day', description: 'Moderate daily intake (+0.5 yrs)' },
      { value: 'under_2', label: '< 2 servings per day', description: 'Suboptimal fiber' },
    ],
  },
  // 19. Ultra-Processed Foods
  {
    id: 'ultraProcessed',
    pillar: 'nutrition',
    pillarLabel: 'Nutrition & Blue Zone Diet',
    title: 'How often do you consume ultra-processed packaged foods & sugary sodas?',
    subtitle: 'Packaged foods spike postprandial insulin and liver fat accumulation.',
    type: 'options',
    field: 'ultraProcessed',
    options: [
      { value: 'minimal_rare', label: 'Minimal / Rare Indulgence', description: 'Clean whole nutrition (+1.5 yrs)' },
      { value: 'occasional', label: 'Occasional (1-2x/week)', description: 'Moderate indulgences' },
      { value: 'daily_frequent', label: 'Daily / Frequent', description: 'High daily packaged snacks & sodas' },
    ],
  },
  // 20. Polyphenols
  {
    id: 'polyphenols',
    pillar: 'nutrition',
    pillarLabel: 'Nutrition & Blue Zone Diet',
    title: 'Do you regularly consume green tea, matcha, coffee, or dark berries?',
    subtitle: 'EGCG catechins and anthocyanins protect cellular DNA from oxidative bursts.',
    type: 'options',
    field: 'polyphenols',
    options: [
      { value: 'high_green_tea_berries', label: 'High (Green Tea / Matcha / Berries)', description: '2+ cups green tea + fresh berries daily (+1.2 yrs)' },
      { value: 'moderate_coffee_tea', label: 'Moderate Coffee or Tea', description: '1-2 cups daily (+0.6 yrs)' },
      { value: 'none', label: 'None', description: 'Zero regular polyphenol intake' },
    ],
  },
  // 21. Smoking & Tobacco
  {
    id: 'smoking',
    pillar: 'lifestyle',
    pillarLabel: 'Lifestyle, Sleep & Mind',
    title: 'What is your tobacco smoking / vaping status?',
    subtitle: '#1 preventable driver of vascular disease, DNA damage, and premature mortality.',
    type: 'options',
    field: 'smoking',
    options: [
      { value: 'never', label: 'Never Smoked', description: 'Clean arterial endothelial baseline (+3.0 yrs)' },
      { value: 'former_long', label: 'Former Smoker (10+ yrs quit)', description: 'Arterial risk largely normalized (+2.0 yrs)' },
      { value: 'former_recent', label: 'Former Smoker (<5 yrs quit)', description: 'Actively recovering (+0.5 yrs)' },
      { value: 'current_light', label: 'Current Light Smoker / Vaping', description: '<10 cigs/day or regular vape' },
      { value: 'current_heavy', label: 'Current Heavy Smoker (1+ pack/day)', description: 'Severe vascular damage (-9.5 yrs)' },
    ],
  },
  // 22. Alcohol
  {
    id: 'alcohol',
    pillar: 'lifestyle',
    pillarLabel: 'Lifestyle, Sleep & Mind',
    title: 'How much alcohol do you consume on average?',
    subtitle: 'Heavy alcohol degrades sleep architecture and promotes hepatic steatosis.',
    type: 'options',
    field: 'alcohol',
    options: [
      { value: 'none', label: 'Zero Alcohol (Non-drinker)', description: 'Zero hepatic or carcinogen burden (+0.5 yrs)' },
      { value: 'light_moderate', label: 'Light / Moderate (1-7 drinks/wk)', description: 'Low mortality risk' },
      { value: 'heavy_binge', label: 'Heavy / Binge (14+ drinks/wk)', description: 'Cardiomyopathy & liver strain (-5.0 yrs)' },
    ],
  },
  // 23. Sleep Duration & Quality
  {
    id: 'sleep',
    pillar: 'lifestyle',
    pillarLabel: 'Lifestyle, Sleep & Mind',
    title: 'How is your typical sleep duration and quality?',
    subtitle: '7-8 hours of deep sleep enables glymphatic clearance of brain amyloid plaques.',
    type: 'options',
    field: 'sleep',
    options: [
      { value: '7_to_8h_optimal', label: '7 - 8 Hours Optimal & Restful', description: 'Full circadian hormonal restoration (+2.2 yrs)' },
      { value: '6_to_7h', label: '6 - 7 Hours', description: 'Average sleep duration' },
      { value: 'under_6h', label: '< 6 Hours / Chronic Short Sleep', description: 'Elevated morning cortisol & vascular risk' },
      { value: 'chronic_apnea_insomnia', label: 'Sleep Apnea / Severe Insomnia', description: 'Nocturnal hypoxia & disrupted REM' },
    ],
  },
  // 24. Dental Flossing (Dr. Perls Living to 100 Factor!)
  {
    id: 'flossing',
    pillar: 'lifestyle',
    pillarLabel: 'Lifestyle, Sleep & Mind',
    title: 'Do you floss your teeth daily?',
    subtitle: 'Removes subgingival bacteria (P. gingivalis) preventing endotoxemia & coronary plaque.',
    type: 'options',
    field: 'flossing',
    options: [
      { value: 'daily_flossing', label: 'Yes, Daily Flossing', description: 'Famous #1 Micro-Habit for longevity (+1.2 yrs)' },
      { value: 'occasional', label: 'Occasional (1-3x/week)', description: 'Partial periodontal protection' },
      { value: 'rarely_never', label: 'Rarely / Never', description: 'Chronic systemic inflammatory penalty' },
    ],
  },
  // 25. Stress & Mindset
  {
    id: 'stress',
    pillar: 'lifestyle',
    pillarLabel: 'Lifestyle, Sleep & Mind',
    title: 'How do you cope with daily stress and mental strain?',
    subtitle: 'Chronic unbuffered cortisol accelerates leukocyte telomere attrition.',
    type: 'options',
    field: 'stress',
    options: [
      { value: 'well_managed_mindful', label: 'Mindful & Resilient', description: 'Active meditation, nature, high vagal tone (+2.0 yrs)' },
      { value: 'moderate_daily', label: 'Moderate Daily Stress', description: 'Average everyday stress' },
      { value: 'severe_unmanaged', label: 'Severe / Chronic Unmanaged', description: 'Constant high cortisol and burnout' },
    ],
  },
  // 26. Social Connection (Blue Zone Moai)
  {
    id: 'socialConnection',
    pillar: 'lifestyle',
    pillarLabel: 'Lifestyle, Sleep & Mind',
    title: 'How strong is your social connection and community (Moai)?',
    subtitle: 'Loneliness has the mortality equivalence of smoking 15 cigarettes/day.',
    type: 'options',
    field: 'socialConnection',
    options: [
      { value: 'strong_connected', label: 'Strong & Deeply Connected', description: 'Close confidants & community ritual (+3.0 yrs)' },
      { value: 'moderate', label: 'Moderate Social Circle', description: 'Regular friends & family (+0.5 yrs)' },
      { value: 'isolated', label: 'Isolated / High Loneliness', description: 'Severe social isolation penalty' },
    ],
  },
  // 27. Sexual Intimacy & Physical Connection
  {
    id: 'intimacyFrequency',
    pillar: 'lifestyle',
    pillarLabel: 'Lifestyle, Sleep & Mind',
    title: 'What is your frequency of sexual intimacy & physical connection?',
    subtitle: 'Regular intimacy triggers oxytocin release, elevates salivary IgA immune defense, and suppresses chronic cortisol.',
    type: 'options',
    field: 'intimacyFrequency',
    options: [
      { value: 'weekly_optimal', label: 'Weekly Sweet Spot (1–2 times / week)', description: 'Peak IgA antibody defense, oxytocin surge, and cardiovascular benefit (+1.8 yrs)' },
      { value: 'frequent_active', label: 'Frequent (3+ times / week)', description: 'High intimate connection, lower cortisol, and vascular stimulation (+2.0 yrs)' },
      { value: 'monthly_occasional', label: 'Monthly / Occasional (1–3 times / month)', description: 'Moderate intimacy and periodic stress relief (+0.6 yrs)' },
      { value: 'rare_none', label: 'Infrequent / Inactive (< 1 time / month)', description: 'Baseline population level with low regular oxytocin release (0.0 yrs)' },
    ],
  },
];

export const TOTAL_QUIZ_QUESTIONS = QUIZ_QUESTIONS.length;
