import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { normalize } from '../../core/responsive';
import { withHaptics } from '../../utils/haptics';
import { StopAllSoundsButtonProps } from '../../types';
import { ComponentStyles, GlobalStyles } from '@/constants/styles';

const StopAllSoundsButton: React.FC<StopAllSoundsButtonProps> = ({ stopAllSounds }) => {
  return (
    <TouchableOpacity
      style={ComponentStyles.stopAllButton}
      onPress={withHaptics('medium', stopAllSounds)}
    >
      <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>Stop All Sounds</Text>
    </TouchableOpacity>
  );
};

export default StopAllSoundsButton;
