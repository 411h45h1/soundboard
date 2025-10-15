import React, { useEffect, useState, memo, useCallback, useRef } from 'react';
import { Text, TouchableOpacity, View, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { normalize } from '../../core/responsive';
import { triggerHaptic, withHaptics } from '../../utils/haptics';
import { BoardItemProps, SoundItem } from '../../types';
import { Colors } from '@/constants/colors';

const BoardItem: React.FC<BoardItemProps> = ({
  sid,
  name,
  title,
  src,
  onPlaySound,
  navigation,
  removeSoundboardItem,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const hasUnmounted = useRef<boolean>(false);
  const componentId = `board-item-${sid}`;

  useEffect(() => {
    return () => {
      hasUnmounted.current = true;
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [sound]);

  useEffect(() => {
    const stopListener = () => {
      if (isPlaying && sound) {
        setIsPlaying(false);
      }
    };

    if (global.soundBoardRegistry) {
      global.soundBoardRegistry[componentId] = stopListener;
    } else {
      global.soundBoardRegistry = {
        [componentId]: stopListener,
      };
    }

    return () => {
      if (global.soundBoardRegistry) {
        delete global.soundBoardRegistry[componentId];
      }
    };
  }, [sound, isPlaying, componentId]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = useCallback(async () => {
    if (isPlaying && sound) {
      triggerHaptic('medium');
      try {
        await sound.pauseAsync();
        setIsPlaying(false);
        return;
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }

    triggerHaptic('light');

    try {
      console.log('Attempting to play sound. Source URI:', src);

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: src },
        { shouldPlay: true },
        status => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      );

      setSound(newSound);
      setIsPlaying(true);

      // Create a SoundItem for the callback
      const soundItem: SoundItem = {
        sid,
        name,
        uri: src,
        title: title || name,
        _boardItemId: sid,
        _componentId: componentId,
      };
      onPlaySound(soundItem);
    } catch (error) {
      console.error('Error playing sound:', error);
      Alert.alert('Playback Error', 'Unable to play this sound file.', [{ text: 'OK' }]);
      setIsPlaying(false);
    }
  }, [sound, src, onPlaySound, isPlaying, sid, componentId, name, title]);

  const handleLongPress = useCallback(() => {
    triggerHaptic('medium');
    setShowActions((prev: boolean) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={withHaptics('selection', () => {
              navigation.navigate(
                `/edit/${sid}?fileName=${encodeURIComponent(name)}&title=${encodeURIComponent(title || name)}&src=${encodeURIComponent(src)}`
              );
              setShowActions(false);
            })}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={withHaptics('warning', () => {
              removeSoundboardItem(sid);
              setShowActions(false);
            })}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.soundButton,
          {
            backgroundColor: Colors.button,
            borderColor: isPlaying ? Colors.white : Colors.transparent,
          },
        ]}
        onPress={playSound}
        onLongPress={handleLongPress}
      >
        <Text
          style={[
            styles.soundText,
            {
              fontSize: normalize(17),
            },
          ]}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {title || `File: ${name}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  actionButton: {
    padding: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Colors.buttonSecondary,
    marginRight: 2,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    marginLeft: 2,
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  soundButton: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  soundText: {
    fontWeight: 'bold',
    color: Colors.text,
    width: '100%',
    textAlign: 'center',
    flexWrap: 'wrap',
    lineHeight: normalize(18),
  },
});

export default memo(BoardItem);
