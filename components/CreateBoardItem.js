import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

const CreateBoardItem = () => {
  const PickImage = async () => {
    await DocumentPicker.getDocumentAsync({
      type: "audio/mpeg",
    }).then(({ type, name, uri }) => {
      if (type === "success") {
        //  const jsonValue = JSON.stringify({ type, name, uri });
        //  await AsyncStorage.setItem("@storage_Key", jsonValue);
      }
    });
  };
  return (
    <TouchableOpacity style={styles.cont} onPress={() => PickImage()}>
      <AntDesign name="addfile" size={20} />
    </TouchableOpacity>
  );
};

export default CreateBoardItem;

const styles = StyleSheet.create({
  cont: {
    border: "3px solid black",
    height: 80,
    width: 100,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
