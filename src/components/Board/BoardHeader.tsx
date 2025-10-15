import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { normalize } from '../../core/responsive';
import { BoardHeaderProps } from '../../types';
import { ComponentStyles } from '@/constants/styles';
import { Colors } from '@/constants/colors';

const BoardHeader: React.FC<BoardHeaderProps> = ({ isLandscape }) => {
  return (
    <View style={ComponentStyles.boardHeader}>
      <Text style={[styles.title, { fontSize: isLandscape ? normalize(10) : normalize(35) }]}>
        SoundBoard
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: Colors.text,
  },
});

export default BoardHeader;
