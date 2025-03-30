import React, { useEffect, useState, memo, useCallback, useRef } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { useIsLandscape, isTablet, normalize } from "../core/responsive";
import { validateSound } from "../src/utils/SoundManager";
import { triggerHaptic, withHaptics } from "../src/utils/haptics";

const { width, height } = Dimensions.get("window");

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
        {
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginVertical: 10,
          width: isTablet() ? normalize(100) : normalize(125),
          opacity: isValid ? 1 : 0.5,
        },
        {
          transform: [{ scale: isLoading ? 0.95 : 1 }],
          opacity: isLoading ? 0.7 : isValid ? 1 : 0.5,
        },
      ]}
    >
      {showActions && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 5,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#646F4B",
              padding: 5,
              borderRadius: 5,
              marginHorizontal: 5,
              flex: 1,
              alignItems: "center",
            }}
            onPress={withHaptics("selection", () => {
              navigation.navigate("Edit", {
                sid,
                fileName: name,
                title,
              });
              setShowActions(false);
            })}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "tomato",
              padding: 5,
              borderRadius: 5,
              marginHorizontal: 5,
              flex: 1,
              alignItems: "center",
            }}
            onPress={withHaptics("warning", () => {
              removeSoundboardItem(sid);
              setShowActions(false);
            })}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={{
          minHeight: isTablet() ? height * 0.2 : height * 0.1,
          width: isTablet() ? width * 0.3 : width * 0.4,
          backgroundColor: isProcessing.current ? "#8A6E6E" : "#A57878",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
          borderWidth: 3,
          borderColor: isPlaying ? "#FFFFFF" : "transparent",
        }}
        onPress={isLoading ? null : playSound}
        onLongPress={isLoading ? null : handleLongPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#EAE0D5" />
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              color: "#EAE0D5",
              width: "100%",
              textAlign: "center",
              flexWrap: "wrap",
              lineHeight: normalize(18),
              fontSize:
                isLandscape && isTablet()
                  ? normalize(10)
                  : title && title.length > 15
                  ? normalize(13)
                  : normalize(15),
            }}
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

export default memo(BoardItem);
