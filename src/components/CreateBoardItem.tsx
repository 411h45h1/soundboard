import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { normalize } from '../core/responsive';
import { AppContext } from '../core/context/AppState';
import { triggerHaptic } from '../utils/haptics';
import { GlobalStyles } from '@/constants/styles';

const CreateBoardItem = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('CreateBoardItem must be used within AppState');
  }
  const { updateSoundBoard } = context;

  const pickAudio = async () => {
    triggerHaptic('selection');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'audio/*',
          'audio/mpeg',
          'audio/wav',
          'audio/x-wav',
          'audio/mp4',
          'audio/aac',
          'audio/ogg',
        ],
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        triggerHaptic('success');
        const { name, uri } = result.assets[0];
        const id = Date.now() + Math.floor(Math.random() * 9000) + 1000;

        updateSoundBoard({ sid: id, name, uri });
      }
    } catch (error) {
      triggerHaptic('error');
      console.error('Error picking audio file:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickAudio}>
      <Text style={[GlobalStyles.textBoldLight, { fontSize: normalize(16) }]}>Add Sound</Text>
    </TouchableOpacity>
  );
};

export default CreateBoardItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
