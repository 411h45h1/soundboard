import React, { useContext } from "react";
import { Platform, StyleSheet, TouchableOpacity, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import AppContext from "../core/context/appContext";
import { normalize } from "../core/responsive";

const CreateBoardItem = () => {
  const state = useContext(AppContext);
  const { updateSoundBoard } = state;

  const PickAudio = async () => {
    await DocumentPicker.getDocumentAsync({
      type: "audio/mpeg",
    }).then(({ type, name, uri }) => {
      if (type === "success") {
        const id = Date.now() + Math.floor(Math.random() * 9000) + 1000;
        return updateSoundBoard({ sid: id, name, uri });
      }
    });
  };

  return (
    <TouchableOpacity style={styles.cont} onPress={() => PickAudio()}>
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
        // other platforms, web for example
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
        // other platforms, web for example
        fontSize: "2vw",
      },
    }),
  },
});
