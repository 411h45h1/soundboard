import React, { useState, useContext, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  View,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { AppContext } from "../core/context/AppState";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsLandscape, isTablet, normalize } from "../core/responsive";
import { triggerHaptic } from "../src/utils/haptics";

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
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const { updateSoundBoard, currentBoard } = useContext(AppContext);
  const recordingStartTimeRef = useRef(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef(null);

  const isLandscape = useIsLandscape();

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (recording && isRecording) {
        stopRecording(true);
      }
    };
  }, [recording, isRecording]);

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
      if (isRecording || isInitializing || isStopping) {
        console.log("Recording operation already in progress");
        return;
      }

      triggerHaptic("heavy");
      setIsInitializing(true);
      console.log("Requesting audio permission...");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        console.error("Permission to access microphone denied");
        setIsInitializing(false);
        return;
      }

      console.log("Starting recording...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setIsInitializing(false);
      recordingStartTimeRef.current = Date.now();
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const elapsed = Math.floor(
            (Date.now() - recordingStartTimeRef.current) / 1000
          );
          setRecordingDuration(elapsed);
        }
      }, 1000);

      console.log("Recording started");
    } catch (err) {
      triggerHaptic("error");
      console.error("Failed to start recording", err);
      setIsInitializing(false);
      setIsRecording(false);
      Alert.alert(
        "Recording Error",
        "Could not start recording. Please try again."
      );
    }
  };

  const stopRecording = async (isUnmounting = false) => {
    if (isStopping) {
      console.log("Already stopping recording");
      return;
    }

    if (!isUnmounting) {
      triggerHaptic("medium");
    }

    setIsStopping(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!recording || !isRecording) {
      console.log("No active recording to stop");
      setIsInitializing(false);
      setIsRecording(false);
      setIsStopping(false);
      return;
    }

    try {
      console.log("Stopping recording...");
      setIsRecording(false);

      const duration = recordingStartTimeRef.current
        ? (Date.now() - recordingStartTimeRef.current) / 1000
        : 0;

      let uri = "";

      try {
        uri = recording.getURI();
        await recording.stopAndUnloadAsync();
        console.log("Recording stopped and stored at", uri);
      } catch (stopError) {
        console.log("Error stopping recording:", stopError.message);
        if (stopError.message.includes("already been unloaded")) {
          try {
            uri = recording.getURI();
            console.log("Got URI from already unloaded recording:", uri);
          } catch (e) {
            console.error("Could not get URI from recording:", e);
          }
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      if (!isUnmounting && currentBoard && duration >= 0.5 && uri) {
        const soundObj = {
          sid: Date.now(),
          uri,
          name: "Mic Recording",
          title: formatRecordingTitle(),
        };

        updateSoundBoard(soundObj);
        triggerHaptic("success");
      } else if (duration < 0.5 && !isUnmounting) {
        triggerHaptic("error");
        Alert.alert(
          "Recording Too Short",
          "Please record for at least 0.5 seconds to save."
        );
      }
    } catch (error) {
      triggerHaptic("error");
      console.error("Error in stopping recording process:", error);
    } finally {
      setRecording(null);
      recordingStartTimeRef.current = null;
      setIsStopping(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.recordButton,
          {
            backgroundColor: isRecording
              ? "#D9534F"
              : isInitializing || isStopping
              ? "#986A6A"
              : "#A57878",
          },
        ]}
        onPress={isRecording ? () => stopRecording(false) : startRecording}
        disabled={isInitializing || isStopping}
      >
        <Text
          style={[
            styles.recordText,
            {
              fontSize:
                isLandscape && isTablet() ? normalize(10) : normalize(16),
            },
          ]}
        >
          Record
        </Text>
        <MaterialIcons
          name={isRecording ? "stop" : "fiber-manual-record"}
          size={normalize(20)}
          color={isRecording ? "#FFFFFF" : "#EAE0D5"}
        />
      </Pressable>

      {isRecording && (
        <View style={styles.recordingControls}>
          <Text style={styles.durationText}>
            {Math.floor(recordingDuration / 60)}:
            {(recordingDuration % 60).toString().padStart(2, "0")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RecordAudioButton;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
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
    marginRight: 8,
  },
  recordingControls: {
    position: "absolute",
    top: "100%",
    marginTop: 8,
    backgroundColor: "rgba(94, 64, 63, 0.8)",
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  durationText: {
    color: "#EAE0D5",
    fontWeight: "bold",
    fontSize: normalize(14),
  },
});
