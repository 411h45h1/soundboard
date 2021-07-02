import React, { useEffect, useReducer } from "react";
import AppContext from "./appContext";
import appReducer from "./appReducer";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AppState = (props) => {
  const initialState = {
    soundBoard: [],
  };
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { soundBoard } = state;

  useEffect(() => {
    getSoundBoard();
  }, []);

  const getSoundBoard = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("soundboard");

      jsonValue !== []
        ? dispatch({
            type: "UPDATE_SOUNDBOARD",
            payload: JSON.parse(jsonValue),
          })
        : [];
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const updateSoundBoard = (soundObj) => {
    const storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem("soundboard", jsonValue);
      } catch (e) {
        // saving error
        console.log(e);
      }
    };

    const updateStoredData = async () => {
      await AsyncStorage.getItem("soundboard").then((res) => {
        res = res == null ? [] : JSON.parse(res);

        res.push(soundObj);

        dispatch({
          type: "UPDATE_SOUNDBOARD",
          payload: res,
        });

        return AsyncStorage.setItem("soundboard", JSON.stringify(res));
      });
    };

    try {
      if (soundBoard === []) {
        storeData(soundObj);
      } else {
        updateStoredData();
      }
    } catch (error) {
      console.log(e);
    }
  };

  const removeSoundboardItem = async (sid) => {
    const deleteSoundboardItem = async () =>
      await AsyncStorage.getItem("soundboard").then(async (res) => {
        res = res == null ? [] : JSON.parse(res);
        res.splice(
          res.findIndex((i) => i.sid === sid),
          1
        );
        return await AsyncStorage.setItem(
          "soundboard",
          JSON.stringify(res)
        ).then(() =>
          dispatch({
            type: "UPDATE_SOUNDBOARD",
            payload: res,
          })
        );
      });

    try {
      deleteSoundboardItem();
    } catch (e) {
      console.log(e);
    }
  };

  const updateBoardItem = async (sid, title) => {
    const update = async () =>
      await AsyncStorage.getItem("soundboard").then(async (res) => {
        res = res == null ? [] : JSON.parse(res);
        const objIndex = res.findIndex((o) => o.sid === sid);
        res[objIndex].title = title;

        return await AsyncStorage.setItem(
          "soundboard",
          JSON.stringify(res)
        ).then(() =>
          dispatch({
            type: "UPDATE_SOUNDBOARD",
            payload: res,
          })
        );
      });

    try {
      update();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        soundBoard: state.soundBoard,
        updateSoundBoard,
        updateBoardItem,
        removeSoundboardItem,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
