import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = React.createContext();

const AppState = (props) => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);

  useEffect(() => {
    getBoards();
  }, []);

  const getBoards = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("soundboards");
      if (jsonValue !== null) {
        const parsedBoards = JSON.parse(jsonValue);
        setBoards(parsedBoards);
        if (parsedBoards.length > 0) setCurrentBoard(parsedBoards[0]);
      }
    } catch (e) {
      console.error("Error fetching boards:", e);
    }
  };

  const saveBoardsToStorage = async (updatedBoards) => {
    try {
      await AsyncStorage.setItem("soundboards", JSON.stringify(updatedBoards));
    } catch (e) {
      console.error("Error saving boards:", e);
    }
  };

  const createBoard = (name) => {
    const newBoard = {
      id: Date.now(),
      name,
      sounds: [],
    };
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setCurrentBoard(newBoard);
    saveBoardsToStorage(updatedBoards);
  };

  const ensureBoardExists = () => {
    if (boards.length === 0) {
      createBoard("First Board");
    }
  };

  const updateSoundBoard = (soundObj) => {
    ensureBoardExists();
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
  };

  const updateBoardItem = (sid, updatedData) => {
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
  };

  const removeSoundboardItem = (sid) => {
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
  };

  const switchBoard = (boardId) => {
    const selectedBoard = boards.find((board) => board.id === boardId);
    if (selectedBoard) setCurrentBoard(selectedBoard);
  };

  const removeBoard = (boardId) => {
    const updatedBoards = boards.filter((board) => board.id !== boardId);
    if (updatedBoards.length === 0) {
      const newBoard = {
        id: Date.now(),
        name: "First Board",
        sounds: [],
      };
      setBoards([newBoard]);
      setCurrentBoard(newBoard);
      saveBoardsToStorage([newBoard]);
    } else {
      setBoards(updatedBoards);
      setCurrentBoard(updatedBoards[0]);
      saveBoardsToStorage(updatedBoards);
    }
  };

  const renameBoard = (boardId, newName) => {
    const updatedBoards = boards.map((board) =>
      board.id === boardId ? { ...board, name: newName } : board
    );
    setBoards(updatedBoards);
    setCurrentBoard(
      updatedBoards.find((board) => board.id === boardId) || null
    );
    saveBoardsToStorage(updatedBoards);
  };

  return (
    <AppContext.Provider
      value={{
        boards,
        currentBoard,
        createBoard,
        switchBoard,
        updateSoundBoard,
        updateBoardItem,
        removeSoundboardItem,
        removeBoard,
        renameBoard,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppState };
