import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../context/AppState";
import { useSubscription } from "../context/SubscriptionContext";
import { useIsLandscape, isTablet, normalize } from "../core/responsive";
import { triggerHaptic } from "../utils/haptics";

const MINIMUM_RECORDING_SECONDS = 0.5;

const RecordAudioButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const { updateSoundBoard, currentBoard } = useContext(AppContext);
  const { limits, upgradeToPremium } = useSubscription();

  const recordingStartTimeRef = useRef(null);
  const recordingStatusRef = useRef("idle");
  const timerRef = useRef(null);
  const autoStopTriggeredRef = useRef(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const isLandscape = useIsLandscape();

  const maxRecordingSeconds = limits?.maxRecordingSeconds;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupAfterRecording = useCallback(() => {
    clearTimer();
    setIsRecording(false);
    setIsStopping(false);
    recordingStartTimeRef.current = null;
    recordingStatusRef.current = "idle";
    autoStopTriggeredRef.current = false;
  }, [clearTimer]);

  const formatRecordingTitle = useCallback(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `Mic Recording ${month}/${day}/${year} @${formattedHours}:${minutes} ${ampm}`;
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      if (recordingStartTimeRef.current) {
        const elapsed = Math.floor(
          (Date.now() - recordingStartTimeRef.current) / 1000
        );
        setRecordingDuration(elapsed);
      }
    }, 1000);
  }, [clearTimer]);

  const stopRecording = useCallback(
    async (isUnmounting = false) => {
      if (isStopping || recordingStatusRef.current === "stopping") {
        return;
      }

      if (!isUnmounting) {
        triggerHaptic("medium");
      }

      recordingStatusRef.current = "stopping";
      setIsStopping(true);
      clearTimer();

      const duration = recordingStartTimeRef.current
        ? (Date.now() - recordingStartTimeRef.current) / 1000
        : 0;

      if (!audioRecorder) {
        cleanupAfterRecording();
        return;
      }

      try {
        let uri = null;

        try {
          uri = audioRecorder.uri;
        } catch (uriError) {
          console.log("Could not read recorder URI before stop:", uriError);
        }

        try {
          await audioRecorder.stop();
        } catch (stopError) {
          console.log("Error stopping recording:", stopError);
          throw stopError;
        }

        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });

        if (
          !isUnmounting &&
          currentBoard &&
          duration >= MINIMUM_RECORDING_SECONDS &&
          uri
        ) {
          const soundObj = {
            sid: Date.now(),
            uri,
            name: "Mic Recording",
            title: formatRecordingTitle(),
          };

          const result = await updateSoundBoard(soundObj);

          if (result?.success === false && result.reason === "sound-limit") {
            triggerHaptic("warning");
            Alert.alert(
              "Board capacity reached",
              `Free boards store up to ${
                limits?.maxUploadsPerBoard ?? 0
              } clips. Upgrade for limitless takes.`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Go Premium",
                  onPress: () =>
                    upgradeToPremium({ source: "recording-limit-upload" }),
                },
              ]
            );
          } else {
            triggerHaptic("success");
          }
        } else if (duration < MINIMUM_RECORDING_SECONDS && !isUnmounting) {
          triggerHaptic("error");
          Alert.alert(
            "Recording Too Short",
            "Please record for at least half a second to save."
          );
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        if (!isUnmounting) {
          triggerHaptic("error");
          Alert.alert(
            "Recording Error",
            "There was a problem with the recording. Please try again."
          );
        }
      } finally {
        cleanupAfterRecording();
      }
    },
    [
      audioRecorder,
      clearTimer,
      cleanupAfterRecording,
      currentBoard,
      formatRecordingTitle,
      isStopping,
      limits?.maxUploadsPerBoard,
      updateSoundBoard,
      upgradeToPremium,
    ]
  );

  const startRecording = useCallback(async () => {
    if (isRecording || isInitializing || isStopping) {
      console.log("Recording operation already in progress");
      return;
    }

    recordingStatusRef.current = "initializing";
    triggerHaptic("heavy");
    setIsInitializing(true);
    autoStopTriggeredRef.current = false;

    try {
      const permission = await requestRecordingPermissionsAsync();
      if (permission.status !== "granted") {
        console.error("Permission to access microphone denied");
        setIsInitializing(false);
        recordingStatusRef.current = "idle";
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: "doNotMix",
        interruptionModeAndroid: "doNotMix",
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      recordingStatusRef.current = "recording";
      setIsRecording(true);
      setIsInitializing(false);
      recordingStartTimeRef.current = Date.now();
      setRecordingDuration(0);
      startTimer();
    } catch (error) {
      console.error("Failed to start recording", error);
      triggerHaptic("error");
      setIsInitializing(false);
      setIsRecording(false);
      recordingStatusRef.current = "idle";
      Alert.alert(
        "Recording Error",
        "Could not start recording. Please try again."
      );
    }
  }, [audioRecorder, isInitializing, isRecording, isStopping, startTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (audioRecorder && isRecording) {
        stopRecording(true);
      } else {
        cleanupAfterRecording();
      }
    };
  }, [
    audioRecorder,
    clearTimer,
    cleanupAfterRecording,
    isRecording,
    stopRecording,
  ]);

  useEffect(() => {
    if (!isRecording) return;
    if (!Number.isFinite(maxRecordingSeconds)) return;
    if (recordingDuration < maxRecordingSeconds) return;
    if (autoStopTriggeredRef.current) return;

    autoStopTriggeredRef.current = true;
    stopRecording();
    Alert.alert(
      "Recording limit reached",
      `Free recordings are limited to ${maxRecordingSeconds} seconds. Upgrade for longer takes and pro features.`,
      [
        { text: "Not now", style: "cancel" },
        {
          text: "Go Premium",
          onPress: () => upgradeToPremium({ source: "recording-limit" }),
        },
      ]
    );
  }, [
    isRecording,
    maxRecordingSeconds,
    recordingDuration,
    stopRecording,
    upgradeToPremium,
  ]);

  const renderRecordingTimer = () => {
    if (!isRecording) return null;

    return (
      <View style={styles.recordingControls}>
        <Text style={styles.durationText}>
          {Math.floor(recordingDuration / 60)}:
          {(recordingDuration % 60).toString().padStart(2, "0")}
        </Text>
      </View>
    );
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
        {renderRecordingTimer()}
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
      {Number.isFinite(maxRecordingSeconds) ? (
        <View style={styles.limitRow}>
          <Text style={styles.limitText}>
            {isRecording
              ? `${Math.max(
                  maxRecordingSeconds - recordingDuration,
                  0
                )}s remaining`
              : `Free recordings up to ${maxRecordingSeconds}s.`}
          </Text>
          <Pressable
            onPress={() => upgradeToPremium({ source: "recording-banner" })}
          >
            <Text style={styles.limitCta}>Go Premium</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.limitText}>Premium: record up to 5 minutes.</Text>
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
    backgroundColor: "rgba(94, 64, 63, 0.8)",
    padding: 3,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  durationText: {
    color: "#EAE0D5",
    fontWeight: "bold",
    fontSize: normalize(14),
  },
  limitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  limitText: {
    color: "#EAE0D5",
    opacity: 0.75,
    fontSize: normalize(12),
  },
  limitCta: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: normalize(12),
    textDecorationLine: "underline",
  },
});
