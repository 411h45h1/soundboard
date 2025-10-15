import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { normalize } from '../../core/responsive';
import { withHaptics } from '../../utils/haptics';
import CreateBoardItem from '../CreateBoardItem';
import { BoardControlsProps, BoardControlsPanelProps } from '../../types';
import { ComponentStyles, GlobalStyles } from '@/constants/styles';
import { Colors } from '@/constants/colors';

const BoardControls: React.FC<BoardControlsProps> & {
  ControlPanel: React.FC<BoardControlsPanelProps>;
} = ({ showSelectBoard, setShowSelectBoard, showControls, setShowControls }) => {
  return (
    <View style={ComponentStyles.boardControlsHeader}>
      <TouchableOpacity
        style={GlobalStyles.buttonTransparent}
        onPress={withHaptics('selection', () => setShowSelectBoard(!showSelectBoard))}
      >
        <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>
          {showSelectBoard ? 'Hide Select Board' : 'Select Board'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={GlobalStyles.buttonTransparent}
        onPress={withHaptics('selection', () => {
          setShowControls(!showControls);
        })}
      >
        <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>
          {showControls ? 'Hide Controls' : 'Controls'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Sub-component for control panel
const ControlPanel: React.FC<BoardControlsPanelProps> = ({
  setShowInstructions,
  setShowCreateBoard,
  showCreateBoard,
  setShowRenameBoard,
  showRenameBoard,
  handleDeleteBoard,
}) => {
  return (
    <View>
      <Text style={[styles.controlsTitle, { fontSize: normalize(16) }]}>Controls:</Text>
      <ScrollView
        horizontal
        style={ComponentStyles.boardControlsPanel}
        contentContainerStyle={ComponentStyles.boardControlsRow}
      >
        <TouchableOpacity
          style={GlobalStyles.buttonRounded}
          onPress={withHaptics('selection', () => setShowInstructions(true))}
        >
          <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>
            Instructions
          </Text>
        </TouchableOpacity>
        <CreateBoardItem />
        <TouchableOpacity
          style={GlobalStyles.buttonRounded}
          onPress={() => setShowCreateBoard(!showCreateBoard)}
        >
          <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>Add Board</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.buttonRounded}
          onPress={() => setShowRenameBoard(!showRenameBoard)}
        >
          <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>
            Rename Board
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[GlobalStyles.buttonRounded, { backgroundColor: Colors.buttonDanger }]}
          onPress={handleDeleteBoard}
        >
          <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>
            Delete Board
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Attach the ControlPanel as a property
BoardControls.ControlPanel = ControlPanel;

const styles = StyleSheet.create({
  controlsTitle: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
});

export default BoardControls;
