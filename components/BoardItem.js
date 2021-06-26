import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

export default class BoardItem extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      playbackInstance: null,
      volume: 1.0,
      isBuffering: true,
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
    return (
      <TouchableOpacity style={styles.cont} onPress={this.handlePlayPause}>
        {this.state.isPlaying ? (
          <FontAwesome name="pause" size={20} style={styles.playerButton} />
        ) : (
          <Ionicons name="ios-play" size={20} style={styles.playerButton} />
        )}

        <Text>Title: </Text>
        <Text>Key Logged: </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cont: {
    border: "3px solid black",
    height: 80,
    marginRight: 10,
    width: 100,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  playerButton: {
    alignSelf: "flex-end",
  },
});
