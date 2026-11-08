import React from 'react';

export type HandState = 'idle' | 'drag' | 'zoom';

interface LabHandCursorProps {
  state: HandState;
  /** Position of the pointer inside the viewer, in CSS pixels. Null when outside. */
  position: { x: number; y: number } | null;
}

/**
 * The viewer's own cursor. The canvas sets `cursor: none`, so this is the only
 * pointer the student ever sees over the model — which means it can be drawn to
 * say what the next gesture will do:
 *
 *   idle  an open hand, ready to grab the instrument
 *   drag  a clenched fist, because you are holding it and turning it
 *   zoom  thumb and index pinched, because you are moving closer or further
 *
 * Drawn from primitives rather than a webfont so it renders identically on
 * every machine and never waits on a network request.
 */
export const LabHandCursor: React.FC<LabHandCursorProps> = ({ state, position }) => {
  if (!position) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 origin-top-left transition-transform duration-150 ease-out motion-reduce:transition-none"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-7px, -3px) scale(${state === 'idle' ? 1 : 1.14})`,
      }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        className="drop-shadow-[0_1px_2px_rgba(28,25,23,0.5)]"
      >
        <g fill="#fafaf9" stroke="#1c1917" strokeWidth="1.3" strokeLinejoin="round">
          {state === 'idle' && <OpenHand />}
          {state === 'drag' && <Fist />}
          {state === 'zoom' && <Pinch />}
        </g>
      </svg>
    </div>
  );
};

const OpenHand: React.FC = () => (
  <>
    <rect x="9.5" y="15" width="14" height="12.5" rx="5.2" />
    <rect x="9.8" y="7.2" width="3.1" height="10.5" rx="1.55" />
    <rect x="13.8" y="4.8" width="3.1" height="12.9" rx="1.55" />
    <rect x="17.8" y="5.8" width="3.1" height="11.9" rx="1.55" />
    <rect x="21.7" y="8.4" width="3.1" height="9.3" rx="1.55" />
    <rect
      x="5.4"
      y="16.2"
      width="3.1"
      height="8.4"
      rx="1.55"
      transform="rotate(-24 7 20.4)"
    />
  </>
);

const Fist: React.FC = () => (
  <>
    <rect x="7.6" y="10.6" width="16.6" height="14.4" rx="6" />
    <circle cx="12" cy="11" r="2.5" />
    <circle cx="16.4" cy="10.4" r="2.5" />
    <circle cx="20.7" cy="11" r="2.5" />
    <rect x="9.4" y="15.9" width="13.4" height="4.1" rx="2.05" transform="rotate(-6 16.1 18)" />
  </>
);

const Pinch: React.FC = () => (
  <>
    <rect x="10.2" y="16.4" width="13.2" height="12" rx="5.2" />
    <rect x="9.1" y="8.4" width="3.1" height="10.2" rx="1.55" transform="rotate(20 10.6 13.5)" />
    <rect x="18.6" y="9.2" width="3.1" height="9.4" rx="1.55" transform="rotate(-30 20.1 13.9)" />
    <circle cx="16.4" cy="7.8" r="1.9" />
  </>
);
