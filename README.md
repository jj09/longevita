# 🧬 Longevita

> **Live Lifespan Calculator & Bang-for-the-Buck Longevity ROI Optimizer**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38b2ac.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-729B1B.svg?logo=vitest)](https://vitest.dev/)

Longevita is an evidence-based longevity web application modeled after the scientific research of the **New England Centenarian Study** (Dr. Thomas Perls), **CDC/SSA Actuarial Period Life Tables**, and **Blue Zone demographic studies**. 

Unlike static questionnaires, Longevita enables **real-time live parameter tweaking** and features an intelligent **"Bang for Your Buck" (ROI) recommendation engine** that identifies which lifestyle interventions yield the highest life extension for the least behavioral friction.

---

## ✨ Key Features

### 1. ⚡ Live Parameter Tweaking & Real-Time Gauge
- **Zero-Latency Adjustments**: Sliders, step counters, and segmented pills across 5 core pillars instantly update your projected life expectancy and biological age.
- **Dynamic Radial SVG Gauge**: Animated speedometer dial with longevity grade (`A+` to `F`), confidence intervals (90% CI), and milestone celebration confetti.
- **Biological Age vs. Calendar Age**: Computes biological aging velocity and net life years gained/lost relative to actuarial baselines.
- **Side-by-Side What-If Sandbox**: Compare your saved baseline against modified experimental parameters in a diff drawer.

### 2. 🔥 "Bang for Your Buck" Longevity ROI Optimizer
- **ROI Formula**: Computes potential lifespan gain ($\Delta$ Years) divided by behavioral friction/effort ($1$ to $5$ scale):
  $$\text{Bang-for-the-Buck Index} = \left(\frac{\Delta \text{Years Gained}}{\text{Effort Score}}\right) \times 10$$
- **Ranked Leaderboard**: Filter by *Top ROI*, *Micro-Wins* (Effort 1-2 like daily flossing or 20m walks), *Max Years* (quitting smoking, Zone 2 cardio), *Fitness*, and *Diet*.
- **1-Click Simulation**: Click **"⚡ Simulate"** on any recommendation to test its impact on your live gauge without altering your saved baseline.
- **2x2 Effort vs. Gain Matrix**: Interactive scatter plot categorizing interventions into *Sweet Spot (Low Effort, High Gain)*, *Major Investments*, and *Easy Incremental*.

### 3. 🧙‍♂️ 1-Question-at-a-Time Quiz Wizard & Instant Archetypes
- **Focused Questionnaire**: Step-by-step quiz displaying 1 question at a time with smooth progress tracking and auto-advancing.
- **Pre-Configured Archetypes**: Jump straight into the simulator with 5 realistic profiles:
  - 👤 **Average Modern Adult**
  - 🌿 **Blue Zone Centenarian**
  - ⚡ **Longevity Enthusiast & Athlete**
  - 💼 **Stressed Desk Professional**
  - 🚬 **Sedentary Heavy Smoker**

### 4. 🧭 Google-Docs-Style Outline Navigation
- Sticky left navigation rail that automatically tracks your active scroll position via `IntersectionObserver` and smoothly jumps to any section.

### 5. 📋 Printable Longevity Action Blueprint
- Exportable / printable PDF checklist summarizing top high-yield priorities, daily habits, weekly workout routines, and clinical biomarker targets for doctor visits.

---

## 🔬 Scientific Foundations & Biomarkers

Longevita analyzes 29+ evidence-based variables categorized into 5 longevity pillars:

| Pillar | Factors Analyzed |
| :--- | :--- |
| **🧬 Demographics & Genetics** | Chronological Age, Biological Sex, Relationship Status, Family History of Longevity (90+, 100+) & Early CVD, PM2.5 Air Quality |
| **🩺 Biometrics & Clinical** | Systolic/Diastolic Blood Pressure, Fasting Glucose / Diabetes (HbA1c), Lipid Profile (ApoB/LDL), Body Mass Index (BMI), Resting Heart Rate |
| **🏃 Fitness & Movement** | Aerobic Zone 2 Cardio (min/wk), Strength & Resistance Training (days/wk), Daily Steps (8k-10k+), Daily Sitting Duration |
| **🥗 Nutrition & Blue Zone Diet** | Mediterranean / Blue Zone Dietary Pattern, Red & Processed Meat Frequency, Fruits/Veggies/Fiber Servings, Ultra-Processed Foods & Sugars, Polyphenols (Green Tea, Berries), Daily Hydration |
| **🧠 Lifestyle, Sleep & Mind** | Tobacco Smoking & Cessation History, Alcohol Intake, Sleep Duration & Sleep Apnea, Stress & Mindfulness, Social Connectedness (Moai), Daily Dental Flossing, Sun Protection (SPF 30+), Vehicle Seatbelt Safety, Preventative Screenings |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- `npm`, `pnpm`, or `yarn`

### Installation

```bash
# Clone repository
git clone https://github.com/jj09/longevita.git
cd longevita

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Build

```bash
# Run unit tests
npm test

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 🏗️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with custom glassmorphism
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Celebrations**: [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)

---

## 📄 License

MIT License © 2026 Jacob Jedryszek
