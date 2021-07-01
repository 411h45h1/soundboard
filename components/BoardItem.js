import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
import AppContext from "../core/context/appContext";
import { normalize } from "../core/responsive";

const BoardItem = ({ sid, name, title, navigation, src }) => {
  const context = useContext(AppContext);
  const { removeSoundboardItem } = context;
  const [sound, setSound] = useState();
  const [showDelete, setShowDelete] = useState(false);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: src });
    setSound(sound);
    return await sound.playAsync();
  };
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  return (
    <View style={styles.cont}>
      {showDelete ? (
        <View style={styles.modArea}>
          <TouchableOpacity
            style={styles.edit}
            onPress={() =>
              navigation.navigate("Edit", {
                sid,
                fileName: name,
                title,
              })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.delete}
            onPress={() => removeSoundboardItem(sid)}
          >
            <Text style={styles.buttonText}>Delete?</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.soundButton}
        onPress={playSound}
        onLongPress={() => setShowDelete(!showDelete)}
      >
        {title ? (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: normalize(15),
              color: "white",
              marginVertical: 25,
            }}
          >
            {title}
          </Text>
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: normalize(15),
              color: "white",
              marginVertical: 25,
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

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: "bold",
    fontSize: normalize(12),
    color: "white",
    marginHorizontal: 5,
  },
  cont: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 15,
    width: normalize(125),
  },

  soundButton: {
    width: "100%",
    minWidth: 100,
    padding: 2,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#646F4B",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  modArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  delete: {
    margin: 2,
    padding: 5,
    backgroundColor: "tomato",
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },

  edit: {
    margin: 2,
    padding: 5,
    backgroundColor: "#646F4B",
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },

  playerButton: {
    alignSelf: "flex-end",
  },
});
