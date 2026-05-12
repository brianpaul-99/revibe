export const BREAKPOINTS = {
  mobileMax: 767,
  tabletMin: 768,
  tabletMax: 1023,
  desktopMin: 1024,
} as const;

export type DeviceSize = 'mobile' | 'tablet' | 'desktop';

export const DEVICE_MEDIA = {
  mobile: `(max-width: ${BREAKPOINTS.mobileMax}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`,
  tabletAndBelow: `(max-width: ${BREAKPOINTS.tabletMax}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktopMin}px)`,
} as const;

export function getDeviceSize(width: number): DeviceSize {
  if (width <= BREAKPOINTS.mobileMax) {
    return 'mobile';
  }

  if (width <= BREAKPOINTS.tabletMax) {
    return 'tablet';
  }

  return 'desktop';
}
