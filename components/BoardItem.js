import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
import { useIsLandscape, isTablet, normalize } from "../core/responsive";

const { width, height } = Dimensions.get("window");

const BoardItem = ({
  sid,
  name,
  title,
  src,
  onPlaySound,
  navigation,
  removeSoundboardItem,
}) => {
  const [sound, setSound] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const isLandscape = useIsLandscape();

  const playSound = async () => {
    try {
      console.log("Attempting to play sound. Source URI:", src);
      const { sound } = await Audio.Sound.createAsync(
        { uri: src },
        { shouldPlay: true }
      );
      setSound(sound);
      onPlaySound(sound);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log("Sound playback finished.");
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleLongPress = () => {
    setShowActions((prev) => !prev);
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginVertical: 15,
        width: isTablet() ? normalize(100) : normalize(125),
      }}
    >
      {showActions && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 5,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#646F4B",
              padding: 5,
              borderRadius: 5,
              marginHorizontal: 5,
              flex: 1,
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Edit", {
                sid,
                fileName: name,
                title,
              });
              setShowActions(false);
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "tomato",
              padding: 5,
              borderRadius: 5,
              marginHorizontal: 5,
              flex: 1,
              alignItems: "center",
            }}
            onPress={() => {
              removeSoundboardItem(sid);
              setShowActions(false);
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={{
          minHeight: isTablet() ? height * 0.2 : height * 0.1,
          width: isTablet() ? width * 0.3 : width * 0.4,
          backgroundColor: "#A57878",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={playSound}
        onLongPress={handleLongPress}
      >
        {title ? (
          <Text
            style={{
              fontWeight: "bold",
              color: "#EAE0D5",
              width: "100%",
              textAlign: "center",
              flexWrap: "wrap",
              fontSize:
                isLandscape && isTablet() ? normalize(10) : normalize(15),
            }}
          >
            {title}
          </Text>
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              color: "#EAE0D5",
              width: "100%",
              textAlign: "center",
              flexWrap: "wrap",
              fontSize:
                isLandscape && isTablet() ? normalize(10) : normalize(15),
            }}
          >
            File: {name}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BoardItem;
