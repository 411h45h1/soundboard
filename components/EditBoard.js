import React, { useContext, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AppContext from "../core/context/appContext";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { normalize } from "../core/responsive";

const EditBoard = ({ navigation, route }) => {
  const state = useContext(AppContext);
  const { updateBoardItem } = state;
  const { fileName, title, sid } = route.params;
  const [titleText, onChangeTitleText] = useState(title ? title : "");
  const dismissKeyboard = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
              <Ionicons name="md-return-up-back" size={normalize(13)} />
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
              marginVertical: 15,
            }}
          >
            <Text style={styles.text}>Title</Text>
            <TextInput
              autoCompleteType="off"
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
    ...Platform.select({
      ios: {
        fontSize: normalize(15),
      },
      android: {
        fontSize: normalize(15),
      },
      default: {
        // other platforms, web for example
        fontSize: "3vw",
      },
    }),
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        maxWidth: "10%",
      },
      android: {
        maxWidth: "10%",
      },
      default: {
        // other platforms, web for example
        maxWidth: "7%",
      },
    }),
  },
  boardArea: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    flex: 8,
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
    ...Platform.select({
      ios: {
        fontSize: normalize(35),
      },
      android: {
        fontSize: normalize(35),
      },
      default: {
        // other platforms, web for example
        fontSize: "4.5vw",
      },
    }),
    fontWeight: "bold",
    color: "white",
  },
});
