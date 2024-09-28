import React, { useContext, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { normalize } from "../core/responsive";
import { AppContext } from "../core/context/AppState";

const EditBoard = ({ navigation, route }) => {
  const { updateBoardItem } = useContext(AppContext);
  const { fileName, title, sid } = route.params;
  const [titleText, setTitleText] = useState(title || "");

  const handleSubmit = () => {
    if (titleText.trim()) {
      updateBoardItem(sid, { title: titleText });
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Edit sound</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={navigation.goBack}
          >
            <AntDesign name="back" size={normalize(20)} />
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.label}>File Name:</Text>
            <Text style={styles.value}>{fileName}</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setTitleText}
              value={titleText}
              placeholder="Enter title"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5E503F",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 10,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: normalize(35),
    fontWeight: "bold",
    color: "white",
  },
  content: {
    backgroundColor: "#EAE0D5",
    borderRadius: 10,
    padding: 20,
  },
  goBackButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: normalize(16),
    color: "#333",
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: normalize(16),
    height: 40,
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#646F4B",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: normalize(18),
    fontWeight: "bold",
  },
});
