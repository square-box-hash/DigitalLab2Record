# CBSE Physics Practicals Companion (Class 11)

A modern, interactive laboratory companion and virtual manual designed for CBSE Class 11 Physics students and educators. It enables students to record real experimental observations, automatically calculate results, generate step-by-step derivations, and produce a ready-to-copy practical record in CBSE format.

## 🌐 Live Demo

Visit the deployed app here: https://digitallab2record.vercel.app/

---

## 🚀 Running Locally in VS Code

You can open and edit this codebase natively in **Visual Studio Code** or any editor of your choice with zero vendor lock-in.

### Prerequisites
- **Node.js**: v18.0.0 or later (Node 20+ recommended)
- **npm** or **yarn** / **pnpm**

### Step-by-Step Setup
1. **Clone or Download the Project**:
   - In Google AI Studio, click **Export to GitHub** or **Download ZIP** from the top menu.
   - Extract the project into your preferred local directory.

2. **Open in VS Code**:
   ```bash
   cd cbse-physics-practicals-companion
   code .
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or the URL printed in your terminal).

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The production-ready static assets will be compiled into the `dist/` directory, ready to deploy to Vercel, Netlify, Cloud Run, GitHub Pages, or any web host.

---

## 💾 Saving Your Work

Observations and instrument constants are autosaved to this browser's local storage about half a second after you stop typing, so a refresh, a closed tab or a dropped connection no longer loses a session. The workspace header shows the time of the last save, and **Clear saved data** in the footer wipes the stored readings and restores the sample data for every experiment.

To hand a record in or open it in Excel, use **Export CSV** in the observation table: it writes the constants, the full observation table (derived columns included) and the final result as a UTF-8 CSV with `#` comment lines, and the printed A4 record is still available from the Record File tab.

## 📁 Project Structure

```
├── index.html                  # HTML entry point with Google Fonts & SEO meta
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite & Tailwind CSS plugins
├── src/
│   ├── main.tsx                # React root mount
│   ├── App.tsx                 # Core application shell & state coordinator
│   ├── index.css               # Tailwind CSS & @media print styles
│   ├── types/
│   │   └── experiment.ts       # Strongly-typed ExperimentConfig interfaces
│   ├── utils/
│   │   └── math.ts             # Least-squares linear regression & rounding
│   ├── data/
│   │   └── experiments.ts      # Full configurations for all 7 experiments
│   └── components/
│       ├── Header.tsx          # Top navigation, mode tabs & print trigger
│       ├── Sidebar.tsx         # Experiment selector & search filter
│       ├── InstrumentSetupCard.tsx # Calibration & least-count adjustments
│       ├── ObservationTable.tsx# Editable spreadsheet with derived columns
│       ├── CalculationEngine.tsx   # Step-by-step arithmetic proofs
│       ├── RegressionGraph.tsx # Interactive Recharts linear fit & slope
│       ├── CbseRecordView.tsx  # Printable A4 CBSE manual format
│       ├── VivaVoceAccordion.tsx   # Examiner Q&A with quiz flashcard mode
│       └── TheoryView.tsx      # Comprehensive NCERT practical theory
```

---

## 🔬 Implemented Experiments (CBSE Syllabus)

### Section A
1. **Vernier Calipers**: Cylinder & sphere diameter, radius, volume, and cross-sectional area with least count ($0.01\text{ cm}$) and zero error corrections.
2. **Screw Gauge**: Wire diameter and sheet thickness with circular scale reading, backlash prevention, and least count ($0.01\text{ mm}$).
3. **Spherometer**: Radius of curvature ($R = \frac{l^2}{6h} + \frac{h}{2}$) using sagitta ($h$) and triangular leg distance ($l$).
4. **Beam Balance**: Determination of unknown mass using the principle of moments and the method of swings.
5. **Parallelogram Law of Vectors**: Weight determination on Gravesand's apparatus ($R = \sqrt{P^2 + Q^2 + 2PQ\cos\theta}$) and percentage error analysis.
6. **Helical Spring**: Determination of spring force constant ($k$) using load vs. extension measurements and best-fit line slope.

### Section B
7. **Simple Pendulum**: Plotting $L\text{ vs } T^2$ regression line to measure acceleration due to gravity ($g = \frac{4\pi^2}{\text{slope}}$) and effective length of a second's pendulum.

---

## 🛠 Adding a New Experiment

All experiment definitions are driven by the `ExperimentConfig` interface in `src/types/experiment.ts`. To add a new experiment (e.g. for Class 12 or additional Section B practicals):
1. Open `src/data/experiments.ts`.
2. Add a new object to the `EXPERIMENTS` array defining the `aim`, `apparatus`, `theory`, `formula`, `constants`, `columns`, `initialRows`, `calculateRow`, `calculateResult`, and `vivaQuestions`.
3. The table, calculation engine, record printer, and graph views will automatically render your new experiment dynamically.
