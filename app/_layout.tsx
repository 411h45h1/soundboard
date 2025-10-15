import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState } from '@/core/context/AppState';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import SoundManager from '@/utils/SoundManager';

SplashScreen.preventAutoHideAsync();

const checkForUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      const fetchResult = await Updates.fetchUpdateAsync();
      if (fetchResult.isNew) {
        await Updates.reloadAsync();
      }
    }
  } catch (e) {
    console.error('Error checking for updates:', e);
  }
};

const configureAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.error('Error configuring audio mode:', error);
  }
};

export default function RootLayout() {
  useEffect(() => {
    const prepareApp = async () => {
      try {
        if (!__DEV__) {
          await checkForUpdates();
        }

        await configureAudio();

        await SoundManager.ensureSoundsDirectory();
      } catch (e) {
        console.warn('App initialization error:', e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  return (
    <AppState>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#5E403F' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="edit/[id]" />
      </Stack>
    </AppState>
  );
}
