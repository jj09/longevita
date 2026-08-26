import { describe, it, expect } from 'vitest';
import {
  getBMICategoryInfo,
  getSystolicBPInfo,
  getDiastolicBPInfo,
  getRestingHRInfo,
  getHydrationInfo,
  getAgeCategoryInfo,
} from '../sliderHelpers';

describe('sliderHelpers', () => {
  it('correctly classifies BMI across clinical categories', () => {
    expect(getBMICategoryInfo(17.5).category).toBe('Underweight');
    expect(getBMICategoryInfo(22.0).category).toBe('Optimal');
    expect(getBMICategoryInfo(24.9).category).toBe('Optimal');
    expect(getBMICategoryInfo(25.4).category).toBe('Overweight');
    expect(getBMICategoryInfo(29.9).category).toBe('Overweight');
    expect(getBMICategoryInfo(31.5).category).toBe('Obesity Class I');
    expect(getBMICategoryInfo(38.0).category).toBe('Severe Obesity');
  });

  it('correctly classifies Systolic Blood Pressure', () => {
    expect(getSystolicBPInfo(115).category).toBe('Optimal');
    expect(getSystolicBPInfo(124).category).toBe('Elevated');
    expect(getSystolicBPInfo(134).category).toBe('Stage 1');
    expect(getSystolicBPInfo(145).category).toBe('Stage 2');
    expect(getSystolicBPInfo(165).category).toBe('Severe / Crisis');
  });

  it('correctly classifies Diastolic Blood Pressure', () => {
    expect(getDiastolicBPInfo(75).category).toBe('Optimal');
    expect(getDiastolicBPInfo(85).category).toBe('Stage 1');
    expect(getDiastolicBPInfo(95).category).toBe('Stage 2');
    expect(getDiastolicBPInfo(105).category).toBe('Severe');
  });

  it('correctly classifies Resting Heart Rate', () => {
    expect(getRestingHRInfo(52).category).toBe('Athletic');
    expect(getRestingHRInfo(65).category).toBe('Good');
    expect(getRestingHRInfo(75).category).toBe('Normal');
    expect(getRestingHRInfo(85).category).toBe('Elevated');
    expect(getRestingHRInfo(95).category).toBe('High');
  });

  it('correctly classifies Daily Hydration', () => {
    expect(getHydrationInfo(8).category).toBe('Optimal');
    expect(getHydrationInfo(4).category).toBe('Suboptimal');
  });

  it('correctly classifies Chronological Age Stages', () => {
    expect(getAgeCategoryInfo(25).category).toBe('Young Adult');
    expect(getAgeCategoryInfo(46).category).toBe('Prime Midlife');
    expect(getAgeCategoryInfo(62).category).toBe('Mature Adult');
    expect(getAgeCategoryInfo(80).category).toBe('Senior Horizon');
  });
});
