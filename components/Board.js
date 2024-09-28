import React, { useContext } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import BoardItem from "./BoardItem";
import CreateBoardItem from "./CreateBoardItem";
import { StatusBar } from "expo-status-bar";
import { normalize } from "../core/responsive";
import { AppContext } from "../core/context/AppState";

const Board = ({ navigation }) => {
  const { soundBoard } = useContext(AppContext);

  return (
    <View style={styles.board}>
      <StatusBar style="auto" />
      <View style={styles.title}>
        <Text style={styles.titleText}>SoundBoard</Text>
      </View>
      <View style={styles.boardArea}>
        <CreateBoardItem />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {soundBoard?.map((item, index) => (
            <BoardItem
              key={index}
              navigation={navigation}
              sid={item.sid}
              src={item.uri}
              name={item.name}
              title={item.title}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({
  board: {
    flex: 1,
    backgroundColor: "#DBAD6A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 35,
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },

  boardArea: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    flex: 8,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    ...Platform.select({
      default: {
        height: "85%",
      },
    }),
  },

  scroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },

  title: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },

  titleText: {
    fontSize: normalize(35),
    fontWeight: "bold",
    color: "white",
  },
});
