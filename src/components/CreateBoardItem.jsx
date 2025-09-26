import React, { useContext } from "react";
import { Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { normalize } from "../core/responsive";
import { AppContext } from "../context/AppState";
import { triggerHaptic } from "../utils/haptics";
import { useSubscription } from "../context/SubscriptionContext";

const CreateBoardItem = () => {
  const { updateSoundBoard } = useContext(AppContext);
  const { upgradeToPremium, limits } = useSubscription();

  const pickAudio = async () => {
    triggerHaptic("selection");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "audio/*", // Accept all audio types
          "audio/mpeg", // MP3
          "audio/wav", // WAV
          "audio/x-wav", // Alternative WAV MIME type
          "audio/mp4", // M4A
          "audio/aac", // AAC
          "audio/ogg", // OGG
        ],
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        triggerHaptic("success");
        const { name, uri } = result.assets[0];
        const id = Date.now() + Math.floor(Math.random() * 9000) + 1000;

        const result = await updateSoundBoard({ sid: id, name, uri });

        if (result?.success === false && result.reason === "sound-limit") {
          triggerHaptic("warning");
          Alert.alert(
            "Storage limit reached",
            `Free boards may contain up to ${
              limits?.maxUploadsPerBoard ?? 0
            } sounds. Upgrade to keep adding clips.`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Go Premium",
                onPress: () => upgradeToPremium({ source: "upload-limit" }),
              },
            ]
          );
        }
      }
    } catch (error) {
      triggerHaptic("error");
      console.error("Error picking audio file:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickAudio}>
      <Text
        style={{
          color: "#EAE0D5",
          fontWeight: "bold",
          fontSize: normalize(16),
        }}
      >
        Add Sound
      </Text>
    </TouchableOpacity>
  );
};

export default CreateBoardItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
