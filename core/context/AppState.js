import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
const AppContext = React.createContext();

// AppState component that holds all logic and state
const AppState = (props) => {
  const [soundBoard, setSoundBoard] = useState([]);

  useEffect(() => {
    getSoundBoard();
  }, []);

  // Function to get soundboard data from AsyncStorage
  const getSoundBoard = async () => {
    try {
      console.log("Fetching soundboard data from AsyncStorage...");
      const jsonValue = await AsyncStorage.getItem("soundboard");
      if (jsonValue !== null) {
        const parsedData = JSON.parse(jsonValue);
        console.log("Soundboard data fetched:", parsedData);
        setSoundBoard(parsedData);
      } else {
        console.log("No soundboard data found.");
      }
    } catch (e) {
      console.log("Error reading soundboard data:", e);
    }
  };

  // Function to update soundboard with a new item
  const updateSoundBoard = async (soundObj) => {
    try {
      console.log("Adding new sound item:", soundObj);
      const existingData = (await AsyncStorage.getItem("soundboard")) || "[]";
      const parsedData = JSON.parse(existingData);
      console.log("Existing soundboard data:", parsedData);

      const updatedSoundBoard = [...parsedData, soundObj];
      console.log("Updated soundboard data:", updatedSoundBoard);

      await AsyncStorage.setItem(
        "soundboard",
        JSON.stringify(updatedSoundBoard)
      );
      setSoundBoard(updatedSoundBoard);
      console.log("Soundboard successfully updated and saved.");
    } catch (e) {
      console.log("Error updating soundboard:", e);
    }
  };

  // Function to remove a soundboard item
  const removeSoundboardItem = async (sid) => {
    try {
      console.log(`Removing soundboard item with sid: ${sid}`);
      const existingData = (await AsyncStorage.getItem("soundboard")) || "[]";
      const parsedData = JSON.parse(existingData);
      const updatedSoundBoard = parsedData.filter((item) => item.sid !== sid);

      console.log("Updated soundboard data after removal:", updatedSoundBoard);

      await AsyncStorage.setItem(
        "soundboard",
        JSON.stringify(updatedSoundBoard)
      );
      setSoundBoard(updatedSoundBoard);
      console.log("Soundboard item removed and data updated.");
    } catch (e) {
      console.log("Error removing soundboard item:", e);
    }
  };

  // Function to update the title of a soundboard item
  const updateBoardItem = async (sid, title) => {
    try {
      console.log(
        `Updating title for soundboard item with sid: ${sid} to ${title}`
      );
      const existingData = (await AsyncStorage.getItem("soundboard")) || "[]";
      const parsedData = JSON.parse(existingData);
      const objIndex = parsedData.findIndex((o) => o.sid === sid);

      if (objIndex !== -1) {
        parsedData[objIndex].title = title;
        console.log("Updated item:", parsedData[objIndex]);

        await AsyncStorage.setItem("soundboard", JSON.stringify(parsedData));
        setSoundBoard(parsedData);
        console.log("Soundboard title updated successfully.");
      } else {
        console.log("Item not found in soundboard.");
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
