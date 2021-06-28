import { Dimensions, Platform, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export const normalize = (size) => {
  const newSize = size * scale;

  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const font = (style) => {
  if (style === "bold") {
    return Platform.OS === "ios"
      ? "AmericanTypewriter-Bold"
      : "sans-serif-condensed";
  } else if ((style = "light")) {
    return Platform.OS === "ios" ? "AmericanTypewriter-Light" : "notoserif";
  } else {
    return Platform.OS === "ios" ? "American Typewriter" : "sans-serif";
  }
};

export const isLargeScreen = SCREEN_WIDTH >= 768;
