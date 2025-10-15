/**
 * Color constants for the SoundBoard app
 * Centralizes all color values to avoid ESLint warnings and improve maintainability
 */

export const Colors = {
  // Primary app colors
  primary: '#5E403F',
  primaryLight: '#A57878',
  primaryDark: '#8A6E6E',

  // UI colors
  text: '#EAE0D5',
  white: '#FFFFFF',
  transparent: 'transparent',

  // Button colors
  button: '#A57878',
  buttonHover: '#A5787850',
  buttonSelected: '#C89F9C',
  buttonSuccess: '#5A9F5A',
  buttonDanger: '#D9534F',
  buttonSecondary: '#646F4B',
  buttonProcessing: '#986A6A',

  // Status colors
  success: '#5A9F5A',
  error: 'tomato',
  warning: '#986A6A',

  // Background colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  modalOverlay: 'rgba(94, 64, 63, 0.8)',
  shadow: '#000',
} as const;

export type ColorKey = keyof typeof Colors;
