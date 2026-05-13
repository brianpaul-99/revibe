'use client';

import { useSyncExternalStore } from 'react';
import { getDeviceSize, type DeviceSize } from '@/lib/breakpoints';

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('resize', onStoreChange, { passive: true });

  return () => {
    window.removeEventListener('resize', onStoreChange);
  };
}

function getSnapshot(): DeviceSize {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  return getDeviceSize(window.innerWidth);
}

function getServerSnapshot(): DeviceSize {
  return 'desktop';
}

export function useDeviceSize() {
  const deviceSize = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    deviceSize,
    isMobile: deviceSize === 'mobile',
    isTablet: deviceSize === 'tablet',
    isDesktop: deviceSize === 'desktop',
    isTabletOrBelow: deviceSize !== 'desktop',
  };
}
