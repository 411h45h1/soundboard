import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { validateSound } from "../utils/SoundManager";

export default function SoundPlayer({ soundUri, onPlaybackStatusUpdate }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const checkSoundValidity = async () => {
    const valid = await validateSound({ uri: soundUri });
    setIsValid(valid);
    return valid;
  };

  const playSound = async () => {
    try {
      console.log("Attempting to play sound. Source URI:", soundUri);

      const valid = await checkSoundValidity();
      if (!valid) {
        console.error("Sound file does not exist or is invalid:", soundUri);
        throw new Error(
          "Sound file not found. It may have been deleted or moved."
        );
      }

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true },
        (status) => {
          if (onPlaybackStatusUpdate) {
            onPlaybackStatusUpdate(status);
          }
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      );

      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false);
      throw error;
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return {
    playSound,
    stopSound,
    isPlaying,
    isValid,
  };
}
