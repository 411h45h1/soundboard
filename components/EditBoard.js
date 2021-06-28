import React, { useContext, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AppContext from "../core/context/appContext";
import BoardItem from "./BoardItem";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { normalize } from "../core/responsive";

const EditBoard = ({ navigation, route }) => {
  const state = useContext(AppContext);
  const { updateBoardItem } = state;
  const { fileName, title, sid } = route.params;
  const [titleText, onChangeTitleText] = useState(title ? title : "");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.board}>
        <StatusBar style="auto" />
        <View style={styles.title}>
          <Text style={styles.titleText}>Edit </Text>
        </View>
        <View style={styles.boardArea}>
          <View>
            <TouchableOpacity
              style={styles.goBack}
              // onPress={() => removeSoundboardItem(id)}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="md-return-up-back" size={normalize(14)} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "80%",
              justifyContent: "space-between",
              alignSelf: "center",

              alignItems: "center",
            }}
          >
            <Text style={styles.text}>File Name:</Text>
            <Text style={styles.text}>{fileName}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "80%",
              justifyContent: "space-between",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.text}>Title</Text>
            <TextInput
              ke
              style={styles.input}
              onChangeText={onChangeTitleText}
              value={titleText}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "80%",
              justifyContent: "center",
              alignSelf: "center",
              margin: 20,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.submit}
              onPress={() =>
                updateBoardItem(sid, titleText).then(() => navigation.goBack())
              }
            >
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditBoard;

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: normalize(15),
  },
  input: {
    backgroundColor: "white",
    width: "50%",
    height: "100%",
    borderRadius: 5,
    fontSize: normalize(12),
  },
  submit: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
  goBack: {
    maxWidth: "10%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
  boardArea: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    flex: 5,
    width: "100%",
    padding: 10,
  },

  scroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },

  board: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 30,
    marginHorizontal: 10,
    backgroundColor: "#DBAD6A",
    borderRadius: 10,
    padding: 10,
  },

  title: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },

  titleText: {
    fontSize: normalize(35),
    fontWeight: "bold",
    color: "white",
  },
});
