import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BoardItem from "./components/BoardItem";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <StatusBar style="auto" />
        <View style={styles.title}>
          <Text style={styles.titleText}>SoundBoard</Text>
        </View>

        <View style={styles.boardArea}>
          <BoardItem />
          <BoardItem />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#96897B",
  },

  board: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px",
    backgroundColor: "#DBAD6A",
    borderRadius: 10,
    padding: "10px",
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

  boardArea: {
    flex: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    border: "2px solid black",
    width: "100%",
    borderRadius: 10,
    padding: "10px",
  },
});
