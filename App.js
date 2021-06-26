import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Board from "./components/Board";
import AppState from "./core/context/AppState";

export default function App() {
  return (
    <AppState>
      <View style={styles.container}>
        <View style={styles.board}>
          <StatusBar style="auto" />
          <View style={styles.title}>
            <Text style={styles.titleText}>SoundBoard</Text>
          </View>

          <Board />
        </View>
      </View>
    </AppState>
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
    marginVertical: 25,
    marginHorizontal: 10,
    backgroundColor: "#DBAD6A",
    borderRadius: 10,
    padding: 10,
  },

  title: {
    flex: 2,
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
