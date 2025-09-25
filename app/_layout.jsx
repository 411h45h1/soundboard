import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import { setAudioModeAsync } from "expo-audio";

import { AppState } from "../src/context/AppState";
import SoundManager from "../src/utils/SoundManager";
import { ThemeProvider } from "../src/context/ThemeContext";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* Ignore errors */
});

const configureAudio = async () => {
  try {
    await setAudioModeAsync({
      allowsRecording: false,
      interruptionMode: "doNotMix",
      playsInSilentMode: true,
      interruptionModeAndroid: "doNotMix",
      shouldRouteThroughEarpiece: true,
      shouldPlayInBackground: true,
    });
  } catch (error) {
    console.error("Error configuring audio mode:", error);
  }
};

const validatePersistedSounds = async () => {
  try {
    const soundsMetadata = await SoundManager.getSoundsMetadata();
    const validSounds = [];

    const BATCH_SIZE = 10;
    let processedCount = 0;

    while (processedCount < soundsMetadata.length) {
      const batch = soundsMetadata.slice(
        processedCount,
        Math.min(processedCount + BATCH_SIZE, soundsMetadata.length)
      );

      for (const sound of batch) {
        const isValid = await SoundManager.validateSound(sound);
        if (isValid) {
          validSounds.push(sound);
        }
      }

      processedCount += batch.length;

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (validSounds.length !== soundsMetadata.length) {
      await SoundManager.saveSoundsMetadata(validSounds);
    }
  } catch (error) {
    console.error("Error validating sounds:", error);
  }
};

const checkForUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      const fetchResult = await Updates.fetchUpdateAsync();
      if (fetchResult.isNew) {
        await Updates.reloadAsync();
      }
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        if (!__DEV__) {
          await checkForUpdates();
        }

        await configureAudio();
        await SoundManager.ensureSoundsDirectoryExists();

        setTimeout(() => {
          validatePersistedSounds();
        }, 1000);
      } catch (error) {
        console.warn("App initialization error:", error);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <AppState>
          <ThemeProvider>
            <StatusBar style="light" />
            {appIsReady ? (
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            ) : (
              <View style={{ flex: 1, backgroundColor: "#5E403F" }} />
            )}
          </ThemeProvider>
        </AppState>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
