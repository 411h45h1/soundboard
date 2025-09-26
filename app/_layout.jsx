import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import { setAudioModeAsync } from "expo-audio";

import { AppState } from "../src/context/AppState";
import { SubscriptionProvider } from "../src/context/SubscriptionContext";
import * as SoundManager from "../src/utils/SoundManager";
import { ThemeProvider } from "../src/context/ThemeContext";
import ErrorBoundary from "../src/components/ErrorBoundary";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

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
        console.log("Starting app initialization...");

        if (!__DEV__) {
          console.log("Checking for updates...");
          await checkForUpdates();
        }

        console.log("Configuring audio...");
        await configureAudio();

        console.log("Ensuring sounds directory exists...");
        await SoundManager.ensureSoundsDirectoryExists();

        console.log(
          "App initialization complete, starting validation in background"
        );
        setTimeout(() => {
          console.log("Starting background sound validation...");
          validatePersistedSounds()
            .then(() => {
              console.log("Background sound validation complete");
            })
            .catch((error) => {
              console.error("Background sound validation failed:", error);
            });
        }, 1000);
      } catch (error) {
        console.error("App initialization error:", error);
      } finally {
        console.log("Setting app as ready");
        setAppIsReady(true);
        // Hide splash screen immediately when app is ready
        setTimeout(async () => {
          console.log("Hiding splash screen...");
          try {
            await SplashScreen.hideAsync();
            console.log("Splash screen hidden successfully");
          } catch (error) {
            console.error("Error hiding splash screen:", error);
          }
        }, 100);
      }
    };

    prepare();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SubscriptionProvider>
            <AppState>
              <ThemeProvider>
                <StatusBar style="light" />
                {appIsReady ? (
                  <Stack
                    initialRouteName="(tabs)"
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    <Stack.Screen
                      name="(tabs)"
                      options={{ animation: "none" }}
                    />
                    <Stack.Screen
                      name="edit"
                      options={{
                        presentation: "modal",
                        animation: "slide_from_bottom",
                      }}
                    />
                    <Stack.Screen name="about" />
                  </Stack>
                ) : (
                  <View style={{ flex: 1, backgroundColor: "#5E403F" }} />
                )}
              </ThemeProvider>
            </AppState>
          </SubscriptionProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
