import React, { useState, useContext, useRef, useEffect } from 'react';
import { StyleSheet, Text, Pressable, View, Alert } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { AppContext } from '../core/context/AppState';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsLandscape, isTablet, normalize } from '../core/responsive';
import { triggerHaptic } from '../utils/haptics';
import { Colors } from '@/constants/colors';

const RecordAudioButton = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [isStopping, setIsStopping] = useState<boolean>(false);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('RecordAudioButton must be used within AppState');
  }
  const { updateSoundBoard, currentBoard } = context;
  const recordingStartTimeRef = useRef<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStatusRef = useRef<string>('idle');

  const isLandscape = useIsLandscape();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatRecordingTitle = () => {
    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();

    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `Mic Recording ${month}/${day}/${year} @${formattedHours}:${minutes} ${ampm}`;
  };

  const startRecording = async () => {
    try {
      if (isRecording || isInitializing || isStopping) {
        console.log('Recording operation already in progress');
        return;
      }

      recordingStatusRef.current = 'initializing';
      triggerHaptic('heavy');
      setIsInitializing(true);

      console.log('Requesting audio permission...');
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        console.error('Permission to access microphone denied');
        setIsInitializing(false);
        recordingStatusRef.current = 'idle';
        return;
      }

      console.log('Starting recording...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingStatusRef.current = 'recording';
      setRecording(newRecording);
      setIsRecording(true);
      setIsInitializing(false);
      recordingStartTimeRef.current = Date.now();
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
          setRecordingDuration(elapsed);
        }
      }, 1000);

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      triggerHaptic('error');
      setIsInitializing(false);
      setIsRecording(false);
      recordingStatusRef.current = 'idle';
      Alert.alert('Recording Error', 'Could not start recording. Please try again.');
    }
  };

  const stopRecording = async (isUnmounting = false) => {
    if (isStopping || recordingStatusRef.current === 'stopping') {
      console.log('Already stopping recording');
      return;
    }

    if (!isUnmounting) {
      triggerHaptic('medium');
    }

    recordingStatusRef.current = 'stopping';
    setIsStopping(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const duration = recordingStartTimeRef.current
      ? (Date.now() - recordingStartTimeRef.current) / 1000
      : 0;

    if (!recording) {
      console.log('No recording object exists');
      cleanupAfterRecording();
      return;
    }

    let uri = null;

    try {
      try {
        uri = recording.getURI();
        console.log('Got recording URI:', uri);
      } catch (uriError) {
        console.log('Could not get URI before stopping:', (uriError as Error).message);
      }

      try {
        console.log('Stopping recording...');
        await recording.stopAndUnloadAsync();
        console.log('Recording stopped successfully');
      } catch (stopError) {
        console.log('Error stopping recording:', (stopError as Error).message);

        if (
          (stopError as Error).message.includes('does not exist') ||
          (stopError as Error).message.includes('been unloaded')
        ) {
          console.log('Recording was already unloaded or does not exist');

          if (!uri) {
            try {
              uri = recording.getURI();
              console.log('Got URI after failed stop:', uri);
            } catch (e) {
              console.error('Could not get URI from recording:', e);
            }
          }
        } else {
          throw stopError;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      if (!isUnmounting && currentBoard && duration >= 0.5 && uri) {
        const soundObj = {
          sid: Date.now(),
          uri,
          name: 'Mic Recording',
          title: formatRecordingTitle(),
        };

        updateSoundBoard(soundObj);
        triggerHaptic('success');
      } else if (duration < 0.5 && !isUnmounting) {
        triggerHaptic('error');
        Alert.alert('Recording Too Short', 'Please record for at least 0.5 seconds to save.');
      }
    } catch (error) {
      console.error('Error in stopping recording process:', error);
      triggerHaptic('error');
      if (!isUnmounting) {
        Alert.alert('Recording Error', 'There was a problem with the recording. Please try again.');
      }
    } finally {
      cleanupAfterRecording();
    }
  };

  const cleanupAfterRecording = () => {
    setRecording(null);
    setIsRecording(false);
    setIsStopping(false);
    recordingStartTimeRef.current = null;
    recordingStatusRef.current = 'idle';
  };

  const renderRecordingTimer = () => {
    if (!isRecording) return null;

    return (
      <View style={styles.recordingControls}>
        <Text style={styles.durationText}>
          {Math.floor(recordingDuration / 60)}:
          {(recordingDuration % 60).toString().padStart(2, '0')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.recordButton,
          {
            backgroundColor: isRecording
              ? Colors.buttonDanger
              : isInitializing || isStopping
                ? Colors.buttonProcessing
                : Colors.button,
          },
        ]}
        onPress={isRecording ? () => stopRecording(false) : startRecording}
        disabled={isInitializing || isStopping}
      >
        {renderRecordingTimer()}
        <Text
          style={[
            styles.recordText,
            {
              fontSize: isLandscape && isTablet() ? normalize(10) : normalize(16),
            },
          ]}
        >
          Record
        </Text>
        <MaterialIcons
          name={isRecording ? 'stop' : 'fiber-manual-record'}
          size={normalize(20)}
          color={isRecording ? Colors.white : Colors.text}
        />
      </Pressable>
    </View>
  );
};

export default RecordAudioButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  recordButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordText: {
    color: Colors.text,
    fontWeight: 'bold',
    marginRight: 8,
  },
  recordingControls: {
    backgroundColor: Colors.primary + 'CC',
    padding: 3,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  durationText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
});
