// ...existing code...

import SoundManager from "../utils/SoundManager";
import { useFocusEffect } from "@react-navigation/native";

// ...existing code...

export default function HomeScreen({ navigation }) {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load sounds from storage using SoundManager
  const loadSounds = async () => {
    try {
      setLoading(true);
      const soundsMetadata = await SoundManager.getSoundsMetadata();

      // Validate each sound file exists
      const validatedSounds = [];
      for (const sound of soundsMetadata) {
        const isValid = await SoundManager.validateSound(sound);
        if (isValid) {
          validatedSounds.push(sound);
        }
      }

      setSounds(validatedSounds);
    } catch (error) {
      console.error("Error loading sounds:", error);
      Alert.alert("Error", "Failed to load sounds");
    } finally {
      setLoading(false);
    }
  };

  // Refresh sounds list when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSounds();
    }, [])
  );

  // Function to handle playing sounds
  const handlePlaySound = async (soundUri) => {
    try {
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri: soundUri });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
      Alert.alert(
        "Error",
        "Failed to play sound. The sound file may be missing or corrupted."
      );
    }
  };

  // ...existing code for rendering the UI...

  // Add backup/restore buttons to the UI
  const renderBackupOptions = () => (
    <View style={styles.backupContainer}>
      <Button
        title="Backup Sounds"
        onPress={async () => {
          const success = await SoundManager.exportSoundsBackup();
          if (success) {
            Alert.alert(
              "Success",
              "Sound backup created and shared successfully"
            );
          } else {
            Alert.alert("Error", "Failed to create backup");
          }
        }}
      />
      <Button
        title="Restore Sounds"
        onPress={() => {
          // Implement document picker to select backup file
          // Then call SoundManager.importSoundsFromBackup
        }}
      />
    </View>
  );

  // ...existing code...
}

// ...existing code...
