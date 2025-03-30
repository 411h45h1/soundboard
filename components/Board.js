import React, { useContext, useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import BoardItem from "./BoardItem";
import CreateBoardItem from "./CreateBoardItem";
import { useIsLandscape, normalize } from "../core/responsive";
import { AppContext } from "../core/context/AppState";
import RecordAudioButton from "./RecordAudioButton";
import SoundManager from "../src/utils/SoundManager";
import { triggerHaptic, withHaptics } from "../src/utils/haptics";
import PopupModal from "./PopupModal";

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

  const renderInstructions = () => (
    <View style={{ padding: 10 }}>
      <Text
        style={{
          fontSize: normalize(18),
          fontWeight: "bold",
          color: "#EAE0D5",
          marginBottom: 15,
          textAlign: "center",
        }}
      >
        How to Use SoundBoard
      </Text>

      <Text
        style={{ fontSize: normalize(14), color: "#EAE0D5", marginBottom: 10 }}
      >
        • <Text style={{ fontWeight: "bold" }}>Play a sound:</Text> Tap on any
        sound tile
      </Text>

      <Text
        style={{ fontSize: normalize(14), color: "#EAE0D5", marginBottom: 10 }}
      >
        • <Text style={{ fontWeight: "bold" }}>Stop a sound:</Text> Tap the
        sound tile again while it's playing
      </Text>

      <Text
        style={{ fontSize: normalize(14), color: "#EAE0D5", marginBottom: 10 }}
      >
        • <Text style={{ fontWeight: "bold" }}>Edit a sound:</Text> Long-press
        on a sound tile, then tap "Edit"
      </Text>

      <Text
        style={{ fontSize: normalize(14), color: "#EAE0D5", marginBottom: 10 }}
      >
        • <Text style={{ fontWeight: "bold" }}>Delete a sound:</Text> Long-press
        on a sound tile, then tap "Delete"
      </Text>

      <Text
        style={{ fontSize: normalize(14), color: "#EAE0D5", marginBottom: 10 }}
      >
        • <Text style={{ fontWeight: "bold" }}>Add a sound:</Text> Tap "Add
        Sound" in the controls
      </Text>

      <Text
        style={{ fontSize: normalize(14), color: "#EAE0D5", marginBottom: 10 }}
      >
        • <Text style={{ fontWeight: "bold" }}>Record a sound:</Text> Tap
        "Record", then tap again to stop recording
      </Text>

      <Text
        style={{ fontSize: normalize(14), color: "#EAE0D5", marginBottom: 10 }}
      >
        • <Text style={{ fontWeight: "bold" }}>Stop all sounds:</Text> Tap "Stop
        All Sounds" button
      </Text>

      <Text
        style={{ fontSize: normalize(14), color: "#EAE0D5", marginBottom: 10 }}
      >
        • <Text style={{ fontWeight: "bold" }}>Switch boards:</Text> Tap "Select
        Board", then choose a board
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#646F4B",
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 15,
        }}
        onPress={withHaptics("selection", () => setShowInstructions(false))}
      >
        <Text
          style={{
            color: "#EAE0D5",
            fontWeight: "bold",
            fontSize: normalize(16),
          }}
        >
          Got it!
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSoundsGrid = () => {
    if (isLoadingSounds && initialLoad) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#EAE0D5" />
          <Text style={{ color: "#EAE0D5", marginTop: 10 }}>
            Loading sounds...
          </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          flexGrow: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          paddingTop: 10,
        }}
      >
        {currentBoard.sounds.map((item, index) => (
          <BoardItem
            key={`${item.sid}-${item.uri}`}
            navigation={navigation}
            sid={item.sid}
            src={item.uri}
            name={item.name}
            title={item.title}
            onPlaySound={handleSoundPlay}
            removeSoundboardItem={removeSoundboardItem}
          />
        ))}
      </View>
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
      <View
        style={{
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: isLandscape ? normalize(10) : normalize(35),
            fontWeight: "bold",
            color: "#EAE0D5",
          }}
        >
          SoundBoard
        </Text>
      </View>

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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  backgroundColor: "#A5787850",
                  padding: 7,
                }}
                onPress={withHaptics("selection", () =>
                  setShowSelectBoard(!showSelectBoard)
                )}
              >
                <Text
                  style={{
                    color: "#EAE0D5",
                    fontWeight: "bold",
                    fontSize: normalize(16),
                  }}
                >
                  {showSelectBoard ? "Hide Select Board" : "Select Board"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  backgroundColor: "#A5787850",
                  padding: 7,
                }}
                onPress={withHaptics("selection", () => {
                  setShowControls(!showControls);
                })}
              >
                <Text
                  style={{
                    color: "#EAE0D5",
                    fontWeight: "bold",
                    fontSize: normalize(16),
                  }}
                >
                  {showControls ? "Hide Controls" : "Controls"}
                </Text>
              </TouchableOpacity>
            </View>

            {showSelectBoard && boards.length > 0 && (
              <View
                style={{
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: normalize(16),
                    fontWeight: "bold",
                    color: "#EAE0D5",
                    marginBottom: 10,
                  }}
                >
                  Select Board:
                </Text>
                <ScrollView
                  horizontal
                  contentContainerStyle={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  showsHorizontalScrollIndicator={false}
                >
                  {boards.map((board) => (
                    <TouchableOpacity
                      key={board.id}
                      style={[
                        {
                          backgroundColor: "#C89F9C",
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                          borderRadius: 10,
                          marginRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        currentBoard &&
                          currentBoard.id === board.id && {
                            backgroundColor: "#5A9F5A",
                          },
                      ]}
                      onPress={withHaptics("selection", () =>
                        switchBoard(board.id)
                      )}
                    >
                      <Text
                        style={{
                          fontSize: normalize(16),
                          color: "#EAE0D5",
                          fontWeight: "bold",
                        }}
                      >
                        {board.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {showControls && (
              <View>
                <Text
                  style={{
                    fontSize: normalize(16),
                    fontWeight: "bold",
                    color: "#EAE0D5",
                    marginBottom: 10,
                  }}
                >
                  Controls:
                </Text>
                <ScrollView
                  horizontal
                  style={{
                    backgroundColor: "#A57878",
                    borderRadius: 5,
                    paddingTop: 10,
                    marginBottom: 10,
                  }}
                  contentContainerStyle={{
                    flexDirection: "row",
                    marginBottom: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      marginRight: 10,
                      alignItems: "center",
                    }}
                    onPress={withHaptics("selection", () =>
                      setShowInstructions(true)
                    )}
                  >
                    <Text
                      style={{
                        color: "#EAE0D5",
                        fontWeight: "bold",
                        fontSize: normalize(16),
                      }}
                    >
                      Instructions
                    </Text>
                  </TouchableOpacity>
                  <CreateBoardItem />
                  <TouchableOpacity
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      marginRight: 10,
                      alignItems: "center",
                    }}
                    onPress={() => setShowCreateBoard(!showCreateBoard)}
                  >
                    <Text
                      style={{
                        color: "#EAE0D5",
                        fontWeight: "bold",
                        fontSize: normalize(16),
                      }}
                    >
                      Add Board
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      marginRight: 10,
                      alignItems: "center",
                    }}
                    onPress={() => setShowRenameBoard(!showRenameBoard)}
                  >
                    <Text
                      style={{
                        color: "#EAE0D5",
                        fontWeight: "bold",
                        fontSize: normalize(16),
                      }}
                    >
                      Rename Board
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      marginRight: 10,
                      alignItems: "center",
                      backgroundColor: "#D9534F",
                    }}
                    onPress={handleDeleteBoard}
                  >
                    <Text
                      style={{
                        color: "#EAE0D5",
                        fontWeight: "bold",
                        fontSize: normalize(16),
                      }}
                    >
                      Delete Board
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}

            {showCreateBoard && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <TextInput
                  placeholder="New Board Name"
                  value={newBoardName}
                  onChangeText={setNewBoardName}
                  style={{
                    flex: 1,
                    backgroundColor: "#A57878",
                    height: "100%",
                    borderRadius: 5,
                    marginRight: 10,
                    paddingLeft: 10,
                    color: "white",
                  }}
                  placeholderTextColor="#EAE0D580"
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#A57878",
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                  }}
                  onPress={handleCreateBoard}
                >
                  <Text
                    style={{
                      color: "#EAE0D5",
                      fontWeight: "bold",
                      fontSize: normalize(16),
                    }}
                  >
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {showRenameBoard && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <TextInput
                  placeholder="Rename Board"
                  value={renameBoardName}
                  onChangeText={setRenameBoardName}
                  style={{
                    flex: 1,
                    backgroundColor: "#A57878",
                    height: "100%",
                    borderRadius: 5,
                    marginRight: 10,
                    paddingLeft: 10,
                    color: "white",
                  }}
                  placeholderTextColor="#EAE0D580"
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#A57878",
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                  }}
                  onPress={handleRenameBoard}
                >
                  <Text
                    style={{
                      color: "#EAE0D5",
                      fontWeight: "bold",
                      fontSize: normalize(16),
                    }}
                  >
                    Rename
                  </Text>
                </TouchableOpacity>
              </View>
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
              <TouchableOpacity
                style={{
                  backgroundColor: "#D9534F",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "60%",
                }}
                onPress={withHaptics("medium", stopAllSounds)}
              >
                <Text
                  style={{
                    color: "#EAE0D5",
                    fontWeight: "bold",
                    fontSize: normalize(16),
                  }}
                >
                  Stop All Sounds
                </Text>
              </TouchableOpacity>
              <RecordAudioButton />
            </View>

            {renderSoundsGrid()}
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
        {renderInstructions()}
      </PopupModal>
    </View>
  );
};

export default Board;
