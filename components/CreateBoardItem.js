import React, { useContext } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import AppContext from "../core/context/appContext";

const CreateBoardItem = () => {
  const state = useContext(AppContext);
  const { updateSoundBoard } = state;

  const PickAudio = async () => {
    await DocumentPicker.getDocumentAsync({
      type: "audio/mpeg",
    }).then(({ type, name, uri }) => {
      if (type === "success") {
        return updateSoundBoard({ name, uri });
      }
    });
  };

  return (
    <TouchableOpacity style={styles.cont} onPress={() => PickAudio()}>
      <AntDesign name="addfile" size={20} />
    </TouchableOpacity>
  );
};

export default CreateBoardItem;

const styles = StyleSheet.create({
  cont: {
    borderWidth: 3,
    borderColor: "black",
    height: 80,
    width: 100,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
