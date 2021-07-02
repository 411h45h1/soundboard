import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import AppState from "./core/context/AppState";
import Board from "./components/Board";
import EditBoard from "./components/EditBoard";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Updates from "expo-updates";

const updateCheck = async () => {
  await Updates.checkForUpdateAsync().then(async (update) => {
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync().then(async (check) => {
        if (check.isNew) {
          await Updates.reloadAsync();
        }
      });
    }
  });
};

const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const startUp = async () => {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load
        if (__DEV__ === false) {
          updateCheck();
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    };

    startUp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
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
          background: "#97897B",
        },
      }}
    >
      <AppState>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <Stack.Navigator headerMode="none" initialRouteName="Home">
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
