import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import Board from "./components/Board";
import EditBoard from "./components/EditBoard";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Updates from "expo-updates";
import { AppState } from "./core/context/AppState";

// Function to handle update checking and reloading if necessary
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

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Keep splash screen visible until the app is ready
        await SplashScreen.preventAutoHideAsync();

        // Perform any additional setup (e.g., checking for updates)
        if (!__DEV__) {
          await checkForUpdates();
        }

        const configureAudio = async () => {
          try {
            console.log("Configuring audio settings...");
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: false,
              interruptionModeIOS: InterruptionModeIOS.DoNotMix,
              playsInSilentModeIOS: true,
              interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
              shouldDuckAndroid: true,
              staysActiveInBackground: true,
              playThroughEarpieceAndroid: false,
            });
            console.log("Audio settings configured.");
          } catch (error) {
            console.error("Error configuring audio mode:", error);
          }
        };
      } catch (e) {
        console.warn("App initialization error:", e);
      } finally {
        setAppIsReady(true); // Ensure the app is ready to be rendered
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
    return null; // Don't render anything until the app is ready
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "#97897B",
        },
      }}
    >
      <AppState>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Home"
          >
            <Stack.Screen name="Home" component={Board} />
            <Stack.Screen name="Edit" component={EditBoard} />
          </Stack.Navigator>
        </View>
      </AppState>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#96897B",
  },
});
