<div align="center">

# DigitalLab2Record

**CBSE Physics Practicals Companion · Class XI**

*Walk into the lab with your phone. Walk out with a finished record.*

[![Open the Lab](https://img.shields.io/badge/OPEN%20THE%20LAB-digitallab2record.vercel.app-f59e0b?style=for-the-badge&logo=vercel&logoColor=black)](https://digitallab2record.vercel.app/)

![CBSE Class XI](https://img.shields.io/badge/CBSE-Class%20XI-1e293b?style=flat-square)
![Experiments](https://img.shields.io/badge/Practicals-7-10b981?style=flat-square)
![React](https://img.shields.io/badge/React-19-6366f1?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-8b5cf6?style=flat-square&logo=vite&logoColor=white)
![Saves in your browser](https://img.shields.io/badge/Saves%20in%20your%20browser-yes-0ea5e9?style=flat-square)

</div>

---

## 🧪 The 30-second version

You're in the physics lab. The vernier calipers are in your hand, the readings are going on a rough sheet, and the record has to be written up tonight.

**DigitalLab2Record** replaces the rough sheet. Pick the practical, take your readings, and it produces the whole thing in CBSE format: the observation table with derived columns, the step-by-step arithmetic, the mean absolute error, the graph with its slope triangulation, the viva questions — and an A4 record page you can print or paste straight into your activity file.

No sign-up. No server. Everything stays in your browser.

---

## 🧩 The problem

Every Class XI student does the same seven practicals, and runs into the same seven walls:

- **The arithmetic is fiddly and unforgiving.** Volume is `πR²H`, the spherometer needs `l²/6h + h/2`, the spring constant comes off a slope. One misplaced decimal and the whole row is wrong — and you find out after you've written it up.
- **Zero error is easy to forget and easy to get backwards.** The calipers in the cupboard have been dropped a hundred times. The correction has to be applied to *every* reading, with the right sign, and by the third row nobody remembers whether to add or subtract.
- **Graphs are a second job.** Pick a scale, plot seven points, draw a best-fit line, then argue with yourself about whether it should pass through the origin.
- **Error analysis is tedious.** Mean absolute error is easy to define and miserable to compute for five readings across three derived quantities.
- **The record is the same page seven times.** Aim, apparatus, theory, observations, calculation, result, precautions, sources of error. Written out by hand, again, usually the night before submission.
- **The rough sheet goes missing.** And so does the memory of which reading belonged to which side of the cylinder.
- **Viva arrives.** "Why is the hanger 50 gf?" "What happens if you cut the spring in half?" Nobody remembers.

None of these are physics problems. They're bookkeeping problems sitting on top of physics, and they eat the time you could have spent understanding the experiment.

---

## 🙋 Where it came from

I'm a student. I built this because I kept making the same mistakes in the school lab — forgetting the zero-error correction on the third reading, recomputing `ΔR` for the spherometer because I'd lost the rough sheet, drawing a graph on the wrong scale and starting over on a fresh sheet of graph paper.

The last straw was rewriting the same observation table for the fourth time. So instead of writing it again, I wrote this.

It is the tool I wanted in the lab: something that takes your real readings, does the boring arithmetic honestly, shows its working so you can defend it, and hands you a record page you can paste into your file. It's free, it has no account, and nothing you type ever leaves your browser.

---

## ⚠️ What this is not

Worth being blunt about, because the app is quite good at looking authoritative:

**A simulator cannot replace the apparatus.** You cannot learn from a screen that the vernier jaws must be closed *gently*, or what a ratchet feels like when it clicks three times, or how much pressure lifts a spherometer's legs off the glass. Those are hand skills, and the only way to get them is with the real instrument in front of you. The virtual rigs here exist to let you rehearse the *sequence* — where to look, what to record, what changes when you add a weight — before you're standing at the bench with a teacher watching.

**It cannot produce your readings.** Whatever you type is what it calculates. If the numbers came from the sample data or from the person next to you, the record is fiction, and a viva will find out within two questions. The tool is designed to make the write-up *honest and quick*, not to hide the fact that you didn't do the experiment.

**Zero error belongs to your instrument, on your day.** The app can apply a correction beautifully — but only you can measure what that correction is.

**Use it like this:** read the theory and rehearse the rig before the lab, then bring your real readings back and let it do the arithmetic and the page layout. Not the other way round.

A note for teachers: if a record was produced with this, the observations should still be the student's own. The numbers in the table are theirs; the app only did the sums and the ruling.

*DigitalLab2Record is an independent student project. It is not affiliated with, endorsed by, or published by CBSE or NCERT, and the syllabus references in the app are for orientation only.*

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

## 🧰 Practical tips that actually matter

The theory is in the app. These are the things that decide whether your readings are any good — the ones you learn by being told, or by getting them wrong once.

| Apparatus | What to actually do |
|---|---|
| **Vernier calipers** | Close the jaws and record the zero error **before** you start and again at the end — it changes if the instrument has been knocked. Find the coinciding division by looking straight down the scale, never at an angle. Measure the cylinder at three places along its length, and a wire in two perpendicular directions. |
| **Screw gauge** | Always advance with the **ratchet**, three clicks, never the main thimble. Never turn the screw backwards mid-measurement — if you overshoot, open it and come forward again, or backlash will cost you a few hundredths of a millimetre. Nip the wire; don't crush it. |
| **Spherometer** | Find contact by watching the screw tip and its reflection meet in the glass — not by pressing until it stops, which lifts the legs. Prick all **three** leg marks on paper and measure all three sides, then average; using one side is a classic way to lose marks. |
| **Beam balance** | Level it with the plumb line first. **Arrest before touching the pans**, always, or you'll blunt the knife edges. Weights with forceps only. Let it swing freely and read turning points on both sides; close the cabinet doors, because a draught is worth several milligrams. |
| **Gravesand's apparatus** | Board vertical by plumb line, pulleys spinning freely, and the knot must not touch the board. **Tap the board** before marking — it settles static friction and lets the knot find its true position. Use the mirror strip under the thread so your eye is square on when you mark the direction. |
| **Helical spring** | Never load past the elastic limit. Wait a minute after adding a weight — the spring creeps. Read the pointer at eye level with the mirror, and take **both** loading and unloading readings; averaging them cancels the elastic lag. |
| **Simple pendulum** | Keep the amplitude under 15°. Time 20 oscillations, start the watch as the bob crosses the **mean** position, and count that crossing as zero. Check the thread isn't rubbing the clamp, and make sure the stand doesn't wobble — a swaying support ruins the period. |

**Before you submit, check four things:** units on every column, significant figures to match the least count, the sign of your zero-error correction, and whether your graph should pass through the origin.

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

Built by a student — **[square-box-hash](https://github.com/square-box-hash)** — because writing the same observation table seven times is not physics.

[Repository](https://github.com/square-box-hash/DigitalLab2Record) · [Live app](https://digitallab2record.vercel.app/) · [Report an issue](https://github.com/square-box-hash/DigitalLab2Record/issues)

<div align="center">

*Measure twice. Calculate once.*

</div>
