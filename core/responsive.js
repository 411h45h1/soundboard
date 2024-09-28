import { Dimensions, Platform, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base scale for a standard device (iPhone 5s)
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

// Check if the device is a large screen (e.g., tablets)
export const isLargeScreen = SCREEN_WIDTH >= 768;

/**
 * Get screen dimensions
 * @returns {object} - Object containing screen width and height
 */
export const getScreenDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
});
