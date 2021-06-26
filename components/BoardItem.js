import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import AppContext from "../core/context/appContext";

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
    const { id, name } = this.props;
    const { removeBookmarkOnPost } = this.context;
    return (
      <View style={styles.cont}>
        {showDelete ? (
          <TouchableOpacity
            style={styles.delete}
            onPress={() => removeBookmarkOnPost(id)}
          >
            <Text style={{ color: "white" }}>Delete</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.soundButton}
          onPress={this.handlePlayPause}
          onLongPress={() => this.setState({ showDelete: !showDelete })}
        >
          {this.state.isPlaying ? (
            <Ionicons name="pause" size={20} style={styles.playerButton} />
          ) : (
            <Ionicons name="ios-play" size={20} style={styles.playerButton} />
          )}

          <Text>Title: {name} </Text>
          {/* <Text>Key Logged: </Text> */}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cont: {
    marginRight: 10,
    height: 80,
    width: 100,
  },
  soundButton: {
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  delete: {
    backgroundColor: "tomato",
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },

  playerButton: {
    alignSelf: "flex-end",
  },
});
