import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Moon,
  Sun,
  FlaskConical,
  Table2,
  FileText,
  TrendingUp,
  Sigma,
  MessageSquareQuote,
  Check,
} from 'lucide-react';
import { EXPERIMENTS } from '../data/experiments';

interface LandingViewProps {
  onEnterLab: (experimentId?: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const CHANGES: Array<{ what: string; before: string; after: string }> = [
  {
    what: 'Zero-error correction',
    before: 'Applied by hand to five rows, the sign guessed twice',
    after: 'Applied to every row, with the sign shown as (−e)',
  },
  {
    what: 'Volume and area',
    before: 'πR²H on a phone calculator, a decimal lost along the way',
    after: 'Substituted step by step, in the units of the table',
  },
  {
    what: 'Mean absolute error',
    before: 'Skipped, or copied from the group next to you',
    after: 'Computed and propagated into A and V as well',
  },
  {
    what: 'The graph',
    before: 'Scale chosen twice, redrawn on a fresh sheet',
    after: 'Fitted through the origin, Δy/Δx drawn, exported as a PNG',
  },
  {
    what: 'The record page',
    before: 'The same nine headings, written out again',
    after: 'A4 page in CBSE order — print it or save it as PDF',
  },
  {
    what: 'Viva',
    before: 'Reading the manual at 11 pm',
    after: 'Questions per practical, with a self-test mode',
  },
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is DigitalLab2Record?',
    a: 'A lab companion for the seven CBSE Class XI physics practicals. You enter the readings you took; it builds the observation table, the arithmetic, the error analysis, the graph and a printable record page.',
  },
  {
    q: 'Does it replace the apparatus?',
    a: 'No, and it is not trying to. A simulator cannot teach you to feel a ratchet click or to close a jaw gently — that comes from the instrument in front of you. The rigs are for rehearsing the sequence before you reach the bench.',
  },
  {
    q: 'What if the school apparatus is broken?',
    a: 'That is a resource problem, not a personal failing — it is the reason this exists. Note what was wrong, take whatever readings you can legitimately take, and label the rest for what it is. A labelled limitation is something a teacher can accept.',
  },
  {
    q: 'Where does my data go?',
    a: 'Nowhere. Observations are saved to this browser only — no server, no account, no upload. Export to CSV or print to PDF when you need it elsewhere.',
  },
  {
    q: 'What does it cost?',
    a: 'Nothing. It is a static site built by a student, and it stays that way.',
  },
];

const CAPABILITIES = [
  { icon: FlaskConical, title: 'A working virtual rig', body: 'Every practical has an interactive apparatus — slide the vernier jaw, add slotted weights one at a time, release the pendulum.' },
  { icon: Table2, title: 'Derived columns as you type', body: 'Corrected readings, extensions and periods compute live, so a mistyped row is obvious before it reaches the record.' },
  { icon: Sigma, title: 'Error analysis that is real', body: 'Mean absolute error and percentage error, propagated properly — the spherometer goes through dR/dh, not a hand-wave.' },
  { icon: TrendingUp, title: 'Graphs you can hand in', body: 'Least-squares fit through the origin, the Δy/Δx triangle drawn on the line, and a white-sheet PNG export.' },
  { icon: FileText, title: 'The record, not a screenshot', body: 'Nine sections in CBSE order, ruled tables, the result boxed, space for both signatures.' },
  { icon: MessageSquareQuote, title: 'Viva without panic', body: 'Curated examiner questions per practical, with a self-test mode that hides the answers.' },
];

export const LandingView: React.FC<LandingViewProps> = ({ onEnterLab, isDark, onToggleTheme }) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-stone-50/85 dark:bg-stone-950/85 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 h-[62px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-[26px] h-[26px] shrink-0 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 grid place-items-center font-serif text-[15px] pb-0.5">
              D
            </span>
            <span className="font-semibold tracking-tight text-[15px] truncate">DigitalLab2Record</span>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-[13.5px] text-stone-600 dark:text-stone-400">
            <a href="#interface" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">The interface</a>
            <a href="#changes" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">What changes</a>
            <a href="#practicals" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Practicals</a>
            <a href="#about" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 grid place-items-center rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onEnterLab()}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-[13.5px] font-medium hover:bg-black dark:hover:bg-white transition-colors"
            >
              Open the lab
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1180px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24 pb-14">
        <span className="eyebrow">
          CBSE Class XI <span className="dot" /> Physics practicals <span className="dot" /> 7 experiments
        </span>
        <h1 className="mt-5 text-[clamp(38px,6.4vw,76px)] leading-[1.02] max-w-[17ch]">
          The record writes itself.
          <br />
          <em className="italic">The physics stays yours.</em>
        </h1>
        <p className="mt-6 max-w-[58ch] text-stone-600 dark:text-stone-400 text-[16.5px] leading-relaxed">
          DigitalLab2Record takes the readings you actually took, does the arithmetic honestly, and
          hands you an A4 page in CBSE format — with every substitution shown, so you can defend
          each line in a viva.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onEnterLab()}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium hover:bg-black dark:hover:bg-white transition-colors"
          >
            Start experimenting
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#practicals"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-medium text-stone-800 dark:text-stone-200 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
          >
            See the seven practicals
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11.5px] text-stone-500 dark:text-stone-500">
          <span>No account</span>
          <span className="w-[3px] h-[3px] rounded-full bg-stone-400 inline-block" />
          <span>Nothing leaves your browser</span>
          <span className="w-[3px] h-[3px] rounded-full bg-stone-400 inline-block" />
          <span>Autosaves as you type</span>
        </div>

        <div className="mt-9 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-2">
          {['React 19 + Vite 8', '7 practicals, Class XI', 'Mean absolute error, propagated', 'Graphs export as PNG', 'Print the record as PDF'].map((item) => (
            <span
              key={item}
              className="inline-flex items-center h-7 px-3 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-[11.5px] text-stone-600 dark:text-stone-400"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Interface preview */}
      <section id="interface" className="border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <span className="eyebrow">01 / 04 <span className="dot" /> The interface</span>
              <h2 className="mt-3 text-[clamp(28px,3.6vw,44px)] leading-tight max-w-[24ch]">
                A workspace built around the table.
              </h2>
              <p className="mt-3 max-w-[54ch] text-stone-600 dark:text-stone-400 text-[15px] leading-relaxed">
                Seven practicals in the sidebar, the rig on the left, the observations and the
                arithmetic on the right. Everything on one screen, nothing hidden behind a wizard.
              </p>
            </div>
            <span className="font-mono text-[11px] text-stone-400 dark:text-stone-600">Fig. 01</span>
          </div>

          {/* Static preview of the workspace */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-[0_1px_2px_rgba(16,16,20,.04),0_24px_60px_-32px_rgba(16,16,20,.18)]">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 h-12 border-b border-stone-200 dark:border-stone-800 text-[12px]">
              <span className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">Live</span>
                the real interface
              </span>
              <button
                onClick={() => onEnterLab()}
                className="font-mono text-[11px] text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                open it →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
              <div className="hidden md:block border-r border-stone-200 dark:border-stone-800 p-3.5 bg-stone-50 dark:bg-stone-950/40">
                <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-600 px-2 pb-2">Practicals</div>
                {EXPERIMENTS.map((exp, i) => (
                  <button
                    key={exp.id}
                    onClick={() => onEnterLab(exp.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] text-left transition-colors ${
                      i === 0
                        ? 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900/60'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-stone-400 dark:text-stone-600 w-4">{String(i + 1).padStart(2, '0')}</span>
                    <span className="truncate">{exp.title.split(':')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-[10px]">Section A</span>
                  <span>Mechanics &amp; Measurements</span>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="font-mono text-[10.5px]">Experiment 01</span>
                </div>
                <h3 className="mt-3 text-2xl sm:text-[28px] leading-tight">Vernier Calipers</h3>
                <p className="mt-1 text-[12.5px] text-stone-500 dark:text-stone-400 max-w-[60ch]">
                  To measure the diameter and length of a small cylindrical body, and hence its volume and cross-sectional area.
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800">
                  <table className="w-full text-[11.5px]">
                    <thead>
                      <tr className="bg-stone-50 dark:bg-stone-950/40 text-stone-500 dark:text-stone-400">
                        {['Obs', 'MSR (cm)', 'n (div)', 'Measured', 'Corrected D'].map((h) => (
                          <th key={h} className="text-left font-medium px-3 py-2 border-b border-stone-200 dark:border-stone-800 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {[
                        [1, '2.1', 4, '2.14', '2.16'],
                        [2, '2.1', 5, '2.15', '2.17'],
                        [3, '2.1', 4, '2.14', '2.16'],
                      ].map((row) => (
                        <tr key={String(row[0])}>
                          <td className="px-3 py-2 border-b border-stone-100 dark:border-stone-800/70">{row[0]}</td>
                          <td className="px-3 py-2 border-b border-stone-100 dark:border-stone-800/70">{row[1]}</td>
                          <td className="px-3 py-2 border-b border-stone-100 dark:border-stone-800/70">{row[2]}</td>
                          <td className="px-3 py-2 border-b border-stone-100 dark:border-stone-800/70 text-emerald-700 dark:text-emerald-400">{row[3]}</td>
                          <td className="px-3 py-2 border-b border-stone-100 dark:border-stone-800/70 text-emerald-700 dark:text-emerald-400">{row[4]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-3.5 py-2.5 text-[11.5px] text-emerald-900 dark:text-emerald-300">
                  <span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] opacity-70 block">Uncertainty</span>
                    D = (2.15 ± 0.01) cm
                  </span>
                  <span className="font-mono">0.30 %</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200 dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-stone-50 dark:bg-stone-950 p-6">
                <Icon className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <h3 className="mt-3 text-[15px] font-semibold tracking-tight">{title}</h3>
                <p className="mt-1.5 text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What changes */}
      <section id="changes" className="border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <span className="eyebrow">02 / 04 <span className="dot" /> What changes</span>
              <h2 className="mt-3 text-[clamp(28px,3.6vw,44px)] leading-tight">Same experiment. Same evening.</h2>
              <p className="mt-3 max-w-[54ch] text-stone-600 dark:text-stone-400 text-[15px]">
                Not a faster way to fake a practical — a faster way to finish an honest one.
              </p>
            </div>
            <span className="font-mono text-[11px] text-stone-400 dark:text-stone-600">Fig. 02</span>
          </div>

          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1.3fr_1fr_1fr] bg-stone-50 dark:bg-stone-950/40 border-b border-stone-200 dark:border-stone-800">
              {['The part of the evening', 'Rough sheet & calculator', 'With DigitalLab2Record'].map((h) => (
                <div key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-stone-500 dark:text-stone-500">{h}</div>
              ))}
            </div>
            {CHANGES.map((row, i) => (
              <div
                key={row.what}
                className={`grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] ${i < CHANGES.length - 1 ? 'border-b border-stone-100 dark:border-stone-800/70' : ''}`}
              >
                <div className="px-4 pt-3 sm:py-3 text-[13px] font-medium text-stone-900 dark:text-stone-100">{row.what}</div>
                <div className="px-4 py-1.5 sm:py-3 text-[12.5px] text-stone-500 dark:text-stone-500">{row.before}</div>
                <div className="px-4 pb-3 sm:py-3 text-[12.5px] text-stone-800 dark:text-stone-300 sm:bg-emerald-50/40 dark:sm:bg-emerald-950/20">
                  <span className="inline-flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {row.after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practicals */}
      <section id="practicals" className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <span className="eyebrow">03 / 04 <span className="dot" /> The practicals</span>
              <h2 className="mt-3 text-[clamp(28px,3.6vw,44px)] leading-tight">Seven experiments, start to result.</h2>
              <p className="mt-3 max-w-[54ch] text-stone-600 dark:text-stone-400 text-[15px]">
                Pick one to open it straight in the workspace.
              </p>
            </div>
            <span className="font-mono text-[11px] text-stone-400 dark:text-stone-600">Fig. 03</span>
          </div>

          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-200 dark:divide-stone-800 bg-stone-50 dark:bg-stone-950">
            {EXPERIMENTS.map((exp, i) => (
              <button
                key={exp.id}
                onClick={() => onEnterLab(exp.id)}
                className="w-full text-left flex items-start sm:items-center gap-4 px-4 sm:px-5 py-4 hover:bg-white dark:hover:bg-stone-900 transition-colors group"
              >
                <span className="font-mono text-[11px] text-stone-400 dark:text-stone-600 w-6 shrink-0 pt-1 sm:pt-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] font-medium text-stone-900 dark:text-stone-100">{exp.title}</span>
                  <span className="block text-[12.5px] text-stone-500 dark:text-stone-500 mt-0.5 line-clamp-1">{exp.aim}</span>
                </span>
                <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] text-stone-400 dark:text-stone-600">
                  {exp.section}
                </span>
                <ArrowUpRight className="w-4 h-4 shrink-0 text-stone-300 dark:text-stone-700 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <span className="eyebrow">04 / 04 <span className="dot" /> About</span>
              <h2 className="mt-3 text-[clamp(28px,3.6vw,44px)] leading-tight">The honest version.</h2>
            </div>
            <span className="font-mono text-[11px] text-stone-400 dark:text-stone-600">Fig. 04</span>
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800">
            {FAQ.map((item, i) => (
              <div key={item.q} className="grid grid-cols-[42px_1fr] gap-4 py-5 border-b border-stone-200 dark:border-stone-800">
                <span className="font-mono text-[11px] text-stone-400 dark:text-stone-600 pt-1">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-[14.5px] font-semibold tracking-tight">{item.q}</h3>
                  <p className="mt-1.5 text-[13.5px] text-stone-600 dark:text-stone-400 leading-relaxed max-w-[78ch]">{item.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-[19px] leading-snug">Ready when your readings are.</h3>
              <p className="mt-1 text-[13px] text-stone-600 dark:text-stone-400">
                Seven practicals, no account, nothing uploaded.
              </p>
            </div>
            <button
              onClick={() => onEnterLab()}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium hover:bg-black dark:hover:bg-white transition-colors shrink-0"
            >
              Open the lab
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-[22px] h-[22px] rounded-md bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 grid place-items-center font-serif text-[13px] pb-0.5">D</span>
            <span className="text-[13px] font-medium">DigitalLab2Record</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] text-stone-500 dark:text-stone-500">
            <a href="https://github.com/square-box-hash/DigitalLab2Record" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">Repository</a>
            <a href="https://github.com/square-box-hash" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">@square-box-hash</a>
            <span className="font-mono text-[11px] text-stone-400 dark:text-stone-600">CBSE Physics Practicals Companion · Class XI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
