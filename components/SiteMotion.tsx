'use client';

import { useEffect } from 'react';
import { initFluid } from '@/lib/fluid';
import { initMotion } from '@/lib/motion';

/** Starts the hero ink and every scroll/canvas animation on the page. Renders nothing. */
export default function SiteMotion() {
  useEffect(() => {
    const stopFluid = initFluid();
    const stopMotion = initMotion();
    return () => {
      stopFluid();
      stopMotion();
    };
  }, []);
  return null;
}
