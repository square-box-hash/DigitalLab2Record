<div align="center">

# DigitalLab2Record

**CBSE Physics Practicals Companion · Class XI**

*Walk into the lab with your phone. Walk out with a finished record.*

[![Open the Lab](https://img.shields.io/badge/OPEN%20THE%20LAB-digitallab2record.vercel.app-f59e0b?style=for-the-badge&logo=vercel&logoColor=black)](https://digitallab2record.vercel.app/)

![CBSE Class XI](https://img.shields.io/badge/CBSE-Class%20XI-1e293b?style=flat-square)
![Experiments](https://img.shields.io/badge/Practicals-7-10b981?style=flat-square)
![React](https://img.shields.io/badge/React-19-6366f1?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-8b5cf6?style=flat-square&logo=vite&logoColor=white)
![Works offline](https://img.shields.io/badge/Saves%20in%20your%20browser-yes-0ea5e9?style=flat-square)

</div>

---

## 🧪 The 30-second version

You're in the physics lab. The vernier calipers are in your hand, the readings are going on a rough sheet, and the record has to be written up tonight.

**DigitalLab2Record** replaces the rough sheet. Pick the practical, take your readings, and it produces the whole thing in CBSE format: the observation table with derived columns, the step-by-step arithmetic, the mean absolute error, the graph with its slope triangulation, the viva questions — and an A4 record page you can print or paste straight into your activity file.

No sign-up. No server. Everything stays in your browser.

---

## ✨ What you actually get

| | |
|---|---|
| 🎛️ **A working virtual rig** | Every practical has an interactive apparatus — slide the vernier jaw, add milligram weights, release the pendulum. Log a reading with one tap instead of typing it. |
| 📊 **Arithmetic you can defend** | Formula → substitution → result, step by step, exactly how an examiner wants to see it. No black boxes. |
| 📐 **Error analysis that's real** | Mean absolute error and percentage error for the four measurement practicals, propagated properly (the spherometer's `R` goes through `dR/dh`, not a hand-wave). Results written as `D = (2.15 ± 0.01) cm`. |
| 📈 **Graphs you can hand in** | Least-squares fit forced through the origin, the Δy/Δx triangle drawn on the line, and a **Download PNG** button that gives you the plot on a clean white sheet. |
| 💾 **Nothing gets lost** | Readings autosave to your browser about half a second after you stop typing. Refresh, close the tab, lose signal — it's still there. |
| 📄 **A record, not a screenshot** | A4 page in CBSE order: aim, apparatus, theory, observations, calculations, error analysis, result, precautions, sources of error. Print it or save it as PDF. |
| 🗣️ **Viva without panic** | Curated examiner questions per practical, with a self-test mode that hides the answers. |

---

## 🔬 The seven practicals

| # | Practical | You measure | It works out |
|:-:|---|---|---|
| 01 | **Vernier Calipers** | MSR + vernier coincidence | Diameter, radius, area, volume (with zero-error correction) |
| 02 | **Screw Gauge** | Pitch scale + circular scale | Wire diameter, cross-sectional area |
| 03 | **Spherometer** | Sagitta on curved surface and on plane glass | Radius of curvature `R = l²/6h + h/2`, focal length |
| 04 | **Beam Balance** | Turning points L₁, L₂, R₁, R₂ | Mass by the resting-point method, interpolated between readings either side of R₀ |
| 05 | **Parallelogram Law** | Forces P, Q and the angle θ | Resultant weight, percentage error against a spring balance |
| 06 | **Helical Spring** | Load, loading and unloading positions | Force constant `k` from the load–extension slope |
| 07 | **Simple Pendulum** | Thread length, time for 20 oscillations | `g` from the L–T² slope, length of a second's pendulum |

> **Sections:** 01–06 are Section A (mechanics, measurements, elasticity), 07 is Section B (oscillations).

---

## 🚀 Run it locally

```bash
# Node 20.19+ or 22.12+ (Vite 8 needs it)
git clone https://github.com/square-box-hash/DigitalLab2Record.git
cd DigitalLab2Record
npm install
npm run dev        # → http://localhost:3000
```

```bash
npm run build      # static build into dist/
npm run lint       # tsc --noEmit
```

Deploy it anywhere that serves static files — Vercel, Netlify, GitHub Pages, Cloud Run.

---

## 💾 Where your data lives

Observations and instrument constants are written to `localStorage` under `cbse_lab_state_v1`, debounced 600 ms after the last edit. The workspace header shows the last save time, and **Clear saved data** in the footer wipes it and restores the sample readings.

Two ways out of the app:

- **Export CSV** — constants, every column (derived ones included) and the result, as `#` comment lines above a clean table. Opens in Excel or Google Sheets.
- **Record File → Print / Save as PDF** — the A4 sheet, laid out in CBSE order.

---

## 🛠️ Under the hood

The whole app is **configuration-driven**. Each practical is one object in `src/data/experiments.ts` that declares its constants, columns, seed readings, a `calculateRow` function and a `calculateResult` function. Every view — table, calculation engine, error analysis, graph, record page, CSV export — reads from that object, so nothing is hard-coded per experiment.

```
src/
├── data/experiments.ts        ← all seven practicals live here
├── types/experiment.ts        ← ExperimentConfig & friends
├── utils/
│   ├── math.ts                ← least-squares regression, rounding
│   ├── errorAnalysis.ts       ← mean absolute error & propagation
│   ├── chartExport.ts         ← SVG → white-sheet PNG
│   └── export.ts              ← CSV writer
└── components/
    ├── Header / MobileTabBar / Sidebar
    ├── ObservationTable / InstrumentSetupCard
    ├── CalculationEngine / RegressionGraph
    ├── CbseRecordView / TheoryView / VivaVoceAccordion
    └── simulations/           ← one interactive rig per practical
```

### Adding an eighth practical

1. Add an object to `EXPERIMENTS` in `src/data/experiments.ts`.
2. Give it `constants`, `columns`, `initialRows`, `calculateRow`, `calculateResult`, plus theory, precautions and viva questions.
3. That's it — the table, calculator, graph, record page and export all pick it up. Add a simulator in `components/simulations/` if you want a virtual rig too.

---

## 🗺️ Where it could go next

Honest about what's missing:

- The spherometer takes the leg distance as one number instead of three pricked distances (AB, BC, CA), so `l` has no measurable spread to propagate.
- The record page has no diagram section, and doesn't yet print the graph — download the PNG and paste it.
- Class XII practicals aren't in here yet; the config makes them a data exercise, not a code one.

PRs and issues are welcome — especially from anyone who has actually sat through a CBSE practical exam.

---

## 👤 Author

Built by **[square-box-hash](https://github.com/square-box-hash)** — because writing the same observation table seven times is not physics.

[Repository](https://github.com/square-box-hash/DigitalLab2Record) · [Live app](https://digitallab2record.vercel.app/) · [Report an issue](https://github.com/square-box-hash/DigitalLab2Record/issues)

<div align="center">

*Measure twice. Calculate once.*

</div>
