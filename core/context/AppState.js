import React, { useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = React.createContext();

const AppState = (props) => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);

  useEffect(() => {
    getBoards();
    //clearAllData();
  }, []);

  const getBoards = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("soundboards");
      if (jsonValue !== null) {
        const parsedBoards = JSON.parse(jsonValue);
        setBoards(parsedBoards);
        if (parsedBoards.length > 0) setCurrentBoard(parsedBoards[0]);
      } else {
        createDefaultBoard();
      }
    } catch (e) {
      console.error("Error fetching boards:", e);
    }
  };

  // const clearAllData = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     setBoards([]);
  //     setCurrentBoard(null);
  //     console.log("All app data cleared.");
  //   } catch (e) {
  //     console.error("Error clearing app data:", e);
  //   }
  // };

  const createDefaultBoard = useCallback(async () => {
    const defaultBoard = {
      id: Date.now(),
      name: "First Board",
      sounds: [],
    };
    setBoards([defaultBoard]);
    setCurrentBoard(defaultBoard);
    await saveBoardsToStorage([defaultBoard]);
  }, []);

  const saveBoardsToStorage = useCallback(async (updatedBoards) => {
    try {
      await AsyncStorage.setItem("soundboards", JSON.stringify(updatedBoards));
    } catch (e) {
      console.error("Error saving boards:", e);
    }
  }, []);

  const createBoard = useCallback(
    (name) => {
      const newBoard = {
        id: Date.now(),
        name,
        sounds: [],
      };
      const updatedBoards = [...boards, newBoard];
      setBoards(updatedBoards);
      setCurrentBoard(newBoard);
      saveBoardsToStorage(updatedBoards);
    },
    [boards, saveBoardsToStorage]
  );

  const updateSoundBoard = useCallback(
    (soundObj) => {
      if (!currentBoard) return;

      const updatedBoard = {
        ...currentBoard,
        sounds: [...currentBoard.sounds, soundObj],
      };
      const updatedBoards = boards.map((board) =>
        board.id === currentBoard.id ? updatedBoard : board
      );
      setBoards(updatedBoards);
      setCurrentBoard(updatedBoard);
      saveBoardsToStorage(updatedBoards);
    },
    [currentBoard, boards, saveBoardsToStorage]
  );

  const updateBoardItem = useCallback(
    (sid, updatedData) => {
      if (!currentBoard) return;

      const updatedBoard = {
        ...currentBoard,
        sounds: currentBoard.sounds.map((sound) =>
          sound.sid === sid ? { ...sound, ...updatedData } : sound
        ),
      };

      const updatedBoards = boards.map((board) =>
        board.id === currentBoard.id ? updatedBoard : board
      );

      setBoards(updatedBoards);
      setCurrentBoard(updatedBoard);
      saveBoardsToStorage(updatedBoards);
    },
    [currentBoard, boards, saveBoardsToStorage]
  );

  const removeSoundboardItem = useCallback(
    (sid) => {
      if (!currentBoard) return;

      const updatedBoard = {
        ...currentBoard,
        sounds: currentBoard.sounds.filter((sound) => sound.sid !== sid),
      };

      const updatedBoards = boards.map((board) =>
        board.id === currentBoard.id ? updatedBoard : board
      );
      setBoards(updatedBoards);
      setCurrentBoard(updatedBoard);
      saveBoardsToStorage(updatedBoards);
    },
    [currentBoard, boards, saveBoardsToStorage]
  );

  const switchBoard = useCallback(
    (boardId) => {
      const selectedBoard = boards.find((board) => board.id === boardId);
      if (selectedBoard) setCurrentBoard(selectedBoard);
    },
    [boards]
  );

  const removeBoard = useCallback(
    (boardId) => {
      const updatedBoards = boards.filter((board) => board.id !== boardId);
      if (updatedBoards.length === 0) {
        createDefaultBoard();
      } else {
        setBoards(updatedBoards);
        setCurrentBoard(updatedBoards[0]);
        saveBoardsToStorage(updatedBoards);
      }
    },
    [boards, saveBoardsToStorage, createDefaultBoard]
  );

  const renameBoard = useCallback(
    (boardId, newName) => {
      const updatedBoards = boards.map((board) =>
        board.id === boardId ? { ...board, name: newName } : board
      );
      setBoards(updatedBoards);
      setCurrentBoard(
        updatedBoards.find((board) => board.id === boardId) || null
      );
      saveBoardsToStorage(updatedBoards);
    },
    [boards, saveBoardsToStorage]
  );

  const contextValue = useMemo(
    () => ({
      boards,
      currentBoard,
      createBoard,
      switchBoard,
      updateSoundBoard,
      updateBoardItem,
      removeSoundboardItem,
      removeBoard,
      renameBoard,
    }),
    [
      boards,
      currentBoard,
      createBoard,
      switchBoard,
      updateSoundBoard,
      updateBoardItem,
      removeSoundboardItem,
      removeBoard,
      renameBoard,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppState };
