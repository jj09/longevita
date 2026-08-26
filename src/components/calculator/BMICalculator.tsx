import React, { useState, useEffect } from 'react';
import { Calculator, Scale, Ruler, Users } from 'lucide-react';
import { getBMICategoryInfo } from './sliderHelpers';

interface BMICalculatorProps {
  currentBMI: number;
  currentSex: 'male' | 'female';
  onUpdateBMI: (bmi: number) => void;
  onUpdateSex?: (sex: 'male' | 'female') => void;
  isOpenDefault?: boolean;
}

export const BMICalculator: React.FC<BMICalculatorProps> = ({
  currentBMI,
  currentSex,
  onUpdateBMI,
  onUpdateSex,
  isOpenDefault = false,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [sex, setSex] = useState<'male' | 'female'>(currentSex);

  // Imperial state defaults (~5'10", ~165 lbs -> BMI 23.7)
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(10);
  const [weightLbs, setWeightLbs] = useState<number>(165);

  // Metric state defaults (178 cm, 75 kg -> BMI 23.7)
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(75);

  // Sync sex from parent if changed externally
  useEffect(() => {
    setSex(currentSex);
  }, [currentSex]);

  // Calculate BMI and update parent
  const calculateAndApplyBMI = (
    currentUnit: 'imperial' | 'metric',
    ft: number,
    inc: number,
    wLbs: number,
    hCm: number,
    wKg: number
  ) => {
    let calculated = 0;
    if (currentUnit === 'imperial') {
      const totalInches = ft * 12 + inc;
      if (totalInches > 0 && wLbs > 0) {
        calculated = (wLbs / (totalInches * totalInches)) * 703;
      }
    } else {
      if (hCm > 0 && wKg > 0) {
        const heightM = hCm / 100;
        calculated = wKg / (heightM * heightM);
      }
    }

    if (calculated >= 14 && calculated <= 55) {
      const rounded = Math.round(calculated * 10) / 10;
      onUpdateBMI(rounded);
    }
  };

  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    setUnit(newUnit);
    if (newUnit === 'metric') {
      // Convert imperial to metric
      const totalInches = feet * 12 + inches;
      const convertedCm = Math.round(totalInches * 2.54);
      const convertedKg = Math.round(weightLbs * 0.453592 * 10) / 10;
      setHeightCm(convertedCm);
      setWeightKg(convertedKg);
      calculateAndApplyBMI('metric', feet, inches, weightLbs, convertedCm, convertedKg);
    } else {
      // Convert metric to imperial
      const totalInches = heightCm / 2.54;
      const convertedFeet = Math.floor(totalInches / 12);
      const convertedInches = Math.round(totalInches % 12);
      const convertedLbs = Math.round(weightKg * 2.20462 * 10) / 10;
      setFeet(convertedFeet);
      setInches(convertedInches);
      setWeightLbs(convertedLbs);
      calculateAndApplyBMI('imperial', convertedFeet, convertedInches, convertedLbs, heightCm, weightKg);
    }
  };

  const handleSexChange = (newSex: 'male' | 'female') => {
    setSex(newSex);
    if (onUpdateSex) {
      onUpdateSex(newSex);
    }
  };

  const handleImperialChange = (newFeet: number, newInches: number, newLbs: number) => {
    setFeet(newFeet);
    setInches(newInches);
    setWeightLbs(newLbs);
    calculateAndApplyBMI('imperial', newFeet, newInches, newLbs, heightCm, weightKg);
  };

  const handleMetricChange = (newCm: number, newKg: number) => {
    setHeightCm(newCm);
    setWeightKg(newKg);
    calculateAndApplyBMI('metric', feet, inches, weightLbs, newCm, newKg);
  };

  const categoryInfo = getBMICategoryInfo(currentBMI);

  // Compute healthy weight range for current height
  const getHealthyWeightRange = () => {
    if (unit === 'imperial') {
      const totalInches = feet * 12 + inches;
      if (totalInches <= 0) return null;
      const minLbs = Math.round((18.5 * totalInches * totalInches) / 703);
      const maxLbs = Math.round((24.9 * totalInches * totalInches) / 703);
      return `${minLbs} – ${maxLbs} lbs`;
    } else {
      if (heightCm <= 0) return null;
      const heightM = heightCm / 100;
      const minKg = Math.round(18.5 * heightM * heightM * 10) / 10;
      const maxKg = Math.round(24.9 * heightM * heightM * 10) / 10;
      return `${minKg} – ${maxKg} kg`;
    }
  };

  const healthyWeight = getHealthyWeightRange();

  return (
    <div className="mt-3 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 transition-all">
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          <span>{isOpen ? 'Hide Height & Weight Calculator' : "Don't know your BMI? Calculate from Height & Weight"}</span>
        </button>

        {isOpen && (
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => handleUnitChange('imperial')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                unit === 'imperial'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Imperial (ft / lbs)
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('metric')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                unit === 'metric'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Metric (cm / kg)
            </button>
          </div>
        )}
      </div>

      {/* Expanded Calculator Form */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
          {/* Row 1: Gender Selection */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Biological Sex</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSexChange('male')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  sex === 'male'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                👨 Male
              </button>
              <button
                type="button"
                onClick={() => handleSexChange('female')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  sex === 'female'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                👩 Female
              </button>
            </div>
          </div>

          {/* Row 2: Height & Weight Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Height Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-emerald-400" />
                <span>Height</span>
              </label>

              {unit === 'imperial' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min={3}
                      max={7}
                      value={feet}
                      onChange={(e) =>
                        handleImperialChange(Number(e.target.value) || 0, inches, weightLbs)
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 pr-8"
                    />
                    <span className="absolute right-2.5 top-2.5 text-xs text-slate-500 font-semibold">
                      ft
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={inches}
                      onChange={(e) =>
                        handleImperialChange(feet, Number(e.target.value) || 0, weightLbs)
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 pr-8"
                    />
                    <span className="absolute right-2.5 top-2.5 text-xs text-slate-500 font-semibold">
                      in
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    min={90}
                    max={240}
                    value={heightCm}
                    onChange={(e) => handleMetricChange(Number(e.target.value) || 0, weightKg)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-semibold">
                    cm
                  </span>
                </div>
              )}
            </div>

            {/* Weight Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Weight</span>
              </label>

              {unit === 'imperial' ? (
                <div className="relative">
                  <input
                    type="number"
                    min={60}
                    max={500}
                    step={1}
                    value={weightLbs}
                    onChange={(e) =>
                      handleImperialChange(feet, inches, Number(e.target.value) || 0)
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-semibold">
                    lbs
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    min={30}
                    max={250}
                    step={0.5}
                    value={weightKg}
                    onChange={(e) => handleMetricChange(heightCm, Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500 pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-semibold">
                    kg
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Calculation Result Banner */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Calculated BMI
                </div>
                <div className="text-xl font-black text-emerald-400">
                  {currentBMI.toFixed(1)}
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${categoryInfo.badgeClass}`}>
                {categoryInfo.category}
              </span>
            </div>

            {healthyWeight && (
              <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                <span>Healthy weight range: </span>
                <strong className="text-emerald-300">{healthyWeight}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
