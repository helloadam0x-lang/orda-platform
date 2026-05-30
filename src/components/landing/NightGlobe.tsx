'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function NightGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionStart = useRef<number>(0);

  const rX = useMotionValue(0);
  const rY = useMotionValue(0.25);

  const springX = useSpring(rX, { stiffness: 280, damping: 30, mass: 1 });
  const springY = useSpring(rY, { stiffness: 280, damping: 30, mass: 1 });

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.1,
      mapSamples: 18000,
      mapBrightness: 5,
      baseColor: [0.04, 0.04, 0.06],
      markerColor: [0.831, 0.659, 0.325],
      glowColor: [0.12, 0.10, 0.06],
      markers: [
        { location: [40.7128, -74.006], size: 0.10 },
        { location: [51.5074, -0.1278], size: 0.09 },
        { location: [25.2048, 55.2708], size: 0.08 },
        { location: [35.6762, 139.6503], size: 0.09 },
        { location: [48.8566, 2.3522], size: 0.07 },
        { location: [1.3521, 103.8198], size: 0.07 },
        { location: [-33.8688, 151.2093], size: 0.07 },
        { location: [0.3476, 32.5825], size: 0.14 },
        { location: [6.5244, 3.3792], size: 0.08 },
        { location: [-1.2921, 36.8219], size: 0.08 },
        { location: [19.076, 72.8777], size: 0.08 },
        { location: [-23.5505, -46.6333], size: 0.08 },
        { location: [52.52, 13.405], size: 0.06 },
        { location: [-33.9249, 18.4241], size: 0.07 },
        { location: [55.7558, 37.6176], size: 0.07 },
        { location: [37.7749, -122.4194], size: 0.08 },
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.0025;
        }
        state.phi = phi + springX.get();
        state.theta = springY.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [springX, springY]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      className="relative w-full max-w-[600px] aspect-square mx-auto flex items-center justify-center"
    >
      <div
        className="absolute inset-0 -z-10 pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 60%)',
          filter: 'blur(40px)'
        }}
      />
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionStart.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing';
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
          }
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionStart.current = delta;
            rX.set(delta / 200);
          }
        }}
        className="w-full h-full cursor-grab outline-none"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </motion.div>
  );
}
