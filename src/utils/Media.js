
export const MOBILE_MAX_WIDTH = process.env.MOBILE_MAX_WIDTH ? parseInt(process.env.MOBILE_MAX_WIDTH, 10) : 599;
export const TABLET_LANDSCAPE_MAX_WIDTH = process.env.TABLET_LANDSCAPE_MAX_WIDTH ? parseInt(process.env.TABLET_LANDSCAPE_MAX_WIDTH, 10) : 899;
export const TABLET_MAX_WIDTH = process.env.TABLET_MAX_WIDTH ? parseInt(process.env.TABLET_MAX_WIDTH, 10) : 1239;
export const DESKTOP_LARGE_WIDTH = process.env.DESKTOP_LARGE_MAX_WIDTH ? parseInt(process.env.DESKTOP_LARGE_MAX_WIDTH, 10) : 1599;

export const MOBILE_SMALL_MAX_HEIGHT = process.env.MOBILE_MAX_WIDTH ? parseInt(process.env.MOBILE_MAX_WIDTH, 10) : 650;

export const MEDIA_QUERIES = {
  small: { maxWidth: MOBILE_MAX_WIDTH },
  tablet: { maxWidth: TABLET_MAX_WIDTH },
  tabletLandScape: { maxWidth: TABLET_LANDSCAPE_MAX_WIDTH },
  desktopLarge: { maxWidth: DESKTOP_LARGE_WIDTH },
};

