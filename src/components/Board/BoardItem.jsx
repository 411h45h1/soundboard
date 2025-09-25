import React, { useEffect, useState, memo, useCallback, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-audio";
import { useIsLandscape, isTablet, normalize } from "../../core/responsive";
import { validateSound } from "../../utils/SoundManager";
import { triggerHaptic, withHaptics } from "../../utils/haptics";

const BoardItem = ({
  sid,
  name,
  title,
  src,
  onPlaySound,
  onEditSound,
  removeSoundboardItem,
}) => {
  const [sound, setSound] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isLandscape = useIsLandscape();
  const isProcessing = useRef(false);
  const hasUnmounted = useRef(false);
  const componentId = useRef(`board-item-${sid}`).current;

  useEffect(() => {
    isProcessing.current = src?._processing || false;

    const checkSoundValidity = async () => {
      try {
        setIsLoading(true);
        const valid = await validateSound({ uri: src });
        if (!hasUnmounted.current) {
          setIsValid(valid);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Error validating sound ${name}:`, error);
        if (!hasUnmounted.current) {
          setIsValid(false);
          setIsLoading(false);
        }
      }
    };

    checkSoundValidity();

    return () => {
      hasUnmounted.current = true;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [src, name]);

  useEffect(() => {
    const stopListener = (e) => {
      if (isPlaying && sound) {
        setIsPlaying(false);
      }
    };

    if (global.soundBoardRegistry) {
      global.soundBoardRegistry[componentId] = stopListener;
    } else {
      global.soundBoardRegistry = {
        [componentId]: stopListener,
      };
    }

    return () => {
      if (global.soundBoardRegistry) {
        delete global.soundBoardRegistry[componentId];
      }
    };
  }, [sound, isPlaying]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = useCallback(async () => {
    if (isPlaying && sound) {
      triggerHaptic("medium");
      try {
        await sound.stopAsync();
        setIsPlaying(false);
        return;
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }

    triggerHaptic("light");

    try {
      console.log("Attempting to play sound. Source URI:", src);

      const valid = await validateSound({ uri: src });
      if (!valid) {
        triggerHaptic("error");
        console.error("Sound file does not exist or is invalid:", src);
        setIsValid(false);
        Alert.alert(
          "Sound Error",
          "This sound file is missing or corrupted. It may have been deleted or moved.",
          [{ text: "OK" }]
        );
        return;
      }

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: src },
        { shouldPlay: true },
        (status) => {
          if (hasUnmounted.current) return;

          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        }
      );

      setSound(newSound);
      setIsPlaying(true);
      onPlaySound(newSound);

      newSound._boardItemId = sid;
      newSound._componentId = componentId;
    } catch (error) {
      triggerHaptic("error");
      console.error("Error playing sound:", error);
      setIsPlaying(false);
      setIsValid(false);
      Alert.alert(
        "Playback Error",
        "Failed to play the sound. The file might be corrupted or missing."
      );
    }
  }, [sound, src, onPlaySound, isPlaying, sid, componentId]);

  const handleLongPress = useCallback(() => {
    triggerHaptic("medium");
    setShowActions((prev) => !prev);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          opacity: isLoading ? 0.7 : isValid ? 1 : 0.5,
          transform: [{ scale: isLoading ? 0.95 : 1 }],
        },
      ]}
    >
      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={withHaptics("selection", () => {
              if (onEditSound) {
                onEditSound({ sid, name, title, src });
              }
              setShowActions(false);
            })}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={withHaptics("warning", () => {
              removeSoundboardItem(sid);
              setShowActions(false);
            })}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.soundButton,
          {
            backgroundColor: isProcessing.current ? "#8A6E6E" : "#A57878",
            borderColor: isPlaying ? "#FFFFFF" : "transparent",
          },
        ]}
        onPress={isLoading ? null : playSound}
        onLongPress={isLoading ? null : handleLongPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#EAE0D5" />
        ) : (
          <Text
            style={[
              styles.soundText,
              {
                fontSize: normalize(17),
              },
            ]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {title || `File: ${name}`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  actionButton: {
    padding: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#646F4B",
    marginRight: 2,
  },
  deleteButton: {
    backgroundColor: "tomato",
    marginLeft: 2,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  soundButton: {
    width: "100%",
    aspectRatio: 1.2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  soundText: {
    fontWeight: "bold",
    color: "#EAE0D5",
    width: "100%",
    textAlign: "center",
    flexWrap: "wrap",
    lineHeight: normalize(18),
  },
});

export default memo(BoardItem);
