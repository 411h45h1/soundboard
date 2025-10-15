import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { normalize } from '../../core/responsive';
import { CreateBoardModalProps } from '../../types';
import { ComponentStyles, GlobalStyles } from '@/constants/styles';
import { Colors } from '@/constants/colors';

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  newBoardName,
  setNewBoardName,
  handleCreateBoard,
}) => {
  return (
    <View style={ComponentStyles.createBoardRow}>
      <TextInput
        placeholder="New Board Name"
        value={newBoardName}
        onChangeText={setNewBoardName}
        style={GlobalStyles.inputFull}
        placeholderTextColor={Colors.text + '80'}
      />
      <TouchableOpacity style={GlobalStyles.button} onPress={handleCreateBoard}>
        <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateBoardModal;
