export interface CategoryInfo {
  label: string;
  category: string;
  badgeClass: string;
}

export function getBMICategoryInfo(bmi: number): CategoryInfo {
  if (bmi < 18.5) {
    return {
      label: 'Underweight (<18.5)',
      category: 'Underweight',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    };
  }
  if (bmi <= 24.9) {
    return {
      label: 'Optimal (18.5–24.9)',
      category: 'Optimal',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    };
  }
  if (bmi <= 29.9) {
    return {
      label: 'Overweight (25–29.9)',
      category: 'Overweight',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    };
  }
  if (bmi <= 34.9) {
    return {
      label: 'Obese Class I (30–34.9)',
      category: 'Obesity Class I',
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    };
  }
  return {
    label: 'Severe Obesity (35+)',
    category: 'Severe Obesity',
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  };
}

export function getSystolicBPInfo(systolic: number): CategoryInfo {
  if (systolic < 120) {
    return {
      label: 'Optimal (<120 mmHg)',
      category: 'Optimal',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    };
  }
  if (systolic <= 129) {
    return {
      label: 'Elevated (120–129 mmHg)',
      category: 'Elevated',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    };
  }
  if (systolic <= 139) {
    return {
      label: 'Stage 1 (130–139 mmHg)',
      category: 'Stage 1',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    };
  }
  if (systolic <= 159) {
    return {
      label: 'Stage 2 (140–159 mmHg)',
      category: 'Stage 2',
      badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    };
  }
  return {
    label: 'Severe (160+ mmHg)',
    category: 'Severe / Crisis',
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  };
}

export function getDiastolicBPInfo(diastolic: number): CategoryInfo {
  if (diastolic < 80) {
    return {
      label: 'Optimal (<80 mmHg)',
      category: 'Optimal',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    };
  }
  if (diastolic <= 89) {
    return {
      label: 'Stage 1 (80–89 mmHg)',
      category: 'Stage 1',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    };
  }
  if (diastolic <= 99) {
    return {
      label: 'Stage 2 (90–99 mmHg)',
      category: 'Stage 2',
      badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    };
  }
  return {
    label: 'Severe (100+ mmHg)',
    category: 'Severe',
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  };
}

export function getRestingHRInfo(hr: number): CategoryInfo {
  if (hr < 60) {
    return {
      label: 'Athletic / Excellent (<60 bpm)',
      category: 'Athletic',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    };
  }
  if (hr <= 70) {
    return {
      label: 'Good (60–70 bpm)',
      category: 'Good',
      badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    };
  }
  if (hr <= 80) {
    return {
      label: 'Normal (71–80 bpm)',
      category: 'Normal',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    };
  }
  if (hr <= 90) {
    return {
      label: 'Elevated (81–90 bpm)',
      category: 'Elevated',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    };
  }
  return {
    label: 'High (>90 bpm)',
    category: 'High',
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  };
}

export function getHydrationInfo(glasses: number): CategoryInfo {
  if (glasses >= 6) {
    return {
      label: 'Optimal (6–8+ glasses)',
      category: 'Optimal',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    };
  }
  return {
    label: 'Suboptimal (<6 glasses)',
    category: 'Suboptimal',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  };
}

export function getAgeCategoryInfo(age: number): CategoryInfo {
  if (age < 35) {
    return {
      label: 'Young Adult (18–34)',
      category: 'Young Adult',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    };
  }
  if (age < 55) {
    return {
      label: 'Prime Midlife (35–54)',
      category: 'Prime Midlife',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    };
  }
  if (age < 75) {
    return {
      label: 'Mature Adult (55–74)',
      category: 'Mature Adult',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    };
  }
  return {
    label: 'Senior Horizon (75+)',
    category: 'Senior Horizon',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  };
}
