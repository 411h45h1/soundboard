import React, { useContext } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import BoardItem from "./BoardItem";
import CreateBoardItem from "./CreateBoardItem";
import { normalize } from "../core/responsive";
import { AppContext } from "../core/context/AppState";

const Board = ({ navigation }) => {
  const { soundBoard } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>SoundBoard</Text>
      </View>
      <View style={styles.boardArea}>
        <CreateBoardItem />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
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
  container: {
    flex: 1,
    backgroundColor: "#5E503F",
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  titleContainer: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: normalize(35),
    fontWeight: "bold",
    color: "#EAE0D5",
  },
  boardArea: {
    flex: 1,
    backgroundColor: "#5E503F",
  },
  scrollContainer: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});
