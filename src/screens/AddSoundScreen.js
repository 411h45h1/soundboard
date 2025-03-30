// ...existing code...

import SoundManager from "../utils/SoundManager";

// ...existing code...

export default function AddSoundScreen({ navigation }) {
  // ...existing code...

  const saveSound = async () => {
    try {
      if (!selectedSound) {
        Alert.alert("Error", "Please select a sound file");
        return;
      }

      if (!soundName.trim()) {
        Alert.alert("Error", "Please enter a name for the sound");
        return;
      }

      setIsSaving(true);

      // Save sound using SoundManager
      await SoundManager.addSound(
        selectedSound.uri,
        soundName.trim(),
        category || "Uncategorized"
      );

      setIsSaving(false);
      Alert.alert("Success", "Sound saved successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving sound:", error);
      setIsSaving(false);
      Alert.alert("Error", "Failed to save sound: " + error.message);
    }
  };

  // ...existing code...
}

// ...existing code...
