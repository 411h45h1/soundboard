import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Board from "../../../src/components/Board";
import { useTheme } from "../../../src/context/ThemeContext";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <Board />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
