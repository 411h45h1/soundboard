import React, { useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

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
      } else {
        createDefaultBoard();
      }
    } catch (e) {
      console.error("Error fetching boards:", e);
    }
  };

  const createDefaultBoard = useCallback(async () => {
    try {
      const defaultBoard = {
        id: Date.now(),
        name: "First Board",
        sounds: [],
      };

      const defaultSoundsRemoved = await AsyncStorage.getItem(
        "defaultSoundsRemoved"
      );

      if (defaultSoundsRemoved !== "true") {
        const defaultSounds = [
          {
            sid: Date.now() + 1,
            uri: "https://firebasestorage.googleapis.com/v0/b/powerlv-a2081.appspot.com/o/assets%2FCrash.mp3?alt=media&token=f7009ced-8eee-4210-ac98-7635d6eb486b",
            name: "crash_notso_software.mp3",
            title: "Crash Sound",
          },
          {
            sid: Date.now() + 2,
            uri: "https://firebasestorage.googleapis.com/v0/b/powerlv-a2081.appspot.com/o/assets%2Fding.mp3?alt=media&token=517271f9-5e73-48a1-92bc-fd9438aa24b3",
            name: "ding_notso_software.mp3",
            title: "Ding Sound",
          },
        ];

        for (const sound of defaultSounds) {
          const localUri = `${FileSystem.documentDirectory}${sound.name}`;

          const fileInfo = await FileSystem.getInfoAsync(localUri);
          if (!fileInfo.exists) {
            try {
              await FileSystem.downloadAsync(sound.uri, localUri);
            } catch (error) {
              console.error(`Error downloading ${sound.name}:`, error);
              continue;
            }
          }

          sound.uri = localUri;
          defaultBoard.sounds.push(sound);
        }
      }

      setBoards([defaultBoard]);
      setCurrentBoard(defaultBoard);
      await saveBoardsToStorage([defaultBoard]);
    } catch (e) {
      console.error("Error creating default board:", e);
    }
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
    async (sid) => {
      if (!currentBoard) return;

      const soundToRemove = currentBoard.sounds.find(
        (sound) => sound.sid === sid
      );

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

      if (
        soundToRemove &&
        soundToRemove.uri &&
        soundToRemove.uri.startsWith(FileSystem.documentDirectory)
      ) {
        try {
          await FileSystem.deleteAsync(soundToRemove.uri);
        } catch (error) {
          console.error("Error deleting sound file:", error);
        }
      }

      // Update defaultSoundsRemoved flag if necessary
      const defaultSoundNames = [
        "crash_notso_software.mp3",
        "ding_notso_software.mp3",
      ];
      const remainingSoundNames = updatedBoard.sounds.map(
        (sound) => sound.name
      );
      if (
        !defaultSoundNames.some((name) => remainingSoundNames.includes(name))
      ) {
        await AsyncStorage.setItem("defaultSoundsRemoved", "true");
      }
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
