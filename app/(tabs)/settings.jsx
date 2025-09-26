import { useContext, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";
import { useSubscription } from "../../src/context/SubscriptionContext";
import { AppContext } from "../../src/context/AppState";

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { boards } = useContext(AppContext);
  const {
    isPremium,
    activatedAt,
    limits,
    benefits,
    premiumBenefits,
    upgradeToPremium,
    downgradeToFree,
    restorePurchases,
  } = useSubscription();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const boardCount = boards.length;
  const totalClips = useMemo(
    () => boards.reduce((sum, board) => sum + board.sounds.length, 0),
    [boards]
  );

  const planLabel = isPremium ? "SoundBoard Premium" : "SoundBoard Free";
  const planTagline = isPremium
    ? "Thanks for supporting the studio experience."
    : "Upgrade to unlock studio-grade tools and unlimited creations.";

  const maxBoardsCopy = Number.isFinite(limits.maxBoards)
    ? `${boardCount} / ${limits.maxBoards}`
    : `${boardCount} • Unlimited`;
  const maxUploadsCopy = Number.isFinite(limits.maxUploadsPerBoard)
    ? `${limits.maxUploadsPerBoard}`
    : "Unlimited";
  const recordingCopy = Number.isFinite(limits.maxRecordingSeconds)
    ? `${limits.maxRecordingSeconds}s`
    : "5 minutes";

  const handleUpgrade = async () => {
    await upgradeToPremium({ source: "settings" });
  };

  const handleDowngrade = async () => {
    await downgradeToFree();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.primary }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.card, { borderColor: colors.secondary }]}>
        <Text style={[styles.overline, { color: colors.text }]}>Your plan</Text>
        <Text style={[styles.title, { color: colors.text }]}>{planLabel}</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          {planTagline}
        </Text>
        {activatedAt ? (
          <Text style={[styles.meta, { color: colors.text }]}>
            Active since {formatDate(activatedAt)}
          </Text>
        ) : null}

        <View style={styles.planButtons}>
          {isPremium ? (
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={handleDowngrade}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Switch to Free
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={handleUpgrade}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                Go Premium
              </Text>
            </Pressable>
          )}
          <Pressable
            style={[
              styles.button,
              styles.outlineButton,
              { borderColor: colors.secondary },
            ]}
            onPress={() => restorePurchases()}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Restore
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.card, { borderColor: colors.secondary }]}>
        <Text style={[styles.overline, { color: colors.text }]}>
          Usage snapshot
        </Text>
        <View style={styles.metricRow}>
          <Text style={[styles.metricLabel, { color: colors.text }]}>
            Boards
          </Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {maxBoardsCopy}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={[styles.metricLabel, { color: colors.text }]}>
            Clips saved
          </Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {totalClips}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={[styles.metricLabel, { color: colors.text }]}>
            Recording limit
          </Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {recordingCopy}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={[styles.metricLabel, { color: colors.text }]}>
            Max clips per board
          </Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {maxUploadsCopy}
          </Text>
        </View>
      </View>

      <View style={[styles.card, { borderColor: colors.secondary }]}>
        <Text style={[styles.overline, { color: colors.text }]}>
          Included features
        </Text>
        {benefits.map((benefit) => (
          <View key={benefit.id} style={styles.benefitRow}>
            <View style={styles.bullet} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.benefitTitle, { color: colors.text }]}>
                {benefit.title}
              </Text>
              <Text style={[styles.benefitCopy, { color: colors.text }]}>
                {benefit.description}
              </Text>
            </View>
          </View>
        ))}
        {!isPremium && (
          <View style={styles.premiumTeaser}>
            <Text style={[styles.teaserTitle, { color: colors.text }]}>
              Premium unlocks
            </Text>
            {premiumBenefits.map((benefit) => (
              <Text
                key={`premium-${benefit.id}`}
                style={[styles.teaserCopy, { color: colors.text }]}
              >
                • {benefit.title}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.card, { borderColor: colors.secondary }]}>
        <Text style={[styles.overline, { color: colors.text }]}>
          Preferences
        </Text>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleTitle, { color: colors.text }]}>
              Board notifications
            </Text>
            <Text style={[styles.toggleCopy, { color: colors.text }]}>
              Get a gentle ping when collaborators add new clips.
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={colors.active}
            trackColor={{ true: colors.secondary, false: "#666" }}
          />
        </View>
        <View style={[styles.toggleRow, { marginTop: 20 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleTitle, { color: colors.text }]}>
              Share anonymous analytics
            </Text>
            <Text style={[styles.toggleCopy, { color: colors.text }]}>
              Help us prioritize features by sharing crash and usage stats.
            </Text>
          </View>
          <Switch
            value={analyticsEnabled}
            onValueChange={setAnalyticsEnabled}
            thumbColor={colors.active}
            trackColor={{ true: colors.secondary, false: "#666" }}
          />
        </View>
      </View>

      <View style={[styles.card, { borderColor: colors.secondary }]}>
        <Text style={[styles.overline, { color: colors.text }]}>About</Text>
        <Text style={[styles.meta, { color: colors.text }]}>
          Version {Constants.expoConfig?.version ?? "2.0.0"}
        </Text>
        <Pressable onPress={() => router.push("/about")}>
          <Text style={[styles.link, { color: colors.active }]}>
            View release notes →
          </Text>
        </Pressable>
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
    paddingBottom: 120,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    gap: 12,
    backgroundColor: "rgba(165, 120, 120, 0.25)",
  },
  overline: {
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12,
    opacity: 0.75,
    fontWeight: "700",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.85,
  },
  meta: {
    fontSize: 13,
    opacity: 0.7,
  },
  planButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#EAE0D5",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "rgba(234, 224, 213, 0.4)",
    backgroundColor: "rgba(234, 224, 213, 0.08)",
  },
  outlineButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 15,
    opacity: 0.8,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  benefitRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginTop: 6,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#EAE0D5",
    marginTop: 8,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  benefitCopy: {
    fontSize: 14,
    opacity: 0.85,
  },
  premiumTeaser: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(234, 224, 213, 0.25)",
    gap: 6,
  },
  teaserTitle: {
    fontWeight: "700",
    fontSize: 14,
    opacity: 0.85,
  },
  teaserCopy: {
    fontSize: 14,
    opacity: 0.75,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  toggleCopy: {
    fontSize: 13,
    opacity: 0.75,
    marginTop: 4,
  },
  link: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 14,
  },
});
