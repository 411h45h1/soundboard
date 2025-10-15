import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { normalize } from '../../core/responsive';
import { withHaptics } from '../../utils/haptics';
import { BoardSelectPanelProps } from '../../types';
import { ComponentStyles, GlobalStyles } from '@/constants/styles';
import { Colors } from '@/constants/colors';

const BoardSelectPanel: React.FC<BoardSelectPanelProps> = ({
  boards,
  currentBoard,
  switchBoard,
}) => {
  return (
    <View style={GlobalStyles.marginBottom10}>
      <Text style={[styles.title, { fontSize: normalize(16) }]}>Select Board:</Text>
      <ScrollView
        horizontal
        contentContainerStyle={GlobalStyles.rowCenter}
        showsHorizontalScrollIndicator={false}
      >
        {boards.map(board => (
          <TouchableOpacity
            key={board.id}
            style={[
              ComponentStyles.boardSelectItem,
              currentBoard && currentBoard.id === board.id && ComponentStyles.boardSelectItemActive,
            ]}
            onPress={withHaptics('selection', () => switchBoard(board.id))}
          >
            <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>
              {board.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
});

export default BoardSelectPanel;
