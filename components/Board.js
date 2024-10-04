import React, { useContext, useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import BoardItem from "./BoardItem";
import CreateBoardItem from "./CreateBoardItem";
import { isLandscape, isTablet, normalize } from "../core/responsive";
import { AppContext } from "../core/context/AppState";

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
  const playingSounds = useRef([]);

  const stopAllSounds = async () => {
    if (playingSounds.current.length > 0) {
      await Promise.all(
        playingSounds.current.map((sound) => sound.unloadAsync())
      );
      playingSounds.current = [];
    }
  };

  const handleSoundPlay = (sound) => {
    playingSounds.current.push(sound);
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName);
      setNewBoardName("");
      setShowCreateBoard(false);
    }
  };

  const handleRenameBoard = () => {
    if (!currentBoard) return;
    if (renameBoardName.trim()) {
      renameBoard(currentBoard.id, renameBoardName);
      setRenameBoardName("");
      setShowRenameBoard(false);
    }
  };

  const handleDeleteBoard = () => {
    if (!currentBoard) return;
    Alert.alert(
      "Delete Board",
      `Are you sure you want to delete the board ${currentBoard.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            removeBoard(currentBoard.id);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>SoundBoard</Text>
      </View>

      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowSelectBoard(!showSelectBoard)}
        >
          <Text style={styles.toggleButtonText}>
            {showSelectBoard ? "Hide Select Board" : "Select Board"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            setShowControls(!showControls);
          }}
        >
          <Text style={styles.toggleButtonText}>
            {showControls ? "Hide Controls" : "Controls"}
          </Text>
        </TouchableOpacity>
      </View>

      {showSelectBoard && boards.length > 0 && (
        <View style={styles.boardSelector}>
          <Text style={styles.selectBoardText}>Select Board:</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.boardList}
            showsHorizontalScrollIndicator={false}
          >
            {boards.map((board) => (
              <TouchableOpacity
                key={board.id}
                style={[
                  styles.boardButton,
                  currentBoard &&
                    currentBoard.id === board.id &&
                    styles.activeBoard,
                ]}
                onPress={() => switchBoard(board.id)}
              >
                <Text style={styles.boardButtonText}>{board.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {showControls && (
        <View>
          <Text style={styles.selectBoardText}>Controls:</Text>
          <ScrollView
            horizontal
            style={{
              backgroundColor: "#A57878",
              borderRadius: 5,
              paddingTop: 10,
              marginBottom: 10,
            }}
            contentContainerStyle={styles.actionButtons}
          >
            <CreateBoardItem />
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowCreateBoard(!showCreateBoard)}
            >
              <Text style={styles.controlButtonText}>Add Board</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowRenameBoard(!showRenameBoard)}
            >
              <Text style={styles.controlButtonText}>Rename Board</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.deleteBoardButton]}
              onPress={handleDeleteBoard}
            >
              <Text style={styles.controlButtonText}>Delete Board</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {showCreateBoard && (
        <View style={styles.newBoardContainer}>
          <TextInput
            placeholder="New Board Name"
            value={newBoardName}
            onChangeText={setNewBoardName}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.createBoardButton}
            onPress={handleCreateBoard}
          >
            <Text style={styles.createBoardText}>Create</Text>
          </TouchableOpacity>
        </View>
      )}

      {showRenameBoard && (
        <View style={styles.newBoardContainer}>
          <TextInput
            placeholder="Rename Board"
            value={renameBoardName}
            onChangeText={setRenameBoardName}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.createBoardButton}
            onPress={handleRenameBoard}
          >
            <Text style={styles.createBoardText}>Rename</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentBoard && (
        <View style={styles.boardArea}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Text style={styles.boardNameText}>
                Board Selected: {currentBoard.name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.stopAllButton}
              onPress={stopAllSounds}
            >
              <Text style={styles.stopAllText}>Stop All Sounds</Text>
            </TouchableOpacity>

            <View style={styles.scrollContainer}>
              {currentBoard.sounds.map((item, index) => (
                <BoardItem
                  key={index}
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
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5E403F",
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  titleContainer: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: isLandscape() && isTablet() ? normalize(10) : normalize(35),
    fontWeight: "bold",
    color: "#EAE0D5",
  },
  boardNameText: {
    fontSize: isLandscape() && isTablet() ? normalize(10) : normalize(15),
    color: "#EAE0D5",
    textAlign: "left",
  },
  toggleButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toggleButton: {
    borderRadius: 10,
  },
  toggleButtonText: {
    color: "#EAE0D5",
    fontWeight: "bold",
    fontSize: isLandscape() && isTablet() ? normalize(8) : normalize(16),
  },
  boardSelector: {
    marginBottom: 20,
  },
  selectBoardText: {
    fontSize: isLandscape() && isTablet() ? normalize(8) : normalize(16),
    fontWeight: "bold",
    color: "#EAE0D5",
    marginBottom: 10,
  },
  boardList: {
    flexDirection: "row",
    alignItems: "center",
  },
  boardButton: {
    backgroundColor: "#C89F9C",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBoard: {
    backgroundColor: "#5A9F5A",
  },
  boardButtonText: {
    fontSize: isLandscape() && isTablet() ? normalize(10) : normalize(16),
    color: "#EAE0D5",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 10,
  },
  controlButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  controlButtonText: {
    color: "#EAE0D5",
    fontWeight: "bold",
    fontSize: isLandscape() && isTablet() ? normalize(10) : normalize(16),
  },
  deleteBoardButton: {
    backgroundColor: "#D9534F",
  },
  stopAllButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },
  stopAllText: {
    color: "#EAE0D5",
    fontWeight: "bold",
    fontSize: isLandscape() && isTablet() ? normalize(10) : normalize(16),
  },
  newBoardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#A57878",
    height: "100%",
    borderRadius: 5,
    marginRight: 10,
  },
  createBoardButton: {
    backgroundColor: "#A57878",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  createBoardText: {
    color: "#EAE0D5",
    fontWeight: "bold",
    fontSize: isLandscape() && isTablet() ? normalize(10) : normalize(16),
  },
  boardArea: {
    flex: 1,
    backgroundColor: "#5E403F",
  },
  scrollContainer: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});
