//context
import React, { useReducer } from "react";
import AppContext from "./appContext";
import appReducer from "./appReducer";

const AppState = (props) => {
  const initialState = {
    soundBoard: [],
  };
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { soundBoard } = state;

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

  return (
    <AppContext.Provider
      value={{
        soundBoard: state.soundBoard,
        updateSoundBoard,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
