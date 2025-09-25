import { ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { useTheme } from "../../src/context/ThemeContext";

export default function AboutScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.primary }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        About SoundBoard
      </Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        A flexible sound board for recording, organizing, and triggering audio
        clips.
      </Text>

      <View
        style={[
          styles.section,
          {
            borderColor: colors.secondary,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          App Details
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Version: {Constants.expoConfig?.version ?? "1.0.0"}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Bundle Identifier:{" "}
          {Constants.expoConfig?.ios?.bundleIdentifier ?? "N/A"}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Package: {Constants.expoConfig?.android?.package ?? "N/A"}
        </Text>
      </View>

      <View
        style={[
          styles.section,
          {
            borderColor: colors.secondary,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          What&apos;s New
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          • Expo Router driven navigation with drawers and native tabs.
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          • Updated to Expo SDK 54 with expo-audio support.
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          • Improved layout for tablets and large screens.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.85,
  },
  section: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
