import React from "react";
import { Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { normalize } from "../../core/responsive";
import { withHaptics } from "../../utils/haptics";

const Instructions = ({ setShowInstructions }) => {
  return (
    <ScrollView style={{ padding: 10 }}>
      <Pressable>
        <Text
          style={{
            fontSize: normalize(18),
            fontWeight: "bold",
            color: "#EAE0D5",
            marginBottom: 15,
            textAlign: "center",
          }}
        >
          How to Use SoundBoard
        </Text>

        <Text
          style={{
            fontSize: normalize(14),
            color: "#EAE0D5",
            marginBottom: 10,
          }}
        >
          • <Text style={{ fontWeight: "bold" }}>Play a sound:</Text> Tap on any
          sound tile
        </Text>

        <Text
          style={{
            fontSize: normalize(14),
            color: "#EAE0D5",
            marginBottom: 10,
          }}
        >
          • <Text style={{ fontWeight: "bold" }}>Stop a sound:</Text> Tap the
          sound tile again while it's playing
        </Text>

        <Text
          style={{
            fontSize: normalize(14),
            color: "#EAE0D5",
            marginBottom: 10,
          }}
        >
          • <Text style={{ fontWeight: "bold" }}>Edit a sound:</Text> Long-press
          on a sound tile, then tap "Edit"
        </Text>

        <Text
          style={{
            fontSize: normalize(14),
            color: "#EAE0D5",
            marginBottom: 10,
          }}
        >
          • <Text style={{ fontWeight: "bold" }}>Delete a sound:</Text>{" "}
          Long-press on a sound tile, then tap "Delete"
        </Text>

        <Text
          style={{
            fontSize: normalize(14),
            color: "#EAE0D5",
            marginBottom: 10,
          }}
        >
          • <Text style={{ fontWeight: "bold" }}>Add a sound:</Text> Tap "Add
          Sound" in the controls
        </Text>

        <Text
          style={{
            fontSize: normalize(14),
            color: "#EAE0D5",
            marginBottom: 10,
          }}
        >
          • <Text style={{ fontWeight: "bold" }}>Record a sound:</Text> Tap
          "Record", then tap again to stop recording
        </Text>

        <Text
          style={{
            fontSize: normalize(14),
            color: "#EAE0D5",
            marginBottom: 10,
          }}
        >
          • <Text style={{ fontWeight: "bold" }}>Stop all sounds:</Text> Tap
          "Stop All Sounds" button
        </Text>

        <Text
          style={{
            fontSize: normalize(14),
            color: "#EAE0D5",
            marginBottom: 10,
          }}
        >
          • <Text style={{ fontWeight: "bold" }}>Switch boards:</Text> Tap
          "Select Board", then choose a board
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#646F4B",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 15,
          }}
          onPress={withHaptics("selection", () => setShowInstructions(false))}
        >
          <Text
            style={{
              color: "#EAE0D5",
              fontWeight: "bold",
              fontSize: normalize(16),
            }}
          >
            Got it!
          </Text>
        </TouchableOpacity>
      </Pressable>
    </ScrollView>
  );
};

export default Instructions;
