import React, { useState, useContext } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { AppContext } from "../core/context/AppState";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsLandscape, isTablet, normalize } from "../core/responsive";

const getDaySuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const RecordAudioButton = () => {
  const [recording, setRecording] = useState(null);
  const { updateSoundBoard, currentBoard } = useContext(AppContext);

  const isLandscape = useIsLandscape();

  const formatRecordingTitle = () => {
    const now = new Date();
    const day = now.getDate();
    const daySuffix = getDaySuffix(day);

    const formattedDate = now.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    return `Mic Recording ${formattedDate.replace(day, `${day}${daySuffix}`)}`;
  };

  const startRecording = async () => {
    try {
      console.log("Requesting audio permission...");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        console.error("Permission to access microphone denied");
        return;
      }

      console.log("Starting recording...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      console.warn("No active recording to stop");
      return;
    }

    try {
      console.log("Stopping recording...");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);

      const soundObj = {
        sid: Date.now(),
        uri,
        name: "Mic Recording",
        title: formatRecordingTitle(),
      };

      if (currentBoard) {
        updateSoundBoard(soundObj);
      }

      setRecording(null);
    } catch (error) {
      console.error("Error stopping recording", error);
    }
  };

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    startRecording();
  };

  const handlePressOut = () => {
    stopRecording();
  };

  return (
    <Pressable
      style={[
        styles.recordButton,
        { backgroundColor: recording ? "#D9534F" : "#A57878" },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={[
          styles.recordText,
          {
            fontSize: isLandscape && isTablet() ? normalize(10) : normalize(16),
          },
        ]}
      >
        Record
      </Text>
      <MaterialIcons
        name="fiber-manual-record"
        size={normalize(20)}
        color={"#EAE0D5"}
      />
    </Pressable>
  );
};

export default RecordAudioButton;

const styles = StyleSheet.create({
  recordButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordText: {
    color: "#EAE0D5",
    fontWeight: "bold",
  },
});
