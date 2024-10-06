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
        await SplashScreen.preventAutoHideAsync();

        if (!__DEV__) {
          await checkForUpdates();
        }

        await configureAudio();
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
      ac
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
