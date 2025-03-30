import React from "react";
import { View } from "react-native";
import BoardItem from "./BoardItem";

const SoundGrid = ({
  sounds,
  navigation,
  onPlaySound,
  removeSoundboardItem,
}) => {
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
      {sounds.map((item, index) => (
        <BoardItem
          key={`${item.sid}-${item.uri}`}
          navigation={navigation}
          sid={item.sid}
          src={item.uri}
          name={item.name}
          title={item.title}
          onPlaySound={onPlaySound}
          removeSoundboardItem={removeSoundboardItem}
        />
      ))}
    </View>
  );
};

export default SoundGrid;
