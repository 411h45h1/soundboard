import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const CreateBoardItem = () => {
  return (
    <TouchableOpacity style={styles.cont}>
      <AntDesign name="addfile" size={20} />
    </TouchableOpacity>
  );
};

export default CreateBoardItem;

const styles = StyleSheet.create({
  cont: {
    border: "2px solid black",
    margin: 10,
    height: 80,
    width: 100,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
