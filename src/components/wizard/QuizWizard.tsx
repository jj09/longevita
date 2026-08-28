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

interface QuizWizardProps {
  initialProfile: UserProfile;
  onComplete: (completedProfile: UserProfile) => void;
  onExit: () => void;
}

interface QuestionConfig {
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
  options?: Array<{
    value: any;
    label: string;
    description: string;
    icon?: string;
  }>;
}

export const QuizWizard: React.FC<QuizWizardProps> = ({
  initialProfile,
  onComplete,
  onExit,
}) => {
  const [answers, setAnswers] = useState<Partial<UserProfile>>({
    age: initialProfile.age,
    systolicBP: initialProfile.systolicBP,
    bmi: initialProfile.bmi,
    restingHeartRate: initialProfile.restingHeartRate,
  });
  const [completedProfile, setCompletedProfile] = useState<UserProfile | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const questions: QuestionConfig[] = [
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
        { value: 'partnered_married', label: 'Married / Partnered', description: 'Strong emotional co-regulation & crisis support (+2.5 yrs)' },
        { value: 'single', label: 'Single', description: 'Neutral population baseline' },
        { value: 'separated_divorced_widowed', label: 'Divorced / Widowed', description: 'Associated with elevated bereavement stress' },
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
    // 5. Air Quality
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
    // 6. Blood Pressure
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
    // 7. Fasting Glucose / Diabetes
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
    // 8. Lipids & Cholesterol
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
    // 9. BMI / Body Composition
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
    // 10. Resting Heart Rate
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
    // 11. Aerobic Cardio
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
    // 12. Strength Training
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
    // 13. Daily Steps
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
    // 14. Sitting Hours
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
    // 15. Dietary Pattern
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
    // 16. Red Meat
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
    // 17. Fruits, Veggies & Fiber
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
    // 18. Ultra-Processed Foods
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
    // 19. Polyphenols
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
    // 20. Smoking & Tobacco
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
    // 21. Alcohol
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
    // 22. Sleep Duration & Quality
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
    // 23. Dental Flossing (Dr. Perls Living to 100 Factor!)
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
    // 24. Stress & Mindset
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
    // 25. Social Connection (Blue Zone Moai)
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
    // 26. Sexual Intimacy & Physical Connection
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
        ...answers,
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
                          setAnswers((prev) => ({ ...prev, [currentQ.field]: next }));
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
                          setAnswers((prev) => ({ ...prev, [currentQ.field]: next }));
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-950 border border-slate-700/80 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-slate-600 active:scale-90 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all select-none shadow-md"
                        title="Increase value"
                      >
                        +
                      </button>
                    </div>

                    {/* Dynamic Category Pill for BMI, Systolic BP, Resting HR, Age */}
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
                  </div>
                </div>

                <input
                  type="range"
                  min={currentQ.sliderConfig.min}
                  max={currentQ.sliderConfig.max}
                  step={currentQ.sliderConfig.step}
                  value={((answers[currentQ.field] ?? initialProfile[currentQ.field]) as number)}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [currentQ.field]: Number(e.target.value) }))
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
