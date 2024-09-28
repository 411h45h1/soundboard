import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { normalize } from "../core/responsive";
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
      <AntDesign name="addfile" size={normalize(20)} color="#EAE0D5" />
      <Text style={styles.text}>Add Sound</Text>
    </TouchableOpacity>
  );
};

export default CreateBoardItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    color: "#EAE0D5",
    fontWeight: "bold",
    fontSize: normalize(16),
    marginLeft: 8,
  },
});
