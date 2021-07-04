import React, { useEffect, useContext, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  if (showDelete) setTimeout(() => setShowDelete(false), 3000);

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
          <Text style={styles.soundBoardText}>{title}</Text>
        ) : (
          <Text style={styles.soundBoardText}>File: {name}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BoardItem;

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 5,

    ...Platform.select({
      ios: {
        fontSize: normalize(12),
      },
      android: {
        fontSize: normalize(12),
      },
      default: {
        // other platforms, web for example
        fontSize: "1.6vw",
      },
    }),
  },
  cont: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 15,

    ...Platform.select({
      ios: {
        width: normalize(125),
      },
      android: {
        width: normalize(125),
      },
      default: {
        // other platforms, web for example
        width: "15vw",
        marginHorizontal: 5,
      },
    }),
  },

  soundButton: {
    padding: 2,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#646F4B",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  soundBoardText: {
    fontWeight: "bold",
    color: "white",
    marginVertical: 25,
    ...Platform.select({
      ios: {
        fontSize: normalize(15),
      },
      android: {
        fontSize: normalize(15),
      },
      default: {
        // other platforms, web for example
        fontSize: "1.9vw",
      },
    }),
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
