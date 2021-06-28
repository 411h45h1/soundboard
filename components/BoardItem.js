import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import AppContext from "../core/context/appContext";
import { normalize } from "../core/responsive";

export default class BoardItem extends Component {
  static contextType = AppContext;
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      playbackInstance: null,
      volume: 1.0,
      isBuffering: true,
      showDelete: false,
    };
    this.playbackInstance = new Audio.Sound();
  }

  async componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: true,
        });

        await this.loadAudio();
      } catch (e) {
        console.log(e);
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.playbackInstance.unloadAsync();
  }

  async loadAudio() {
    if (this._isMounted) {
      const { isPlaying, volume } = this.state;
      const { src } = this.props;

      try {
        const source = {
          uri: src,
        };

        const status = {
          shouldPlay: isPlaying,
          volume: volume,
        };

        this.playbackInstance.setOnPlaybackStatusUpdate(
          this.onPlaybackStatusUpdate
        );
        await this.playbackInstance.loadAsync(source, status, false);
      } catch (e) {
        console.log(e);
      }
    }
  }

  onPlaybackStatusUpdate = async (status) => {
    if (this._isMounted) {
      this.setState({
        isBuffering: status.isBuffering,
      });

      if (status.didJustFinish === true) {
        // audio has finished!
        this.setState({
          isPlaying: false,
        });
        await this.playbackInstance.stopAsync();
        await this.playbackInstance.unloadAsync();

        await this.loadAudio();
      }
    }
  };

  handlePlayPause = async () => {
    if (this._isMounted) {
      const { isPlaying } = this.state;
      isPlaying
        ? await this.playbackInstance.pauseAsync()
        : await this.playbackInstance.playAsync();

      return this.setState({
        isPlaying: !isPlaying,
      });
    }
  };

  render() {
    const { showDelete } = this.state;
    const { sid, name, title, navigation } = this.props;
    const { removeSoundboardItem } = this.context;
    return (
      <View style={styles.cont}>
        {showDelete ? (
          <View style={styles.modArea}>
            <TouchableOpacity
              style={styles.edit}
              // onPress={() => removeSoundboardItem(id)}
              onPress={() =>
                navigation.navigate("Edit", {
                  sid,
                  fileName: name,
                  title,
                })
              }
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.delete}
              onPress={() => removeSoundboardItem(sid)}
            >
              <Text style={styles.buttonText}>Delete?</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.soundButton}
          onPress={this.handlePlayPause}
          onLongPress={() => this.setState({ showDelete: !showDelete })}
        >
          {this.state.isPlaying ? (
            <Ionicons
              name="pause"
              size={normalize(14)}
              style={styles.playerButton}
            />
          ) : (
            <Ionicons
              name="ios-play"
              size={normalize(14)}
              style={styles.playerButton}
            />
          )}
          {title ? (
            <Text style={styles.buttonText}>{title} </Text>
          ) : (
            <Text style={styles.buttonText}>File: {name}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: "bold",
    fontSize: normalize(12),
    color: "white",
  },
  cont: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 15,
    width: normalize(90),
  },

  soundButton: {
    width: "100%",
    minWidth: 100,
    padding: 2,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#646F4B",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  modArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  delete: {
    margin: 2,
    padding: 5,
    backgroundColor: "tomato",
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },

  edit: {
    margin: 2,
    padding: 5,
    backgroundColor: "#646F4B",
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },

  playerButton: {
    alignSelf: "flex-end",
  },
});
