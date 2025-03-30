import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { normalize } from "../../core/responsive";
import { withHaptics } from "../../src/utils/haptics";
import CreateBoardItem from "../CreateBoardItem";

const BoardControls = ({
  showSelectBoard,
  setShowSelectBoard,
  showControls,
  setShowControls,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: 10,
          backgroundColor: "#A5787850",
          padding: 7,
        }}
        onPress={withHaptics("selection", () =>
          setShowSelectBoard(!showSelectBoard)
        )}
      >
        <Text
          style={{
            color: "#EAE0D5",
            fontWeight: "bold",
            fontSize: normalize(16),
          }}
        >
          {showSelectBoard ? "Hide Select Board" : "Select Board"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          borderRadius: 10,
          backgroundColor: "#A5787850",
          padding: 7,
        }}
        onPress={withHaptics("selection", () => {
          setShowControls(!showControls);
        })}
      >
        <Text
          style={{
            color: "#EAE0D5",
            fontWeight: "bold",
            fontSize: normalize(16),
          }}
        >
          {showControls ? "Hide Controls" : "Controls"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Sub-component for control panel
BoardControls.ControlPanel = ({
  setShowInstructions,
  setShowCreateBoard,
  showCreateBoard,
  setShowRenameBoard,
  showRenameBoard,
  handleDeleteBoard,
}) => {
  return (
    <View>
      <Text
        style={{
          fontSize: normalize(16),
          fontWeight: "bold",
          color: "#EAE0D5",
          marginBottom: 10,
        }}
      >
        Controls:
      </Text>
      <ScrollView
        horizontal
        style={{
          backgroundColor: "#A57878",
          borderRadius: 5,
          paddingTop: 10,
          marginBottom: 10,
        }}
        contentContainerStyle={{
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 10,
            marginRight: 10,
            alignItems: "center",
          }}
          onPress={withHaptics("selection", () => setShowInstructions(true))}
        >
          <Text
            style={{
              color: "#EAE0D5",
              fontWeight: "bold",
              fontSize: normalize(16),
            }}
          >
            Instructions
          </Text>
        </TouchableOpacity>
        <CreateBoardItem />
        <TouchableOpacity
          style={{
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 10,
            marginRight: 10,
            alignItems: "center",
          }}
          onPress={() => setShowCreateBoard(!showCreateBoard)}
        >
          <Text
            style={{
              color: "#EAE0D5",
              fontWeight: "bold",
              fontSize: normalize(16),
            }}
          >
            Add Board
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 10,
            marginRight: 10,
            alignItems: "center",
          }}
          onPress={() => setShowRenameBoard(!showRenameBoard)}
        >
          <Text
            style={{
              color: "#EAE0D5",
              fontWeight: "bold",
              fontSize: normalize(16),
            }}
          >
            Rename Board
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 10,
            marginRight: 10,
            alignItems: "center",
            backgroundColor: "#D9534F",
          }}
          onPress={handleDeleteBoard}
        >
          <Text
            style={{
              color: "#EAE0D5",
              fontWeight: "bold",
              fontSize: normalize(16),
            }}
          >
            Delete Board
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BoardControls;
