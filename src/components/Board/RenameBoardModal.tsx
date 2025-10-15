import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { normalize } from '../../core/responsive';
import { RenameBoardModalProps } from '../../types';
import { ComponentStyles, GlobalStyles } from '@/constants/styles';

const RenameBoardModal: React.FC<RenameBoardModalProps> = ({
  renameBoardName,
  setRenameBoardName,
  handleRenameBoard,
}) => {
  return (
    <View style={ComponentStyles.createBoardRow}>
      <TextInput
        placeholder="Rename Board"
        value={renameBoardName}
        onChangeText={setRenameBoardName}
        style={GlobalStyles.inputFull}
        placeholderTextColor="#EAE0D580"
      />
      <TouchableOpacity style={GlobalStyles.button} onPress={handleRenameBoard}>
        <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>Rename</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenameBoardModal;
