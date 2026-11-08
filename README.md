<div align="center">

# DigitalLab2Record

**CBSE Physics Practicals Companion · Class XI**

*Walk into the lab with your phone. Walk out with a finished record.*

[![Open the Lab](https://img.shields.io/badge/OPEN%20THE%20LAB-digitallab2record.vercel.app-f59e0b?style=for-the-badge&logo=vercel&logoColor=black)](https://digitallab2record.vercel.app/)

![CBSE Class XI](https://img.shields.io/badge/CBSE-Class%20XI-1e293b?style=flat-square)
![Experiments](https://img.shields.io/badge/Practicals-12-10b981?style=flat-square)
![React](https://img.shields.io/badge/React-19-6366f1?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-8b5cf6?style=flat-square&logo=vite&logoColor=white)
![Saves in your browser](https://img.shields.io/badge/Saves%20in%20your%20browser-yes-0ea5e9?style=flat-square)

</div>

---

## 🧪 The 30-second version

You're in the physics lab. The vernier calipers are in your hand, the readings are going on a rough sheet, and the record has to be written up tonight.

**DigitalLab2Record** replaces the rough sheet. Pick the practical, take your readings, and it produces the whole thing in CBSE format: the observation table with derived columns, the step-by-step arithmetic, the mean absolute error, the graph with its slope triangulation, the viva questions — and an A4 record page you can print or paste straight into your activity file.

There is also a landing page that explains the thing, a **3D instrument room** where you can turn the real apparatus around in your hand before you meet it, and a printable record at the end of every practical.

No sign-up. No server. Everything stays in your browser.

---

## 🧩 The problem

Every Class XI student does the same twelve practicals, and runs into the same walls:

- **The arithmetic is fiddly and unforgiving.** Volume is `πR²H`, the spherometer needs `l²/6h + h/2`, the spring constant comes off a slope. One misplaced decimal and the whole row is wrong — and you find out after you've written it up.
- **Zero error is easy to forget and easy to get backwards.** The calipers in the cupboard have been dropped a hundred times. The correction has to be applied to *every* reading, with the right sign, and by the third row nobody remembers whether to add or subtract.
- **Graphs are a second job.** Pick a scale, plot the points, draw a best-fit line, then argue with yourself about whether it should pass through the origin.
- **Error analysis is tedious.** Mean absolute error is easy to define and miserable to compute for five readings across three derived quantities.
- **The record is the same page every time.** Aim, apparatus, theory, observations, calculation, result, precautions, sources of error. Written out by hand, again, usually the night before submission.
- **The rough sheet goes missing.** And so does the memory of which reading belonged to which side of the cylinder.
- **Viva arrives.** "Why is the hanger 50 gf?" "What happens if you cut the spring in half?" Nobody remembers.

None of these are physics problems. They're bookkeeping problems sitting on top of physics, and they eat the time you could have spent understanding the experiment.

---

## 🙋 Where it came from

I'm a student. I built this because the apparatus in our school lab mostly didn't work.

The pulley on the Gravesand's apparatus wouldn't turn, so the knot never settled at its true position and every angle we read was guesswork. The screw gauge had been through so many hands that its ratchet no longer clicked — you couldn't tell when the studs had touched the wire, only that the wire was flattened afterwards. The helical spring had rusted badly enough that it barely stretched, and the scale markings behind it had washed off years ago.

When the equipment is that far gone, the practical quietly turns into a copying exercise: you write down what the group next to you got, or what the manual's sample table says, and the only thing you learn is how to fill a table.

So instead of writing it out again, I wrote this. It takes the readings you can actually get, does the arithmetic honestly, shows its working so you can defend it, and hands you a record page you can paste into your file. It's free, it has no account, and nothing you type ever leaves your browser.

---

## ⚠️ What this is not

Worth being blunt about, because the app is quite good at looking authoritative:

**A simulator cannot replace the apparatus.** You cannot learn from a screen that the vernier jaws must be closed *gently*, or what a ratchet feels like when it clicks three times, or how much pressure lifts a spherometer's legs off the glass. Those are hand skills, and the only way to get them is with the real instrument in front of you. The virtual rigs here exist to let you rehearse the *sequence* — where to look, what to record, what changes when you add a weight — before you're standing at the bench with a teacher watching.

**It cannot produce your readings.** Whatever you type is what it calculates. If the numbers came from the sample data or from the person next to you, the record is fiction, and a viva will find out within two questions. The tool is designed to make the write-up *honest and quick*, not to hide the fact that you didn't do the experiment.

**Zero error belongs to your instrument, on your day.** The app can apply a correction beautifully — but only you can measure what that correction is.

**Use it like this:** read the theory and rehearse the rig before the lab, then bring your real readings back and let it do the arithmetic and the page layout. Not the other way round.

**And if the apparatus is broken:** that's a resource problem, not a personal failing. Say what was wrong, take whatever readings you can legitimately take, and label the rest for what it is.

A note for teachers: if a record was produced with this, the observations should still be the student's own. The numbers in the table are theirs; the app only did the sums and the ruling.

*DigitalLab2Record is an independent student project. It is not affiliated with, endorsed by, or published by CBSE or NCERT, and the syllabus references in the app are for orientation only.*

---

## ✨ What you actually get

| | |
|---|---|
| 🎛️ **A working virtual rig** | All twelve practicals have an interactive apparatus — slide the vernier jaw, add milligram weights, raise the open limb of the Boyle's apparatus. Log a reading with one tap instead of typing it. Every drawing fits the card, with a zoom control for when you need to read a single division. |
| 📊 **Arithmetic you can defend** | Formula → substitution → result, step by step, exactly how an examiner wants to see it. No black boxes. |
| 📐 **Error analysis that's real** | Mean absolute error and percentage error on five of them, propagated properly — the spherometer's `R` goes through `dR/dh` rather than a hand-wave, and the beam balance derives its uncertainty from pointer precision over measured sensitivity. Results written as `D = (2.148 ± 0.006) cm`, with the percentage worked out from the printed figures so the arithmetic on the page adds up. |
| 📈 **Graphs you can hand in** | Least-squares fit forced through the origin, the Δy/Δx triangle drawn on the line, and a **Download PNG** button that gives you the plot on a clean white sheet. |
| 💾 **Nothing gets lost** | Readings autosave to your browser about half a second after you stop typing. Refresh, close the tab, lose signal — it's still there. |
| 📄 **A record, not a screenshot** | A4 page in CBSE order: aim, apparatus, theory, observations, calculations, error analysis, result, precautions, sources of error. Print it or save it as PDF. |
| 🗣️ **Viva without panic** | Curated examiner questions per practical, with a self-test mode that hides the answers. |
| 🔭 **The apparatus in 3D** | A separate instrument room with rotatable models of the calipers, screw gauge, spherometer and pendulum, embedded from Sketchfab with credit to the makers. The screw gauge is served from this repo, so the room draws its own cursor there — an open hand to grab it, a fist while you turn it, a pinch while you zoom. |
| 🌗 **A theme that knows the time** | Light through the working day, dark from 7 pm to 6 am, with the toggle still available when you disagree. Light mode uses a translucent, blurred surface over a soft wash; the printable record stays opaque, because paper is paper. |

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

### When the apparatus itself is the problem

Worth ruling out before you blame your own hands. These are the faults that make a reading meaningless no matter how carefully you take it.

| Symptom | What it usually means | What to do |
|---|---|---|
| Screw gauge ratchet no longer clicks | The slip clutch is worn out, so contact pressure is whatever you happen to apply | Advance the thimble very gently by hand, take three readings at the same spot; if they scatter by more than the least count, the gauge is unusable — report it |
| Vernier zero error differs each time you close the jaws | Worn or sprung jaws | Take the zero error three times; if it varies by more than the least count, the calipers are done |
| Spring barely stretches, or the coils stick | Rust binding the coils — Hooke's law has stopped applying | Don't load it. A force-constant graph from a binding spring curves instead of straightening |
| Spring broke while loading | It was loaded past the elastic limit, or corrosion did the work | Note where it failed; a shorter spring has a different `k` anyway |
| Pulley won't spin freely | Frayed thread doubled in the groove, a bent axle, or a board that isn't vertical | Re-thread it, check the plumb line, tap and re-settle; if it still binds, θ is not measurable |
| Scale markings washed off | Age | Clamp a steel rule behind the scale and read against that, or reject the instrument |

If it can't be fixed, say so on the record. A labelled limitation — *"apparatus faulty, readings from simulation"* — is something a teacher can accept. A silent one isn't.

---

## 🔬 The twelve practicals

| # | Practical | You measure | It works out |
|:-:|---|---|---|
| 01 | **Vernier Calipers** | MSR + vernier coincidence | Diameter, radius, area, volume (with zero-error correction) |
| 02 | **Screw Gauge** | Pitch scale + circular scale | Wire diameter, cross-sectional area |
| 03 | **Spherometer** | Sagitta on curved surface and on plane glass | Radius of curvature `R = l²/6h + h/2`, focal length |
| 04 | **Beam Balance** | Turning points L₁, L₂, R₁, R₂ | Mass by the resting-point method, interpolated between readings either side of R₀ |
| 05 | **Parallelogram Law** | Forces P, Q and the angle θ | Resultant weight, percentage error against a spring balance |
| 06 | **Helical Spring** | Load, loading and unloading positions | Force constant `k` from the load–extension slope |
| 07 | **Simple Pendulum** | Thread length, time for 20 oscillations | `g` from the L–T² slope, length of a second's pendulum |
| 08 | **Inclined Plane** | Angle θ, the load that keeps the roller moving uniformly | `W` against `sin θ` — slope gives the roller's mass, intercept the rolling friction |
| 09 | **Young's Modulus** | Micrometer readings against load, wire diameter | `Y = gL/(πr² × slope)` from the extension–load line |
| 10 | **Spring by Oscillation** | Load and the time for 20 oscillations | Force constant `K = 4π²/slope` and the spring's effective mass from the intercept |
| 11 | **Boyle's Law** | Air-column length and mercury-level difference | `PV` constancy, and `P` against `1/V` as a straight line |
| 12 | **Surface Tension** | Capillary rise, bore diameter | `T = ρgrh/2`, with mean absolute error propagated from the rise |

> **Sections:** 01–06 and 08–09 are Section A (mechanics, measurements, elasticity); 07 and 10–12 are Section B (oscillations and properties of matter).

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
npm test           # pins the twelve seeded results
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
├── data/
│   ├── experiments.ts         ← E1–E7 (core measurements, pendulum)
│   └── experimentsExtra.ts    ← E8–E12 (inclined plane → surface tension)
├── types/experiment.ts        ← ExperimentConfig & friends
├── utils/
│   ├── math.ts                ← least-squares regression, rounding
│   ├── errorAnalysis.ts       ← mean absolute error & propagation
│   ├── chartExport.ts         ← SVG → white-sheet PNG
│   └── export.ts              ← CSV writer
└── components/
    ├── LandingView            ← the page at /
    ├── InstrumentExplorerView ← the 3D instrument room at #/instruments
    ├── Header / MobileTabBar / Sidebar
    ├── ObservationTable / InstrumentSetupCard
    ├── CalculationEngine / RegressionGraph
    ├── CbseRecordView / TheoryView / VivaVoceAccordion
    ├── ui/                    ← NumberInput, RigViewport (zoom + fit)
    └── simulations/           ← one interactive rig per practical
```

### Routes

| URL | What you get |
|---|---|
| `/` | The landing page |
| `#/lab` | The workspace |
| `#/lab/<experiment-id>` | The workspace with that practical open |
| `#/instruments` | The 3D instrument room |

Hash routing rather than a router library: it costs nothing, works on any static host, and the back button behaves.

### Adding another practical

1. Add an object to `CORE_EXPERIMENTS` in `src/data/experiments.ts`, or to `EXTRA_EXPERIMENTS` in `experimentsExtra.ts` — they are concatenated into `EXPERIMENTS`.
2. Give it `constants`, `columns`, `initialRows`, `calculateRow`, `calculateResult`, plus theory, precautions and viva questions. Add a `graphConfig` if it plots something, and call `buildMeanErrorAnalysis` if it has repeated readings.
3. That's it — the table, calculator, graph, record page, CSV export and the landing page's practical list all pick it up. Add a rig in `components/simulations/` and one branch in `SimulatorContainer` if you want a virtual apparatus too.

---

## 🗺️ Where it could go next

Honest about what's missing:

- The spherometer takes the leg distance as one number instead of three pricked distances (AB, BC, CA), so `l` has no measurable spread to propagate. The same is true of the Vernier cylinder height and the Searle's wire diameter.
- The record page has no diagram section, and doesn't yet print the graph — download the PNG and paste it.
- The spring and pendulum results come from a graph slope, and the slope carries no uncertainty yet.
- English only. A tool aimed at Indian classrooms should not be.
- Class XII practicals aren't in here yet; the config makes them a data exercise, not a code one.
- Only four instruments have good open 3D models. A beam balance, a Gravesand's board and a Boyle's apparatus would each be one more object in `INSTRUMENTS`.

PRs and issues are welcome — especially from anyone who has actually sat through a CBSE practical exam.

---

## 📄 Licence

MIT — see [LICENSE](LICENSE). Use it, fork it, hand it to your juniors. The NCERT references and any third-party 3D models credited in the instrument room keep their own terms.

## 👤 Author

Built by a student — **[square-box-hash](https://github.com/square-box-hash)** — because writing the same observation table twelve times is not physics.

[Repository](https://github.com/square-box-hash/DigitalLab2Record) · [Live app](https://digitallab2record.vercel.app/) · [Report an issue](https://github.com/square-box-hash/DigitalLab2Record/issues)

<div align="center">

*Measure twice. Calculate once.*

</div>
