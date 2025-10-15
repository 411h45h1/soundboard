import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContextType, Board, SoundItem } from '../../types';

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const AppState: React.FC<{ children: React.ReactNode }> = props => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);

  const saveBoardsToStorage = useCallback(async (updatedBoards: Board[]) => {
    try {
      await AsyncStorage.setItem('soundboards', JSON.stringify(updatedBoards));
    } catch (e) {
      console.error('Error saving boards:', e);
    }
  }, []);

  const createDefaultBoard = useCallback(async () => {
    try {
      const defaultBoard = {
        id: Date.now(),
        name: 'My First Board',
        sounds: [],
      };
      setBoards([defaultBoard]);
      setCurrentBoard(defaultBoard);
      await saveBoardsToStorage([defaultBoard]);
    } catch (e) {
      console.error('Error creating default board:', e);
    }
  }, [saveBoardsToStorage]);

  const getBoards = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('soundboards');
      if (jsonValue !== null) {
        const parsedBoards = JSON.parse(jsonValue);

        const validatedBoards = parsedBoards.map((board: Board) => ({
          ...board,
          sounds: board.sounds || [],
        }));

        setBoards(validatedBoards);
        if (validatedBoards.length > 0) setCurrentBoard(validatedBoards[0]);
      } else {
        createDefaultBoard();
      }
    } catch (e) {
      console.error('Error fetching boards:', e);
      createDefaultBoard();
    }
  }, [createDefaultBoard]);

  useEffect(() => {
    let mounted = true;

    const loadBoards = async () => {
      if (mounted) {
        await getBoards();
      }
    };

    loadBoards();

    return () => {
      mounted = false;
    };
  }, [getBoards]);

  const createBoard = useCallback(
    (name: string) => {
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
    async (soundObj: SoundItem) => {
      if (!currentBoard) return;

      try {
        const updatedBoard = {
          ...currentBoard,
          sounds: [...currentBoard.sounds, soundObj],
        };

        const updatedBoards = boards.map(board =>
          board.id === currentBoard.id ? updatedBoard : board
        );

        setBoards(updatedBoards);
        setCurrentBoard(updatedBoard);
        await saveBoardsToStorage(updatedBoards);
      } catch (error) {
        console.error('Error adding sound to board:', error);
        throw error;
      }
    },
    [currentBoard, boards, saveBoardsToStorage]
  );

  const updateBoardItem = useCallback(
    (sid: number, updatedData: Partial<SoundItem>) => {
      if (!currentBoard) return;

      const updatedBoard = {
        ...currentBoard,
        sounds: currentBoard.sounds.map(sound =>
          sound.sid === sid ? { ...sound, ...updatedData } : sound
        ),
      };

      const updatedBoards = boards.map(board =>
        board.id === currentBoard.id ? updatedBoard : board
      );

      setBoards(updatedBoards);
      setCurrentBoard(updatedBoard);
      saveBoardsToStorage(updatedBoards);
    },
    [currentBoard, boards, saveBoardsToStorage]
  );

  const removeSoundboardItem = useCallback(
    async (sid: number) => {
      if (!currentBoard) return;

      const updatedBoard = {
        ...currentBoard,
        sounds: currentBoard.sounds.filter(sound => sound.sid !== sid),
      };

      const updatedBoards = boards.map(board =>
        board.id === currentBoard.id ? updatedBoard : board
      );
      setBoards(updatedBoards);
      setCurrentBoard(updatedBoard);
      saveBoardsToStorage(updatedBoards);

      const defaultSoundNames = ['crash_notso_software.mp3', 'ding_notso_software.mp3'];
      const remainingSoundNames = updatedBoard.sounds.map(sound => sound.name);
      if (!defaultSoundNames.some(name => remainingSoundNames.includes(name))) {
        await AsyncStorage.setItem('defaultSoundsRemoved', 'true');
      }
    },
    [currentBoard, boards, saveBoardsToStorage]
  );

  const switchBoard = useCallback(
    (boardId: number) => {
      const selectedBoard = boards.find(board => board.id === boardId);
      if (selectedBoard) setCurrentBoard(selectedBoard);
    },
    [boards]
  );

  const removeBoard = useCallback(
    (boardId: number) => {
      const updatedBoards = boards.filter(board => board.id !== boardId);
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
    (boardId: number, newName: string) => {
      const updatedBoards = boards.map(board =>
        board.id === boardId ? { ...board, name: newName } : board
      );
      setBoards(updatedBoards);
      setCurrentBoard(updatedBoards.find(board => board.id === boardId) || null);
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

  return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
};

export { AppContext, AppState };
