import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Audio } from "expo-av";
import { normalize } from "../core/responsive";

const BoardItem = ({
  sid,
  name,
  title,
  src,
  onPlaySound,
  navigation,
  removeSoundboardItem,
}) => {
  const [sound, setSound] = useState(null);
  const [showActions, setShowActions] = useState(false);

  const playSound = async () => {
    try {
      console.log("Attempting to play sound. Source URI:", src);
      const { sound } = await Audio.Sound.createAsync(
        { uri: src },
        { shouldPlay: true }
      );
      setSound(sound);
      onPlaySound(sound);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log("Sound playback finished.");
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleLongPress = () => {
    setShowActions((prev) => !prev);
  };

  return (
    <View style={styles.cont}>
      {showActions && (
        <View style={styles.actionMenu}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              navigation.navigate("Edit", {
                sid,
                fileName: name,
                title,
              });
              setShowActions(false);
            }}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              removeSoundboardItem(sid);
              setShowActions(false);
            }}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.soundButton}
        onPress={playSound}
        onLongPress={handleLongPress}
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
    minHeight: "20%",
    width: "100%",
    borderWidth: 2,
    backgroundColor: "#EAE0D5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  soundBoardText: {
    fontWeight: "bold",
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
  actionMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: "#646F4B",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "tomato",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },
});
