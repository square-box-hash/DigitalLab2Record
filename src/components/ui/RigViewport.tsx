import React, { useState } from 'react';
import { Maximize2, Minus, Plus } from 'lucide-react';

const STEPS = [1, 1.25, 1.5, 1.75, 2, 2.5];

/**
 * Wrapper for the apparatus drawings.
 *
 * At 100% the SVG is drawn to fit the card, so the whole rig is visible on a
 * phone without sideways scrolling. Zooming widens the drawing past the card and
 * the strip below scrolls, which is what you want when you are trying to read a
 * vernier division rather than admire the whole instrument.
 *
 * The scaling is done with width rather than a transform, so the layout grows
 * with it and nothing overlaps.
 */
export const RigViewport: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(0);

  const zoom = STEPS[step];
  const canZoomIn = step < STEPS.length - 1;
  const canZoomOut = step > 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-600">
          {zoom === 1 ? 'fit to width' : `${Math.round(zoom * 100)}%`}
        </span>

        <div className="flex items-center gap-0.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-0.5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={!canZoomOut}
            aria-label="Zoom out"
            className="w-7 h-7 grid place-items-center rounded-md text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setStep(0)}
            aria-label="Fit the rig to the width of the card"
            className="w-7 h-7 grid place-items-center rounded-md text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canZoomIn}
            aria-label="Zoom in"
            className="w-7 h-7 grid place-items-center rounded-md text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        className="rig-zoom overflow-x-auto overscroll-x-contain"
        style={{ ['--rig-zoom' as string]: String(zoom) }}
      >
        {children}
      </div>
    </div>
  );
};
