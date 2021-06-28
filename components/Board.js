import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppContext from "../core/context/appContext";
import BoardItem from "./BoardItem";
import CreateBoardItem from "./CreateBoardItem";
import { StatusBar } from "expo-status-bar";

const Board = ({ navigation }) => {
  const state = useContext(AppContext);
  const { soundBoard } = state;
  return (
    <View style={styles.board}>
      <StatusBar style="auto" />
      <View style={styles.title}>
        <Text style={styles.titleText}>SoundBoard</Text>
      </View>
      <View style={styles.boardArea}>
        <CreateBoardItem />
        <ScrollView contentContainerStyle={styles.scroll}>
          {soundBoard &&
            soundBoard.map((i, k) => (
              <BoardItem
                key={k}
                navigation={navigation}
                sid={i.sid && i.sid}
                src={i.uri && i.uri}
                name={i.name && i.name}
                title={i.title && i.title}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({
  boardArea: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    flex: 8,
    width: "100%",
    padding: 10,
  },

  scroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },

  board: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 30,
    marginHorizontal: 10,
    backgroundColor: "#DBAD6A",
    borderRadius: 10,
    padding: 10,
  },

  title: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },

  titleText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
});
