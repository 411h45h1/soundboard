import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { normalize } from "../../core/responsive";
import { triggerHaptic } from "../../src/utils/haptics";

const RenameBoardModal = ({
  renameBoardName,
  setRenameBoardName,
  handleRenameBoard,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <TextInput
        placeholder="Rename Board"
        value={renameBoardName}
        onChangeText={setRenameBoardName}
        style={{
          flex: 1,
          backgroundColor: "#A57878",
          height: "100%",
          borderRadius: 5,
          marginRight: 10,
          paddingLeft: 10,
          color: "white",
        }}
        placeholderTextColor="#EAE0D580"
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#A57878",
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 5,
        }}
        onPress={handleRenameBoard}
      >
        <Text
          style={{
            color: "#EAE0D5",
            fontWeight: "bold",
            fontSize: normalize(16),
          }}
        >
          Rename
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenameBoardModal;
