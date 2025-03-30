import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import Board from "./components/Board";
import EditBoard from "./components/EditBoard";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Updates from "expo-updates";
import { AppState } from "./core/context/AppState";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import SoundManager from "./utils/SoundManager";
import * as FileSystem from "expo-file-system";

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
    console.error("Error checking for updates:", e);
  }
};

const Stack = createStackNavigator();

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
    console.error("Error configuring audio mode:", error);
  }
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync().catch(() => {
          /* Ignore errors */
        });

        if (!__DEV__) {
          await checkForUpdates();
        }

        await configureAudio();

        // Initialize sound system
        const soundsDir = FileSystem.documentDirectory + "sounds/";
        const dirInfo = await FileSystem.getInfoAsync(soundsDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(soundsDir, {
            intermediates: true,
          });
        }

        // Validate sounds in a non-blocking way after the app loads
        setTimeout(async () => {
          try {
            // Load sounds metadata and validate them
            const soundsMetadata = await SoundManager.getSoundsMetadata();
            const validSounds = [];

            // Process in batches to prevent UI freezing
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

              // Allow UI to breathe
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            // Update metadata if needed
            if (validSounds.length !== soundsMetadata.length) {
              await SoundManager.saveSoundsMetadata(validSounds);
            }
          } catch (error) {
            console.error("Error validating sounds:", error);
          }
        }, 1000); // Delay sound validation to allow UI to initialize first
      } catch (e) {
        console.warn("App initialization error:", e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "#5E403F",
        },
      }}
    >
      <AppState>
        <StatusBar animated={true} style="light" />

        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Home"
          >
            <Stack.Screen name="Home" component={Board} />
            <Stack.Screen name="Edit" component={EditBoard} />
          </Stack.Navigator>
        </SafeAreaView>
      </AppState>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5E403F",
  },
});
