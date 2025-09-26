import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { normalize } from "../../core/responsive";
import { triggerHaptic } from "../../utils/haptics";

const CreateBoardModal = ({
  newBoardName,
  setNewBoardName,
  handleCreateBoard,
  boardLimitReached = false,
  boardCount = 0,
  limits,
  onRequestUpgrade,
}) => {
  const handlePress = () => {
    if (boardLimitReached) {
      triggerHaptic("warning");
      onRequestUpgrade?.();
      return;
    }
    handleCreateBoard();
  };

  const remainingSlots =
    limits?.maxBoards && Number.isFinite(limits.maxBoards)
      ? Math.max(limits.maxBoards - boardCount, 0)
      : null;

  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="New Board Name"
          value={newBoardName}
          onChangeText={setNewBoardName}
          editable={!boardLimitReached}
          style={{
            flex: 1,
            backgroundColor: boardLimitReached ? "#48302F" : "#A57878",
            height: "100%",
            borderRadius: 5,
            marginRight: 10,
            paddingLeft: 10,
            color: "white",
            opacity: boardLimitReached ? 0.6 : 1,
          }}
          placeholderTextColor="#EAE0D580"
        />
        <TouchableOpacity
          style={{
            backgroundColor: boardLimitReached ? "#EAE0D5" : "#A57878",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 5,
          }}
          onPress={handlePress}
        >
          <Text
            style={{
              color: boardLimitReached ? "#5E403F" : "#EAE0D5",
              fontWeight: "bold",
              fontSize: normalize(16),
            }}
          >
            {boardLimitReached ? "Go Premium" : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          marginTop: 8,
          color: "#EAE0D5",
          fontSize: normalize(13),
          opacity: 0.8,
        }}
      >
        {boardLimitReached
          ? `You have reached the free limit of ${
              limits?.maxBoards ?? 0
            } boards. Upgrade to add more collections.`
          : remainingSlots === null
          ? "Premium members enjoy unlimited boards."
          : `${remainingSlots} board slot${
              remainingSlots === 1 ? "" : "s"
            } remaining on the free plan.`}
      </Text>
    </View>
  );
};

export default CreateBoardModal;
