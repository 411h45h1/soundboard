import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

const AppContext = React.createContext();

const AppState = (props) => {
  const [soundBoard, setSoundBoard] = useState([]);

  useEffect(() => {
    getSoundBoard();
  }, []);

  const getSoundBoard = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("soundboard");
      if (jsonValue !== null) {
        const parsedData = JSON.parse(jsonValue);
        setSoundBoard(parsedData);
      }
    } catch (e) {
      console.log("Error reading soundboard data:", e);
    }
  };

  const storeAudioFilePermanently = async (uri, fileName) => {
    const newFileUri = `${FileSystem.documentDirectory}${fileName}`;
    try {
      await FileSystem.moveAsync({
        from: uri,
        to: newFileUri,
      });

      return newFileUri;
    } catch (e) {
      console.log("Error moving file:", e);
      return null;
    }
  };

  const updateSoundBoard = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { name, uri } = result.assets[0];
        const id = Date.now() + Math.floor(Math.random() * 9000) + 1000;

        const permanentUri = await storeAudioFilePermanently(uri, name);
        if (!permanentUri) return;
        const soundObj = { sid: id, name, uri: permanentUri };

        const existingData = (await AsyncStorage.getItem("soundboard")) || "[]";
        const parsedData = JSON.parse(existingData);

        const updatedSoundBoard = [...parsedData, soundObj];

        await AsyncStorage.setItem(
          "soundboard",
          JSON.stringify(updatedSoundBoard)
        );
        setSoundBoard(updatedSoundBoard);
      }
    } catch (e) {
      console.log("Error updating soundboard:", e);
    }
  };

  const removeSoundboardItem = async (sid) => {
    try {
      const existingData = (await AsyncStorage.getItem("soundboard")) || "[]";
      const parsedData = JSON.parse(existingData);
      const soundToRemove = parsedData.find((item) => item.sid === sid);

      if (soundToRemove) {
        await FileSystem.deleteAsync(soundToRemove.uri, { idempotent: true });

        const updatedSoundBoard = parsedData.filter((item) => item.sid !== sid);

        await AsyncStorage.setItem(
          "soundboard",
          JSON.stringify(updatedSoundBoard)
        );
        setSoundBoard(updatedSoundBoard);
      }
    } catch (e) {
      console.log("Error removing soundboard item:", e);
    }
  };

  const updateBoardItem = async (sid, title) => {
    try {
      const existingData = (await AsyncStorage.getItem("soundboard")) || "[]";
      const parsedData = JSON.parse(existingData);
      const objIndex = parsedData.findIndex((o) => o.sid === sid);

      if (objIndex !== -1) {
        parsedData[objIndex].title = title;

        await AsyncStorage.setItem("soundboard", JSON.stringify(parsedData));
        setSoundBoard(parsedData);
      }
    } catch (e) {
      console.log("Error updating board item:", e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        soundBoard,
        updateSoundBoard,
        updateBoardItem,
        removeSoundboardItem,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppState };
