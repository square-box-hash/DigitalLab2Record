import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Box, ExternalLink, Moon, Rotate3d, Sun } from 'lucide-react';

interface InstrumentExplorerViewProps {
  onHome: () => void;
  onEnterLab: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

interface InstrumentModel {
  id: string;
  name: string;
  measures: string;
  readIt: string[];
  /** Sketchfab model UID */
  uid: string;
  modelTitle: string;
  author: string;
  authorUrl: string;
  thumbnail: string;
}

/*
  Third-party 3D models, embedded from Sketchfab's public viewer — no API key and
  no hosting on our side. Each card credits the maker and links back to the model
  page, which is both the licence requirement and the honest thing to do.
*/
const INSTRUMENTS: InstrumentModel[] = [
  {
    id: 'vernier-calipers',
    name: 'Vernier calipers',
    measures: 'Lengths from about 0.1 mm to 15 cm — diameters, depths, internal bores.',
    readIt: [
      'Close the jaws first and note the zero error.',
      'Read the main scale just before the vernier zero, then find the division that lines up.',
      'Total = MSR + (coinciding division × least count).',
    ],
    uid: '955e210ad22c4b95b37a993b3352b9d8',
    modelTitle: 'Vernier Caliper',
    author: 'Naveen Manja',
    authorUrl: 'https://sketchfab.com/naveen',
    thumbnail:
      'https://media.sketchfab.com/models/955e210ad22c4b95b37a993b3352b9d8/thumbnails/afd036ff00364f63a59e4750e3953eb1/e9f680ec2bce45ccada88c12c940aac0.jpeg',
  },
  {
    id: 'screw-gauge',
    name: 'Screw gauge',
    measures: 'Thickness of a wire or sheet to 0.01 mm, using a screw thread and a divided thimble.',
    readIt: [
      'Use the ratchet, never the thimble, to close on the wire.',
      'Pitch scale reading + (circular division × least count) − zero error.',
      'One full turn of the thimble advances the spindle by one pitch.',
    ],
    uid: 'ca68f5092e1646d58533a0fc0b38fa55',
    modelTitle: 'Screw gauge',
    author: 'VeeRuby Technologies',
    authorUrl: 'https://sketchfab.com/veerubyinc',
    thumbnail:
      'https://media.sketchfab.com/models/ca68f5092e1646d58533a0fc0b38fa55/thumbnails/0b5e2c244b1545b3a6042474c4b57484/4dbcbf9712dd45179f4037db9bc8df06.jpeg',
  },
  {
    id: 'spherometer',
    name: 'Spherometer',
    measures: 'Radius of curvature of a curved surface, via the sagitta between three legs and a central screw.',
    readIt: [
      'Rest the three legs on a plane glass plate and note the reading.',
      'Repeat on the curved surface — the difference is the sagitta h.',
      'R = l²/6h + h/2, with l the mean spacing of the three legs.',
    ],
    uid: '323ecfd065f94629842bca3c2dd4fe03',
    modelTitle: 'spherometer',
    author: 'asimdurrani9',
    authorUrl: 'https://sketchfab.com/asimdurrani9',
    thumbnail:
      'https://media.sketchfab.com/models/323ecfd065f94629842bca3c2dd4fe03/thumbnails/c4f26dcd9b7f48eda5d4dfa91dde00df/6184108303ab47898bdd34828c45d141.jpeg',
  },
  {
    id: 'simple-pendulum',
    name: 'Simple pendulum',
    measures: 'Acceleration due to gravity, from how the period changes with the length of the thread.',
    readIt: [
      'Measure the length to the centre of the bob, not to the top of it.',
      'Time 20 oscillations and start the watch at the mean position.',
      'Plot T² against L — the slope is 4π²/g.',
    ],
    uid: '7d8f533e06934f0ba59b688ecc554514',
    modelTitle: 'simple pendulum',
    author: 'Astboss36',
    authorUrl: 'https://sketchfab.com/Astboss36',
    thumbnail:
      'https://media.sketchfab.com/models/7d8f533e06934f0ba59b688ecc554514/thumbnails/03c5b8135409459883ea8b6c9cc707f3/d1178650fc5747f49b4d3e8bb73f68c2.jpeg',
  },
];

const InstrumentCard: React.FC<{ instrument: InstrumentModel; isDark: boolean }> = ({
  instrument,
  isDark,
}) => {
  const [loaded, setLoaded] = useState(false);
  const embedUrl =
    `https://sketchfab.com/models/${instrument.uid}/embed` +
    `?autospin=0.3&autostart=1&preload=1&ui_infos=1&ui_watermark_link=1&ui_theme=${isDark ? 'dark' : 'light'}`;

  return (
    <article className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-950">
        {loaded ? (
          <iframe
            title={`${instrument.name} in 3D`}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder={0}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 w-full h-full text-left"
            aria-label={`Load the 3D view of the ${instrument.name.toLowerCase()}`}
          >
            <img
              src={instrument.thumbnail}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-stone-900/85 text-stone-50 text-[13px] font-medium backdrop-blur-sm group-hover:bg-stone-900 transition-colors">
                <Rotate3d className="w-4 h-4" />
                Load 3D
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">{instrument.name}</h3>
          <p className="mt-1 text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed">
            {instrument.measures}
          </p>
        </div>

        <ul className="space-y-1.5">
          {instrument.readIt.map((line) => (
            <li key={line} className="flex gap-2 text-[12.5px] text-stone-600 dark:text-stone-400 leading-relaxed">
              <span className="mt-[7px] w-1 h-1 rounded-full bg-stone-400 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-stone-500 dark:text-stone-500">
            3D model: <span className="text-stone-700 dark:text-stone-300">{instrument.modelTitle}</span> by{' '}
            <a
              href={instrument.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-stone-900 dark:hover:text-stone-100"
            >
              {instrument.author}
            </a>
          </span>
          <a
            href={`https://sketchfab.com/3d-models/${instrument.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            Sketchfab
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
};

export const InstrumentExplorerView: React.FC<InstrumentExplorerViewProps> = ({
  onHome,
  onEnterLab,
  isDark,
  onToggleTheme,
}) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <header className="sticky top-0 z-40 bg-stone-50/85 dark:bg-stone-950/85 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-6 h-[62px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onHome}
              aria-label="Back to the landing page"
              className="w-8 h-8 shrink-0 grid place-items-center rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="w-[26px] h-[26px] shrink-0 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 grid place-items-center font-serif text-[15px] pb-0.5">
              D
            </span>
            <span className="font-semibold tracking-tight text-[15px] truncate">
              DigitalLab2Record
              <span className="hidden sm:inline text-stone-400 dark:text-stone-600 font-normal"> · instrument room</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 grid place-items-center rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onEnterLab}
              className="inline-flex items-center gap-1.5 h-9 pl-3.5 pr-3 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-[13.5px] font-medium whitespace-nowrap hover:bg-black dark:hover:bg-white transition-colors"
            >
              <span className="hidden sm:inline">Open the lab</span>
              <span className="sm:hidden">Lab</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-16">
        <span className="eyebrow">The instrument room</span>
        <h1 className="mt-5 text-[clamp(34px,5vw,60px)] leading-[1.04] max-w-[20ch]">
          Look at the real thing.
          <br />
          <em className="italic">Then go and hold it.</em>
        </h1>
        <p className="mt-6 max-w-[58ch] text-stone-600 dark:text-stone-400 text-[16px] leading-relaxed">
          Rotatable 3D models of the apparatus behind these practicals, made by other people and
          embedded from Sketchfab with credit. Drag to orbit, pinch or scroll to zoom. They are for
          knowing what the instrument looks like before you meet it — not a substitute for the one in
          the cupboard.
        </p>

        <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2">
          {INSTRUMENTS.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} isDark={isDark} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Box className="w-4 h-4 mt-0.5 shrink-0 text-stone-400" />
            <div>
              <h2 className="text-[14px] font-semibold tracking-tight">Only four so far</h2>
              <p className="mt-1 text-[13px] text-stone-600 dark:text-stone-400 max-w-[62ch] leading-relaxed">
                Good open models of a beam balance, a Gravesand's board or a Boyle's law apparatus are
                harder to find than you would think. Search Sketchfab for the rest, and if you find a
                good one, its embed code is a single line here.
              </p>
            </div>
          </div>
          <a
            href="https://sketchfab.com/search?q=physics%20laboratory%20apparatus&type=models"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-[13px] font-medium whitespace-nowrap hover:border-stone-400 dark:hover:border-stone-600 transition-colors shrink-0"
          >
            Browse Sketchfab
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>
    </div>
  );
};
