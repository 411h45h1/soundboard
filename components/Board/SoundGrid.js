import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import BoardItem from "./BoardItem";
import { isTablet } from "../../core/responsive";

const SoundGrid = ({
  sounds,
  navigation,
  onPlaySound,
  removeSoundboardItem,
}) => {
  // Calculate how many columns based on screen width and device type
  const screenWidth = Dimensions.get("window").width;
  const isTabletDevice = isTablet();

  // Configure the grid to have more columns on tablets
  const numColumns = isTabletDevice
    ? screenWidth > 1000
      ? 5
      : 4 // More columns on larger tablets
    : screenWidth > 400
    ? 3
    : 2; // Fewer columns on phones

  return (
    <View style={styles.gridContainer}>
      {sounds.map((item) => (
        <View
          key={`${item.sid}-${item.uri}`}
          style={[styles.itemContainer, { width: `${100 / numColumns}%` }]}
        >
          <BoardItem
            navigation={navigation}
            sid={item.sid}
            src={item.uri}
            name={item.name}
            title={item.title}
            onPlaySound={onPlaySound}
            removeSoundboardItem={removeSoundboardItem}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  itemContainer: {
    paddingHorizontal: 5,
    marginBottom: 15,
  },
});

export default SoundGrid;
