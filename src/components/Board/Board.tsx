import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { AppContext } from '../../core/context/AppState';
import { useIsLandscape, normalize } from '../../core/responsive';
import { triggerHaptic } from '../../utils/haptics';
import PopupModal from '../PopupModal';
import RecordAudioButton from '../RecordAudioButton';
import BoardHeader from './BoardHeader';
import BoardControls from './BoardControls';
import BoardSelectPanel from './BoardSelectPanel';
import SoundGrid from './SoundGrid';
import Instructions from './Instructions';
import CreateBoardModal from './CreateBoardModal';
import RenameBoardModal from './RenameBoardModal';
import StopAllSoundsButton from './StopAllSoundsButton';
import { BoardProps, SoundItem, AppContextType } from '../../types';
import { GlobalStyles } from '@/constants/styles';
import { Colors } from '@/constants/colors';

const Board: React.FC<BoardProps> = ({ navigation }) => {
  const {
    currentBoard,
    boards,
    createBoard,
    switchBoard,
    removeSoundboardItem,
    removeBoard,
    renameBoard,
  } = useContext(AppContext) as AppContextType;

  const [newBoardName, setNewBoardName] = useState<string>('');
  const [renameBoardName, setRenameBoardName] = useState<string>('');
  const [showCreateBoard, setShowCreateBoard] = useState<boolean>(false);
  const [showRenameBoard, setShowRenameBoard] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSelectBoard, setShowSelectBoard] = useState<boolean>(false);
  const [isLoadingSounds, setIsLoadingSounds] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const playingSounds = useRef<SoundItem[]>([]);
  const isLandscape = useIsLandscape();

  useEffect(() => {
    if (currentBoard && currentBoard.sounds && currentBoard.sounds.length > 0) {
      if (initialLoad) {
        setTimeout(() => {
          setIsLoadingSounds(false);
          setInitialLoad(false);
        }, 0);
      }
    } else {
      setTimeout(() => {
        setInitialLoad(false);
      }, 0);
    }
  }, [currentBoard, initialLoad]);

  const stopAllSounds = async () => {
    triggerHaptic('medium');

    if (playingSounds.current.length > 0) {
      playingSounds.current = [];

      if (global.soundBoardRegistry) {
        Object.values(global.soundBoardRegistry).forEach(listener => {
          if (typeof listener === 'function') {
            listener();
          }
        });
      }
    }
  };

  const handleSoundPlay = (sound: SoundItem) => {
    const existingIndex = playingSounds.current.findIndex(
      s => s._boardItemId === sound._boardItemId
    );

    if (existingIndex !== -1) {
      playingSounds.current[existingIndex] = sound;
    } else {
      playingSounds.current.push(sound);
    }
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      triggerHaptic('success');
      createBoard(newBoardName);
      setNewBoardName('');
      setShowCreateBoard(false);
    } else {
      triggerHaptic('error');
    }
  };

  const handleRenameBoard = () => {
    if (!currentBoard) return;
    if (renameBoardName.trim()) {
      triggerHaptic('success');
      renameBoard(currentBoard.id, renameBoardName);
      setRenameBoardName('');
      setShowRenameBoard(false);
    } else {
      triggerHaptic('error');
    }
  };

  const handleDeleteBoard = () => {
    if (!currentBoard) return;
    triggerHaptic('warning');
    Alert.alert(
      'Delete Board',
      `Are you sure you want to delete the board: ${currentBoard.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            triggerHaptic('heavy');
            removeBoard(currentBoard.id);
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={GlobalStyles.containerWithPaddingSmall}>
      <BoardHeader isLandscape={isLandscape} />

      {currentBoard && (
        <View style={GlobalStyles.container}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={GlobalStyles.paddingHorizontal10}
          >
            <BoardControls
              showSelectBoard={showSelectBoard}
              setShowSelectBoard={setShowSelectBoard}
              showControls={showControls}
              setShowControls={setShowControls}
            />

            {showSelectBoard && boards.length > 0 && (
              <BoardSelectPanel
                boards={boards}
                currentBoard={currentBoard}
                switchBoard={switchBoard}
              />
            )}

            {showControls && (
              <BoardControls.ControlPanel
                setShowInstructions={setShowInstructions}
                setShowCreateBoard={setShowCreateBoard}
                showCreateBoard={showCreateBoard}
                setShowRenameBoard={setShowRenameBoard}
                showRenameBoard={showRenameBoard}
                handleDeleteBoard={handleDeleteBoard}
              />
            )}

            {showCreateBoard && (
              <CreateBoardModal
                newBoardName={newBoardName}
                setNewBoardName={setNewBoardName}
                handleCreateBoard={handleCreateBoard}
              />
            )}

            {showRenameBoard && (
              <RenameBoardModal
                renameBoardName={renameBoardName}
                setRenameBoardName={setRenameBoardName}
                handleRenameBoard={handleRenameBoard}
              />
            )}

            <View style={GlobalStyles.rowWrap}>
              <Text
                style={[
                  styles.boardNameText,
                  { fontSize: isLandscape ? normalize(10) : normalize(15) },
                ]}
              >
                Board Selected: {currentBoard.name}
              </Text>
            </View>

            <View style={[GlobalStyles.rowBetween, GlobalStyles.marginTop5]}>
              <StopAllSoundsButton stopAllSounds={stopAllSounds} />
              <RecordAudioButton />
            </View>

            {isLoadingSounds && initialLoad ? (
              <View style={[GlobalStyles.padding20, GlobalStyles.center]}>
                <ActivityIndicator size="large" color={Colors.text} />
                <Text style={[GlobalStyles.textLight, GlobalStyles.marginTop10]}>
                  Loading sounds...
                </Text>
              </View>
            ) : (
              <SoundGrid
                sounds={currentBoard.sounds}
                navigation={navigation}
                onPlaySound={handleSoundPlay}
                removeSoundboardItem={removeSoundboardItem}
              />
            )}
          </ScrollView>
        </View>
      )}

      <PopupModal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
        backgroundColor={Colors.primary}
        borderRadius={10}
        width="90%"
        height={600}
      >
        <Instructions setShowInstructions={setShowInstructions} />
      </PopupModal>
    </View>
  );
};

const styles = StyleSheet.create({
  boardNameText: {
    color: Colors.text,
    textAlign: 'left',
  },
});

export default Board;
