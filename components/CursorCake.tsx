'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorCake() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const x = useSpring(mouseX, { damping: 25, stiffness: 120, mass: 0.8 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 120, mass: 0.8 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block select-none"
      style={{ x, y, translateX: 18, translateY: 18 }}
    >
      <span className="text-2xl">🎂</span>
    </motion.div>
  );
}
