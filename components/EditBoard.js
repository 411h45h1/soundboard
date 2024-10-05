import React, { useContext, useState } from "react";
import {
  Keyboard,
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
      <View
        style={{ flex: 1, backgroundColor: "#5E403F", paddingHorizontal: 10 }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: normalize(35),
              fontWeight: "bold",
              color: "white",
            }}
          >
            Edit sound
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#A57878",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{ alignSelf: "flex-start", marginBottom: 20 }}
            onPress={navigation.goBack}
          >
            <AntDesign name="back" size={normalize(20)} />
          </TouchableOpacity>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: normalize(16),
                fontWeight: "bold",
                color: "#EAE0D5",
                marginBottom: 5,
              }}
            >
              File Name:
            </Text>
            <Text
              style={{
                fontSize: normalize(16),
                color: "#EAE0D5",
              }}
            >
              {fileName}
            </Text>
          </View>

          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                fontSize: normalize(16),
                fontWeight: "bold",
                color: "#EAE0D5",
                marginBottom: 5,
              }}
            >
              Title:
            </Text>
            <TextInput
              style={{
                backgroundColor: "#5E403F",
                borderRadius: 5,
                paddingHorizontal: 10,
                fontSize: normalize(16),
                height: 40,
                color: "#EAE0D5",
              }}
              onChangeText={setTitleText}
              value={titleText}
              placeholder="Enter title"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#646F4B",
              paddingVertical: 12,
              borderRadius: 5,
              alignItems: "center",
            }}
            onPress={handleSubmit}
          >
            <Text
              style={{
                color: "#EAE0D5",
                fontSize: normalize(18),
                fontWeight: "bold",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditBoard;
