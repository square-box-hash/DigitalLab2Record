import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LabHandCursor, type HandState } from './LabHandCursor';

interface ModelViewer3DProps {
  /** Path to a self-hosted .glb, e.g. /models/screw-gauge.glb */
  modelUrl: string;
  /** Human name of the instrument, used for the accessible label. */
  label: string;
  /** Called when the model cannot be loaded, so the card can fall back to the Sketchfab embed. */
  onFail: () => void;
}

const MIN_DISTANCE = 1.5;
const MAX_DISTANCE = 9;
const IDLE_BEFORE_SPIN_MS = 2400;
/** How long the pinch hand stays up after the last zoom step. */
const ZOOM_HAND_MS = 520;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * A three.js viewer for models we host ourselves.
 *
 * The point of owning the renderer is the pointer: inside a Sketchfab iframe
 * the cursor belongs to them and drag and wheel events never reach this page,
 * so a hand that opens into a fist cannot be drawn. Here the canvas sets
 * `cursor: none` and every gesture is ours to read, which is what lets
 * LabHandCursor say what the next move will do.
 *
 * three.js is imported dynamically so it stays out of the main bundle — this
 * card is the only place in the app that needs it.
 */
export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({ modelUrl, label, onFail }) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const zoomTimer = useRef<number | null>(null);
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [hand, setHand] = useState<HandState>('idle');
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let frame = 0;
    let renderer: import('three').WebGLRenderer | null = null;
    let scene: import('three').Scene | null = null;
    let camera: import('three').PerspectiveCamera | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const orbit = {
      azimuth: 0.65,
      polar: 1.12,
      distance: 4.4,
      dragging: false,
      pointers: new Map<number, { x: number; y: number }>(),
      pinchDistance: 0,
      lastX: 0,
      lastY: 0,
      lastInteraction: performance.now(),
    };

    const settleHand = () => setHand(orbit.dragging ? 'drag' : 'idle');

    const showZoomHand = () => {
      setHand('zoom');
      if (zoomTimer.current) window.clearTimeout(zoomTimer.current);
      zoomTimer.current = window.setTimeout(() => {
        zoomTimer.current = null;
        settleHand();
      }, ZOOM_HAND_MS);
    };

    const trackCursor = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const onPointerDown = (event: PointerEvent) => {
      trackCursor(event);
      host.setPointerCapture(event.pointerId);
      orbit.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      orbit.lastInteraction = performance.now();

      if (orbit.pointers.size === 2) {
        const [a, b] = [...orbit.pointers.values()];
        orbit.pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
        orbit.dragging = false;
        setHand('zoom');
        return;
      }

      orbit.dragging = true;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;
      setHand('drag');
    };

    const onPointerMove = (event: PointerEvent) => {
      trackCursor(event);
      if (!orbit.pointers.has(event.pointerId)) return;

      orbit.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      orbit.lastInteraction = performance.now();

      if (orbit.pointers.size === 2) {
        const [a, b] = [...orbit.pointers.values()];
        const spread = Math.hypot(a.x - b.x, a.y - b.y);
        if (orbit.pinchDistance > 0 && spread > 0) {
          orbit.distance = clamp(
            orbit.distance * (orbit.pinchDistance / spread),
            MIN_DISTANCE,
            MAX_DISTANCE
          );
        }
        orbit.pinchDistance = spread;
        return;
      }

      if (!orbit.dragging) return;
      orbit.azimuth -= (event.clientX - orbit.lastX) * 0.008;
      orbit.polar = clamp(orbit.polar - (event.clientY - orbit.lastY) * 0.008, 0.22, Math.PI - 0.22);
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      orbit.pointers.delete(event.pointerId);
      if (orbit.pointers.size < 2) orbit.pinchDistance = 0;
      if (orbit.pointers.size === 0) {
        orbit.dragging = false;
        settleHand();
      }
    };

    const onPointerLeave = () => {
      setCursor(null);
      orbit.dragging = false;
      orbit.pointers.clear();
      orbit.pinchDistance = 0;
      setHand('idle');
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      orbit.lastInteraction = performance.now();
      orbit.distance = clamp(
        orbit.distance * (1 + event.deltaY * 0.0015),
        MIN_DISTANCE,
        MAX_DISTANCE
      );
      showZoomHand();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step = 0.16;
      switch (event.key) {
        case 'ArrowLeft':
          orbit.azimuth -= step;
          break;
        case 'ArrowRight':
          orbit.azimuth += step;
          break;
        case 'ArrowUp':
          orbit.polar = clamp(orbit.polar - step, 0.22, Math.PI - 0.22);
          break;
        case 'ArrowDown':
          orbit.polar = clamp(orbit.polar + step, 0.22, Math.PI - 0.22);
          break;
        case '+':
        case '=':
          orbit.distance = clamp(orbit.distance * 0.9, MIN_DISTANCE, MAX_DISTANCE);
          showZoomHand();
          event.preventDefault();
          orbit.lastInteraction = performance.now();
          return;
        case '-':
        case '_':
          orbit.distance = clamp(orbit.distance * 1.1, MIN_DISTANCE, MAX_DISTANCE);
          showZoomHand();
          event.preventDefault();
          orbit.lastInteraction = performance.now();
          return;
        default:
          return;
      }
      event.preventDefault();
      orbit.lastInteraction = performance.now();
      setHand('drag');
    };

    const onKeyUp = () => settleHand();

    host.addEventListener('pointerdown', onPointerDown);
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerup', onPointerUp);
    host.addEventListener('pointercancel', onPointerUp);
    host.addEventListener('pointerleave', onPointerLeave);
    host.addEventListener('wheel', onWheel, { passive: false });
    host.addEventListener('keydown', onKeyDown);
    host.addEventListener('keyup', onKeyUp);

    (async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (disposed) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      host.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x57534e, 2.2));
      const key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(4, 6, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffffff, 1.2);
      rim.position.set(-5, -3, -4);
      scene.add(rim);

      const resize = () => {
        if (!renderer || !camera) return;
        const width = host.clientWidth || 1;
        const height = host.clientHeight || 1;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          if (disposed || !scene) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const centre = box.getCenter(new THREE.Vector3());
          model.position.sub(centre);
          const largest = Math.max(size.x, size.y, size.z) || 1;
          model.scale.setScalar(2.2 / largest);
          scene.add(model);
          setStatus('ready');
        },
        undefined,
        () => {
          if (disposed) return;
          setStatus('error');
          onFailRef.current();
        }
      );

      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!renderer || !scene || !camera) return;

        const idle =
          !orbit.dragging &&
          orbit.pointers.size === 0 &&
          performance.now() - orbit.lastInteraction > IDLE_BEFORE_SPIN_MS;
        if (idle) orbit.azimuth += 0.0021;

        const { azimuth, polar, distance } = orbit;
        camera.position.set(
          distance * Math.sin(polar) * Math.sin(azimuth),
          distance * Math.cos(polar),
          distance * Math.sin(polar) * Math.cos(azimuth)
        );
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      tick();
    })();

    return () => {
      disposed = true;
      if (zoomTimer.current) window.clearTimeout(zoomTimer.current);
      cancelAnimationFrame(frame);
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerup', onPointerUp);
      host.removeEventListener('pointercancel', onPointerUp);
      host.removeEventListener('pointerleave', onPointerLeave);
      host.removeEventListener('wheel', onWheel);
      host.removeEventListener('keydown', onKeyDown);
      host.removeEventListener('keyup', onKeyUp);
      resizeObserver?.disconnect();

      if (scene) {
        scene.traverse((object) => {
          const mesh = object as import('three').Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const material = mesh.material;
          if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
          else material?.dispose();
        });
      }
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, [modelUrl]);

  return (
    <div
      ref={hostRef}
      tabIndex={0}
      role="application"
      aria-label={`${label} in 3D. Drag to rotate, scroll or pinch to zoom. Arrow keys rotate, plus and minus zoom.`}
      className="absolute inset-0 touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
      style={{ cursor: 'none' }}
    >
      {status === 'loading' && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
        </div>
      )}

      {status === 'ready' && (
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-stone-900/70 px-2.5 py-1 text-[10.5px] font-medium text-stone-100 backdrop-blur-sm">
          drag to turn · scroll to zoom
        </span>
      )}

      <LabHandCursor state={hand} position={cursor} />
    </div>
  );
};
