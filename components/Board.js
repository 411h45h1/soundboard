import React, { useContext } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import AppContext from "../core/context/appContext";
import BoardItem from "./BoardItem";
import CreateBoardItem from "./CreateBoardItem";
import { StatusBar } from "expo-status-bar";
import { AdMobBanner } from "expo-ads-admob";
import { font, normalize } from "../core/responsive";

// ios Banner: ca-app-pub-6764675123042611/6264350124
// Android Banner: ca-app-pub-6764675123042611/3720827706

const Board = ({ navigation }) => {
  const state = useContext(AppContext);
  const { soundBoard } = state;
  const bannerAdId =
    Platform.OS === "ios"
      ? "ca-app-pub-6764675123042611/6264350124"
      : "ca-app-pub-6764675123042611/3720827706";

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
      {/* <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <AdMobBanner
          bannerSize="banner"
          adUnitID={bannerAdId}
          servePersonalizedAds={false}
        />
      </View> */}
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({
  boardArea: {
    width: "100%",
    padding: 10,
    marginBottom: 10,

    ...Platform.select({
      ios: {
        flex: 8,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
      },
      android: {
        flex: 8,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
      },
      default: {
        // other platforms, web for example
        height: "85%",
      },
    }),
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
    marginTop: 35,
    marginBottom: 20,
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
    ...Platform.select({
      ios: {
        fontSize: normalize(35),
      },
      android: {
        fontSize: normalize(35),
      },
      default: {
        // other platforms, web for example
        fontSize: "7vw",
      },
    }),
    fontWeight: "bold",
    color: "white",
  },
});
