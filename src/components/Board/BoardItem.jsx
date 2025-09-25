import React, { useEffect, useState, memo, useCallback, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAudioPlayer } from "expo-audio";
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
  const [showActions, setShowActions] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isLandscape = useIsLandscape();
  const hasUnmounted = useRef(false);
  const componentId = useRef(`board-item-${sid}`).current;

  // Create audio player for this item
  const player = useAudioPlayer();

  useEffect(() => {
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
    };
  }, [src, name]);

  useEffect(() => {
    return () => {
      hasUnmounted.current = true;
    };
  }, []);

  const playSound = useCallback(async () => {
    if (player.playing) {
      triggerHaptic("medium");
      try {
        player.pause();
        return;
      } catch (error) {
        console.error("Error pausing sound:", error);
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

      // Replace the current audio source and play
      player.replace({ uri: src });
      player.play();

      onPlaySound(player);
    } catch (error) {
      triggerHaptic("error");
      console.error("Error playing sound:", error);
      setIsValid(false);
      Alert.alert(
        "Playbook Error",
        "Failed to play the sound. The file might be corrupted or missing."
      );
    }
  }, [player, src, onPlaySound, sid, componentId]);

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
            backgroundColor: "#A57878",
            borderColor: player.playing ? "#FFFFFF" : "transparent",
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
