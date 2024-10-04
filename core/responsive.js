import { Dimensions, Platform, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const baseWidth = 320;
const scale = SCREEN_WIDTH / baseWidth;

/**
 * Normalize size based on screen width and platform
 * @param {number} size - Original size to normalize
 * @returns {number} - Normalized size based on screen width
 */
export const normalize = (size) => {
  const newSize = size * scale;

  // Differentiate between iOS and Android scaling behavior
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

/**
 * Get platform-specific font family based on style
 * @param {string} style - Font style ('bold', 'light', or default)
 * @returns {string} - Font family name
 */
export const font = (style) => {
  switch (style) {
    case "bold":
      return Platform.OS === "ios"
        ? "AmericanTypewriter-Bold"
        : "sans-serif-condensed";
    case "light":
      return Platform.OS === "ios" ? "AmericanTypewriter-Light" : "notoserif";
    default:
      return Platform.OS === "ios" ? "American Typewriter" : "sans-serif";
  }
};

/**
 * Check if the device is considered a large screen (tablet)
 * @returns {boolean} - True if device is a tablet
 */
export const isLargeScreen = SCREEN_WIDTH >= 768;

/**
 * Get screen dimensions
 * @returns {object} - Object containing screen width and height
 */
export const getScreenDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
});

/**
 * Check if the device is in landscape mode
 * @returns {boolean} - True if the device is in landscape mode
 */
export const isLandscape = () => SCREEN_WIDTH > SCREEN_HEIGHT;

/**
 * Check if the device is a tablet
 * @returns {boolean} - True if the device is a tablet (based on screen size)
 */
export const isTablet = () => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return isLargeScreen && aspectRatio < 1.6; // Typical tablet aspect ratio is around 1.33 (4:3)
};
