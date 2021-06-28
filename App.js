import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Board from "./components/Board";
import EditBoard from "./components/EditBoard";

import AppState from "./core/context/AppState";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppState>
        <View style={styles.container}>
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
