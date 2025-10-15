import React from 'react';
import { Text, TouchableOpacity, ScrollView, Pressable, StyleSheet } from 'react-native';
import { normalize } from '../../core/responsive';
import { withHaptics } from '../../utils/haptics';
import { InstructionsProps } from '../../types';
import { GlobalStyles } from '@/constants/styles';
import { Colors } from '@/constants/colors';

const Instructions: React.FC<InstructionsProps> = ({ setShowInstructions }) => {
  return (
    <ScrollView style={GlobalStyles.padding10}>
      <Pressable>
        <Text style={[styles.title, { fontSize: normalize(18) }]}>How to Use SoundBoard</Text>

        <Text style={[styles.instructionText, { fontSize: normalize(14) }]}>
          • <Text style={GlobalStyles.textBold}>Play a sound:</Text> Tap on any sound tile
        </Text>

        <Text style={[styles.instructionText, { fontSize: normalize(14) }]}>
          • <Text style={GlobalStyles.textBold}>Stop a sound:</Text> Tap the sound tile again while
          it&apos;s playing
        </Text>

        <Text style={[styles.instructionText, { fontSize: normalize(14) }]}>
          • <Text style={styles.boldText}>Edit a sound:</Text> Long-press on a sound tile, then tap
          &quot;Edit&quot;
        </Text>

        <Text style={[styles.instructionText, { fontSize: normalize(14) }]}>
          • <Text style={styles.boldText}>Delete a sound:</Text> Long-press on a sound tile, then
          tap &quot;Delete&quot;
        </Text>

        <Text style={[styles.instructionText, { fontSize: normalize(14) }]}>
          • <Text style={styles.boldText}>Add a sound:</Text> Tap &quot;Add Sound&quot; in the
          controls
        </Text>

        <Text style={[styles.instructionText, { fontSize: normalize(14) }]}>
          • <Text style={styles.boldText}>Record a sound:</Text> Tap &quot;Record&quot;, then tap
          again to stop recording
        </Text>

        <Text style={[styles.instructionText, { fontSize: normalize(14) }]}>
          • <Text style={styles.boldText}>Stop all sounds:</Text> Tap &quot;Stop All Sounds&quot;
          button
        </Text>

        <Text style={[styles.instructionText, { fontSize: normalize(14) }]}>
          • <Text style={styles.boldText}>Switch boards:</Text> Tap &quot;Select Board&quot;, then
          choose a board
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={withHaptics('selection', () => setShowInstructions(false))}
        >
          <Text style={[styles.buttonText, { fontSize: normalize(16) }]}>Got it!</Text>
        </TouchableOpacity>
      </Pressable>
    </ScrollView>
  );
};

export default Instructions;

const styles = StyleSheet.create({
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionText: {
    color: Colors.text,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.buttonSecondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
});
