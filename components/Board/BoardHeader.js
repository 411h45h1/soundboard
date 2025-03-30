import React from "react";
import { View, Text } from "react-native";
import { normalize } from "../../core/responsive";

const BoardHeader = ({ isLandscape }) => {
  return (
    <View
      style={{
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: isLandscape ? normalize(10) : normalize(35),
          fontWeight: "bold",
          color: "#EAE0D5",
        }}
      >
        SoundBoard
      </Text>
    </View>
  );
};

export default BoardHeader;
