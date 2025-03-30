import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { normalize } from "../../core/responsive";
import { withHaptics } from "../../utils/haptics";

const BoardSelectPanel = ({ boards, currentBoard, switchBoard }) => {
  return (
    <View
      style={{
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: normalize(16),
          fontWeight: "bold",
          color: "#EAE0D5",
          marginBottom: 10,
        }}
      >
        Select Board:
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
        }}
        showsHorizontalScrollIndicator={false}
      >
        {boards.map((board) => (
          <TouchableOpacity
            key={board.id}
            style={[
              {
                backgroundColor: "#C89F9C",
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 10,
                marginRight: 10,
                alignItems: "center",
                justifyContent: "center",
              },
              currentBoard &&
                currentBoard.id === board.id && {
                  backgroundColor: "#5A9F5A",
                },
            ]}
            onPress={withHaptics("selection", () => switchBoard(board.id))}
          >
            <Text
              style={{
                fontSize: normalize(16),
                color: "#EAE0D5",
                fontWeight: "bold",
              }}
            >
              {board.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default BoardSelectPanel;
