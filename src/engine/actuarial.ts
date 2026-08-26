import { BiologicalSex } from './types';

// Actuarial Period Life Table data points based on US Social Security Administration & CDC Data
// Mapping Age -> Total Expected Lifespan (Age + Remaining Life Expectancy)
interface ActuarialPoint {
  age: number;
  maleExpected: number;
  femaleExpected: number;
}

const ACTUARIAL_TABLE: ActuarialPoint[] = [
  { age: 0, maleExpected: 76.3, femaleExpected: 81.4 },
  { age: 10, maleExpected: 76.8, femaleExpected: 81.7 },
  { age: 20, maleExpected: 77.2, femaleExpected: 81.9 },
  { age: 25, maleExpected: 77.5, femaleExpected: 82.1 },
  { age: 30, maleExpected: 77.9, femaleExpected: 82.3 },
  { age: 35, maleExpected: 78.3, femaleExpected: 82.6 },
  { age: 40, maleExpected: 78.8, femaleExpected: 83.0 },
  { age: 45, maleExpected: 79.4, femaleExpected: 83.4 },
  { age: 50, maleExpected: 80.2, femaleExpected: 84.0 },
  { age: 55, maleExpected: 81.1, femaleExpected: 84.7 },
  { age: 60, maleExpected: 82.3, femaleExpected: 85.6 },
  { age: 65, maleExpected: 83.8, femaleExpected: 86.8 },
  { age: 70, maleExpected: 85.5, femaleExpected: 88.1 },
  { age: 75, maleExpected: 87.4, femaleExpected: 89.7 },
  { age: 80, maleExpected: 89.8, femaleExpected: 91.5 },
  { age: 85, maleExpected: 92.6, femaleExpected: 93.8 },
  { age: 90, maleExpected: 95.7, femaleExpected: 96.4 },
  { age: 95, maleExpected: 99.1, femaleExpected: 99.6 },
  { age: 100, maleExpected: 102.7, femaleExpected: 103.1 },
  { age: 105, maleExpected: 106.8, femaleExpected: 107.0 },
];

/**
 * Calculates actuarial baseline life expectancy based on biological sex and current age.
 * Uses piecewise linear interpolation across SSA life tables.
 */
export function getActuarialBaseline(age: number, sex: BiologicalSex): number {
  const clampedAge = Math.max(0, Math.min(105, age));

  // Find surrounding bracket
  for (let i = 0; i < ACTUARIAL_TABLE.length - 1; i++) {
    const p1 = ACTUARIAL_TABLE[i];
    const p2 = ACTUARIAL_TABLE[i + 1];

    if (clampedAge >= p1.age && clampedAge <= p2.age) {
      const ratio = (clampedAge - p1.age) / (p2.age - p1.age);
      const val1 = sex === 'female' ? p1.femaleExpected : p1.maleExpected;
      const val2 = sex === 'female' ? p2.femaleExpected : p2.maleExpected;
      const interpolated = val1 + ratio * (val2 - val1);
      return Number(interpolated.toFixed(1));
    }
  }

  // Fallback for > 105
  return sex === 'female' ? 107.5 : 107.0;
}
