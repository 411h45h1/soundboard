import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { normalize } from "../../core/responsive";
import { withHaptics } from "../../utils/haptics";

const StopAllSoundsButton = ({ stopAllSounds }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#D9534F",
        padding: 5,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={withHaptics("medium", stopAllSounds)}
    >
      <Text
        style={{
          color: "#EAE0D5",
          fontWeight: "bold",
          fontSize: normalize(16),
        }}
      >
        Stop All Sounds
      </Text>
    </TouchableOpacity>
  );
};

export default StopAllSoundsButton;
