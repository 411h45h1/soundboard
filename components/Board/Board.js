import React, { useContext, useState, useRef, useEffect } from "react";
import { View, ScrollView, Alert, ActivityIndicator, Text } from "react-native";
import { AppContext } from "../../core/context/AppState";
import { useIsLandscape, normalize } from "../../core/responsive";
import { triggerHaptic } from "../../src/utils/haptics";
import SoundManager from "../../src/utils/SoundManager";
import PopupModal from "../PopupModal";
import RecordAudioButton from "../RecordAudioButton";
import BoardHeader from "./BoardHeader";
import BoardControls from "./BoardControls";
import BoardSelectPanel from "./BoardSelectPanel";
import SoundGrid from "./SoundGrid";
import Instructions from "./Instructions";
import CreateBoardModal from "./CreateBoardModal";
import RenameBoardModal from "./RenameBoardModal";
import StopAllSoundsButton from "./StopAllSoundsButton";

const Board = ({ navigation }) => {
  const {
    currentBoard,
    boards,
    createBoard,
    switchBoard,
    removeSoundboardItem,
    removeBoard,
    renameBoard,
  } = useContext(AppContext);

  const [newBoardName, setNewBoardName] = useState("");
  const [renameBoardName, setRenameBoardName] = useState("");
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showRenameBoard, setShowRenameBoard] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSelectBoard, setShowSelectBoard] = useState(false);
  const [isLoadingSounds, setIsLoadingSounds] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const playingSounds = useRef([]);
  const isLandscape = useIsLandscape();

  useEffect(() => {
    const validateSoundsInBatches = async () => {
      if (
        !currentBoard ||
        !currentBoard.sounds ||
        currentBoard.sounds.length === 0
      ) {
        setInitialLoad(false);
        return;
      }

      if (initialLoad) {
        setIsLoadingSounds(true);
      }

      const BATCH_SIZE = 10;
      const totalSounds = currentBoard.sounds.length;
      let processedSounds = 0;

      while (processedSounds < totalSounds) {
        const batch = currentBoard.sounds.slice(
          processedSounds,
          Math.min(processedSounds + BATCH_SIZE, totalSounds)
        );

        for (const sound of batch) {
          await SoundManager.validateSound({ uri: sound.uri });
        }

        processedSounds += batch.length;

        // Allow UI to update between batches
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      setIsLoadingSounds(false);
      setInitialLoad(false);
    };

    validateSoundsInBatches();
  }, [currentBoard]);

  // Updated stopAllSounds function to notify all playing components
  const stopAllSounds = async () => {
    triggerHaptic("medium");

    if (playingSounds.current.length > 0) {
      // First stop all sound objects
      await Promise.all(
        playingSounds.current.map((sound) => {
          try {
            return sound.unloadAsync();
          } catch (error) {
            console.error("Error stopping sound:", error);
            return Promise.resolve();
          }
        })
      );

      // Now notify all registered components to update their UI
      if (global.soundBoardRegistry) {
        Object.values(global.soundBoardRegistry).forEach((listener) => {
          if (typeof listener === "function") {
            listener();
          }
        });
      }

      // Clear the playing sounds array
      playingSounds.current = [];
    }
  };

  // This function gets called when a sound is played
  const handleSoundPlay = (sound) => {
    // First, check if this sound is already in our array (prevent duplicates)
    const existingIndex = playingSounds.current.findIndex(
      (s) => s._boardItemId === sound._boardItemId
    );

    if (existingIndex !== -1) {
      // Replace the existing sound with the new one
      playingSounds.current[existingIndex] = sound;
    } else {
      // Add the new sound to the array
      playingSounds.current.push(sound);
    }
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      triggerHaptic("success");
      createBoard(newBoardName);
      setNewBoardName("");
      setShowCreateBoard(false);
    } else {
      triggerHaptic("error");
    }
  };

  const handleRenameBoard = () => {
    if (!currentBoard) return;
    if (renameBoardName.trim()) {
      triggerHaptic("success");
      renameBoard(currentBoard.id, renameBoardName);
      setRenameBoardName("");
      setShowRenameBoard(false);
    } else {
      triggerHaptic("error");
    }
  };

  const handleDeleteBoard = () => {
    if (!currentBoard) return;
    triggerHaptic("warning");
    Alert.alert(
      "Delete Board",
      `Are you sure you want to delete the board: ${currentBoard.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            triggerHaptic("heavy");
            removeBoard(currentBoard.id);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#5E403F",
        paddingHorizontal: 5,
      }}
    >
      <BoardHeader isLandscape={isLandscape} />

      {currentBoard && (
        <View
          style={{
            flex: 1,
            backgroundColor: "#5E403F",
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
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

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  fontSize: isLandscape ? normalize(10) : normalize(15),
                  color: "#EAE0D5",
                  textAlign: "left",
                }}
              >
                Board Selected: {currentBoard.name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <StopAllSoundsButton stopAllSounds={stopAllSounds} />
              <RecordAudioButton />
            </View>

            {isLoadingSounds && initialLoad ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#EAE0D5" />
                <Text style={{ color: "#EAE0D5", marginTop: 10 }}>
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
        backgroundColor="#5E403F"
        borderRadius={10}
        width="90%"
      >
        <Instructions setShowInstructions={setShowInstructions} />
      </PopupModal>
    </View>
  );
};

export default Board;
