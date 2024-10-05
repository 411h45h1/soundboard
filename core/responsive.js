import { Dimensions, Platform, PixelRatio } from "react-native";
import { useEffect, useState } from "react";

// Get the initial screen dimensions
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
 * Get screen dimensions dynamically
 * @returns {object} - Object containing screen width and height
 */
export const getScreenDimensions = () => Dimensions.get("window");

/**
 * Check if the device is in landscape mode dynamically
 * @returns {boolean} - True if the device is in landscape mode
 */
export const isLandscape = () => {
  const { width, height } = Dimensions.get("window");
  return width > height;
};

/**
 * Custom hook to track the orientation and respond to screen changes
 * @returns {boolean} - True if the device is in landscape mode
 */
export const useIsLandscape = () => {
  const [landscape, setLandscape] = useState(isLandscape());

  useEffect(() => {
    const onChange = ({ window: { width, height } }) => {
      setLandscape(width > height);
    };

    // Listen to changes in dimensions
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      // Clean up the event listener
      subscription?.remove();
    };
  }, []);

  return landscape;
};

/**
 * Check if the device is a tablet
 * @returns {boolean} - True if the device is a tablet (based on screen size)
 */
export const isTablet = () => {
  const { width, height } = Dimensions.get("window");
  const aspectRatio = height / width;
  return width >= 768 && aspectRatio < 1.6; // Typical tablet aspect ratio is around 1.33 (4:3)
};
