import { StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";
import { useTheme } from "../../src/context/ThemeContext";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Customize how SoundBoard behaves on this device.
      </Text>

      <View
        style={[
          styles.settingItem,
          {
            borderColor: colors.secondary,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Board Notifications
          </Text>
          <Text style={[styles.settingDescription, { color: colors.text }]}>
            Receive reminders when new boards are created.
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={colors.active}
          trackColor={{ true: colors.secondary, false: "#999" }}
        />
      </View>

      <View
        style={[
          styles.settingItem,
          {
            borderColor: colors.secondary,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          Coming soon
        </Text>
        <Text style={[styles.settingDescription, { color: colors.text }]}>
          Additional customization options will appear here after future
          updates.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  settingItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.85,
  },
});
