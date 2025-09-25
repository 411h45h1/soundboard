import React, { useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";
import SoundManager from "../utils/SoundManager";

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

        // First, get all sound metadata to help with recovery
        const allSoundsMetadata = await SoundManager.getSoundsMetadata();

        // Process boards in sequence to prevent memory issues
        const validatedBoards = [];

        for (const board of parsedBoards) {
          const validSounds = [];
          let processedCount = 0;
          const totalSounds = board.sounds.length;

          // Process sounds in batches
          const BATCH_SIZE = 10;

          while (processedCount < totalSounds) {
            const batch = board.sounds.slice(
              processedCount,
              Math.min(processedCount + BATCH_SIZE, totalSounds)
            );

            for (const sound of batch) {
              const isValid = await SoundManager.validateSound({
                uri: sound.uri,
              });

              if (isValid) {
                validSounds.push(sound);
              } else {
                console.warn(
                  `Invalid sound detected in board ${board.name}: ${sound.name}`
                );

                // Try to recover the sound
                const matchingSound = allSoundsMetadata.find(
                  (meta) =>
                    meta.name === sound.name ||
                    meta.name.includes(
                      sound.name.replace(/\s+/g, "_").toLowerCase()
                    )
                );

                if (matchingSound) {
                  console.log(
                    `Recovered sound ${sound.name} with new URI: ${matchingSound.uri}`
                  );

                  // Create a new sound object with the updated URI but preserve
                  // the original sound's sid and title to maintain references
                  const recoveredSound = {
                    ...sound,
                    uri: matchingSound.uri,
                    recovered: true, // Mark as recovered for debugging
                  };

                  validSounds.push(recoveredSound);

                  // Also save this mapping so it persists
                  const allExistingSounds =
                    await SoundManager.getSoundsMetadata();
                  if (
                    !allExistingSounds.some((s) => s.id === matchingSound.id)
                  ) {
                    await SoundManager.saveSoundsMetadata([
                      ...allExistingSounds,
                      matchingSound,
                    ]);
                  }
                } else {
                  // We couldn't recover this sound, skip it
                  console.error(`Could not recover sound: ${sound.name}`);
                }
              }
            }

            processedCount += batch.length;

            // Prevent UI from freezing by allowing other tasks to run
            await new Promise((resolve) => setTimeout(resolve, 0));
          }

          validatedBoards.push({
            ...board,
            sounds: validSounds,
          });
        }

        setBoards(validatedBoards);
        if (validatedBoards.length > 0) setCurrentBoard(validatedBoards[0]);

        // Save the validated boards back to storage
        await saveBoardsToStorage(validatedBoards);
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

        await SoundManager.ensureSoundsDirectoryExists();

        for (const sound of defaultSounds) {
          const localFile = SoundManager.getSoundFileUri(sound.name);

          try {
            if (!localFile.exists) {
              await File.downloadFileAsync(sound.uri, localFile);
              await SoundManager.addSound(localFile.uri, sound.name, "Default");
            }

            sound.uri = localFile.uri;
            defaultBoard.sounds.push(sound);
          } catch (error) {
            console.error(`Error downloading ${sound.name}:`, error);
            continue;
          }
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
    async (soundObj) => {
      if (!currentBoard) return;

      try {
        const fileName = soundObj.name;
        const soundName = soundObj.title || fileName;

        // Start updating the UI immediately - don't wait for the file operation
        // This creates a more responsive feeling
        const tempUpdatedBoard = {
          ...currentBoard,
          sounds: [
            ...currentBoard.sounds,
            {
              ...soundObj,
              // Add a temporary flag to indicate this is being processed
              _processing: true,
            },
          ],
        };

        // Update the UI immediately with the temporary object
        const tempUpdatedBoards = boards.map((board) =>
          board.id === currentBoard.id ? tempUpdatedBoard : board
        );

        setBoards(tempUpdatedBoards);
        setCurrentBoard(tempUpdatedBoard);

        // Now do the actual file processing
        const soundsDirectory = SoundManager.getSoundsDirectoryPath();
        if (!soundObj.uri.startsWith(soundsDirectory.uri)) {
          const soundMeta = await SoundManager.addSound(
            soundObj.uri,
            fileName,
            currentBoard.name
          );

          soundObj.uri = soundMeta.uri;
        }

        // Update with the final data (without the processing flag)
        const finalUpdatedBoard = {
          ...currentBoard,
          sounds: [...currentBoard.sounds, soundObj],
        };

        const finalUpdatedBoards = boards.map((board) =>
          board.id === currentBoard.id ? finalUpdatedBoard : board
        );

        setBoards(finalUpdatedBoards);
        setCurrentBoard(finalUpdatedBoard);
        saveBoardsToStorage(finalUpdatedBoards);
      } catch (error) {
        console.error("Error adding sound to board:", error);
        // Remove the temporary sound if there was an error
        if (currentBoard) {
          const fallbackBoard = {
            ...currentBoard,
            sounds: currentBoard.sounds.filter((sound) => !sound._processing),
          };

          const fallbackBoards = boards.map((board) =>
            board.id === currentBoard.id ? fallbackBoard : board
          );

          setBoards(fallbackBoards);
          setCurrentBoard(fallbackBoard);
        }
      }
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
