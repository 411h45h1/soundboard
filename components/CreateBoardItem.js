import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { isLandscape, isTablet, normalize } from "../core/responsive";
import { AppContext } from "../core/context/AppState";

const CreateBoardItem = () => {
  const { updateSoundBoard } = useContext(AppContext);

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/mpeg",
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { name, uri } = result.assets[0];
        const id = Date.now() + Math.floor(Math.random() * 9000) + 1000;

        updateSoundBoard({ sid: id, name, uri });
      }
    } catch (error) {
      console.error("Error picking audio file:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickAudio}>
      <Text style={styles.text}>Add Sound</Text>
    </TouchableOpacity>
  );
};

export default CreateBoardItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    marginRight: 10,
  },
  text: {
    color: "#EAE0D5",
    fontWeight: "bold",
    fontSize: isLandscape() && isTablet() ? normalize(10) : normalize(16),
  },
});
