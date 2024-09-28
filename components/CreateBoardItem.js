import React, { useContext } from "react";
import { Platform, StyleSheet, TouchableOpacity, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { normalize } from "../core/responsive";
import { AppContext } from "../core/context/AppState";

const CreateBoardItem = () => {
  const { updateSoundBoard } = useContext(AppContext);

  const pickAudio = async () => {
    try {
      console.log("Starting DocumentPicker...");
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/mpeg",
      });

      console.log("DocumentPicker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { name, uri } = result.assets[0]; // Access the first asset

        console.log("Successfully picked an audio file:", { name, uri });
        const id = Date.now() + Math.floor(Math.random() * 9000) + 1000;
        console.log("Generated ID for new sound:", id);

        updateSoundBoard({ sid: id, name, uri });
        console.log("Sound added to soundboard:", { sid: id, name, uri });
      } else {
        console.log(
          "DocumentPicker was canceled or did not return a valid file."
        );
      }
    } catch (error) {
      console.error("Error picking audio file:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.cont} onPress={pickAudio}>
      <AntDesign color="white" name="addfile" style={styles.icon} />
      <Text style={styles.text}>Add Sound</Text>
    </TouchableOpacity>
  );
};

export default CreateBoardItem;

const styles = StyleSheet.create({
  cont: {
    backgroundColor: "#C89F9C",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  icon: {
    ...Platform.select({
      ios: {
        fontSize: normalize(16),
      },
      android: {
        fontSize: normalize(16),
      },
      default: {
        fontSize: "3.2vw",
      },
    }),
  },
  text: {
    color: "white",
    fontWeight: "bold",
    ...Platform.select({
      ios: {
        fontSize: normalize(13),
      },
      android: {
        fontSize: normalize(13),
      },
      default: {
        fontSize: "2vw",
      },
    }),
  },
});
