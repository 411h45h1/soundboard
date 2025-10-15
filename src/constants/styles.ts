import { StyleSheet } from 'react-native';
import { Colors } from './colors';

/**
 * Reusable style constants for the SoundBoard app
 * Eliminates inline styles and improves maintainability
 */

export const GlobalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  containerWithPadding: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
  },

  containerWithPaddingSmall: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: 5,
  },

  // Layout styles
  row: {
    flexDirection: 'row',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text styles
  textBold: {
    fontWeight: 'bold',
  },

  textLight: {
    color: Colors.text,
  },

  textWhite: {
    color: Colors.white,
  },

  textBoldLight: {
    fontWeight: 'bold',
    color: Colors.text,
  },

  textCenter: {
    textAlign: 'center',
  },

  textLeft: {
    textAlign: 'left',
  },

  // Button styles
  button: {
    backgroundColor: Colors.button,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },

  buttonRounded: {
    backgroundColor: Colors.button,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonDanger: {
    backgroundColor: Colors.buttonDanger,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonSecondary: {
    backgroundColor: Colors.buttonSecondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonTransparent: {
    borderRadius: 10,
    backgroundColor: Colors.buttonHover,
    padding: 7,
  },

  // Input styles
  input: {
    backgroundColor: Colors.button,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    color: Colors.text,
  },

  inputFull: {
    flex: 1,
    backgroundColor: Colors.button,
    height: '100%',
    borderRadius: 5,
    paddingLeft: 10,
    color: Colors.white,
  },

  // Modal styles
  modalContainer: {
    backgroundColor: Colors.button,
    borderRadius: 10,
    padding: 20,
  },

  // Margin and padding utilities
  marginBottom5: { marginBottom: 5 },
  marginBottom10: { marginBottom: 10 },
  marginBottom15: { marginBottom: 15 },
  marginBottom20: { marginBottom: 20 },
  marginBottom30: { marginBottom: 30 },
  marginTop5: { marginTop: 5 },
  marginTop10: { marginTop: 10 },
  marginTop15: { marginTop: 15 },
  marginRight10: { marginRight: 10 },

  padding5: { padding: 5 },
  padding10: { padding: 10 },
  padding20: { padding: 20 },
  paddingHorizontal10: { paddingHorizontal: 10 },
  paddingHorizontal15: { paddingHorizontal: 15 },
  paddingVertical5: { paddingVertical: 5 },
  paddingVertical10: { paddingVertical: 10 },
  paddingVertical12: { paddingVertical: 12 },

  // Position styles
  alignSelfStart: { alignSelf: 'flex-start' },
  alignItemsStart: { alignItems: 'flex-start' },

  // Shadow styles
  shadow: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export const ComponentStyles = StyleSheet.create({
  // Board header styles
  boardHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Board controls styles
  boardControlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  boardControlsPanel: {
    backgroundColor: Colors.button,
    borderRadius: 5,
    paddingTop: 10,
    marginBottom: 10,
  },

  boardControlsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  // Board select panel styles
  boardSelectItem: {
    backgroundColor: Colors.buttonSelected,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  boardSelectItemActive: {
    backgroundColor: Colors.buttonSuccess,
  },

  // Create/rename board modal styles
  createBoardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  // Stop all sounds button styles
  stopAllButton: {
    backgroundColor: Colors.buttonDanger,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
