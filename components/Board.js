import React, { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppContext from "../core/context/appContext";
import BoardItem from "./BoardItem";
import CreateBoardItem from "./CreateBoardItem";

const Board = () => {
  const state = useContext(AppContext);
  const { soundBoard } = state;
  return (
    <View style={styles.boardArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {soundBoard &&
          soundBoard.map((i, k) => (
            <BoardItem key={k} id={i.id} src={i.uri} name={i.name} />
          ))}
        <CreateBoardItem />
      </ScrollView>
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
    height: "100%",
  },
});
