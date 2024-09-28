import React, { useEffect, useContext, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { normalize } from "../core/responsive";
import { AppContext } from "../core/context/AppState";

const BoardItem = ({ sid, name, title, navigation, src }) => {
  const context = useContext(AppContext);
  const { removeSoundboardItem } = context;
  const [sound, setSound] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  // Configure audio mode to allow playback
  const configureAudio = async () => {
    try {
      console.log("Configuring audio settings...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false,
      });
      console.log("Audio settings configured.");
    } catch (error) {
      console.error("Error configuring audio mode:", error);
    }
  };

  // Function to play sound
  const playSound = async () => {
    try {
      console.log("Attempting to play sound. Source URI:", src);

      await configureAudio(); // Ensure the audio mode is configured

      const { sound } = await Audio.Sound.createAsync(
        { uri: src },
        { shouldPlay: true }
      );
      setSound(sound);

      console.log("Sound object created:", sound);

      // Monitor playback status
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isPlaying) {
          console.log("Sound is playing...");
        } else if (status.didJustFinish) {
          console.log("Sound playback finished.");
          sound.unloadAsync(); // Unload sound when finished
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Clean up sound on component unmount
  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading sound...");
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Toggle delete/edit view with timeout
  useEffect(() => {
    if (showDelete) {
      const timer = setTimeout(() => setShowDelete(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDelete]);

  return (
    <View style={styles.cont}>
      {showDelete && (
        <View style={styles.modArea}>
          <TouchableOpacity
            style={styles.edit}
            onPress={() =>
              navigation.navigate("Edit", {
                sid,
                fileName: name,
                title,
              })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.delete}
            onPress={() => removeSoundboardItem(sid)}
          >
            <Text style={styles.buttonText}>Delete?</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.soundButton}
        onPress={playSound}
        onLongPress={() => setShowDelete(!showDelete)}
      >
        {title ? (
          <Text style={styles.soundBoardText}>{title}</Text>
        ) : (
          <Text style={styles.soundBoardText}>File: {name}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BoardItem;

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 5,

    ...Platform.select({
      ios: {
        fontSize: normalize(12),
      },
      android: {
        fontSize: normalize(12),
      },
      default: {
        fontSize: "1.6vw",
      },
    }),
  },

  cont: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 15,

    ...Platform.select({
      ios: {
        width: normalize(125),
      },
      android: {
        width: normalize(125),
      },
      default: {
        width: "15vw",
        marginHorizontal: 5,
      },
    }),
  },

  soundButton: {
    padding: 2,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#646F4B",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  soundBoardText: {
    fontWeight: "bold",
    color: "white",
    marginVertical: 25,
    ...Platform.select({
      ios: {
        fontSize: normalize(15),
      },
      android: {
        fontSize: normalize(15),
      },
      default: {
        fontSize: "1.9vw",
      },
    }),
  },

  modArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  delete: {
    margin: 2,
    padding: 5,
    backgroundColor: "tomato",
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },

  edit: {
    margin: 2,
    padding: 5,
    backgroundColor: "#646F4B",
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },
});
