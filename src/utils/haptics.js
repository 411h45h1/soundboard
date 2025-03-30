import * as Haptics from "expo-haptics";

/**
 * Provides haptic feedback for various interactions
 * @param {string} type - Type of haptic feedback to trigger
 */
export const triggerHaptic = (type = "medium") => {
  try {
    switch (type) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "selection":
        Haptics.selectionAsync();
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
};

/**
 * Returns a function that triggers haptic feedback when called
 * Useful for direct assignment to onPress handlers
 *
 * @param {string} type - Type of haptic feedback to trigger
 * @param {Function} callback - Function to call after haptic feedback
 * @returns {Function} Function that triggers haptic and calls callback
 */
export const withHaptics = (type = "medium", callback) => {
  return (...args) => {
    triggerHaptic(type);
    if (callback) {
      callback(...args);
    }
  };
};
