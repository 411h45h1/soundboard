import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PopupModal from "./PopupModal";
import { useTheme } from "../context/ThemeContext";

export default function PremiumUpsellModal({
  visible,
  onClose,
  onUpgrade,
  benefits,
  limits,
}) {
  const { colors } = useTheme();

  return (
    <PopupModal
      visible={visible}
      onClose={onClose}
      width="90%"
      backgroundColor={colors.primary}
      borderRadius={18}
      padding={24}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.badge,
            { color: colors.primary, backgroundColor: colors.active },
          ]}
        >
          Premium
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Unlock your studio tools
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Go beyond the basics with unlimited boards, longer recordings, and
          pro-grade workflows.
        </Text>
      </View>

      <View style={styles.benefits}>
        {benefits.map((benefit) => (
          <View
            key={benefit.id}
            style={[styles.benefitItem, { borderColor: colors.secondary }]}
          >
            <Text style={[styles.benefitTitle, { color: colors.text }]}>
              {benefit.title}
            </Text>
            <Text style={[styles.benefitDescription, { color: colors.text }]}>
              {benefit.description}
            </Text>
          </View>
        ))}
      </View>

      {limits?.maxBoards !== undefined &&
      limits.maxBoards !== Number.POSITIVE_INFINITY ? (
        <Text style={[styles.limitCopy, { color: colors.text }]}>
          Free plan includes up to {limits.maxBoards} boards. Upgrade anytime to
          build without limits.
        </Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.secondary }]}
          onPress={onClose}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
            Not now
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.active }]}
          onPress={onUpgrade}
        >
          <Text style={[styles.primaryButtonText, { color: colors.primary }]}>
            Go Premium
          </Text>
        </TouchableOpacity>
      </View>
    </PopupModal>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    gap: 12,
  },
  badge: {
    fontWeight: "800",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    letterSpacing: 0.5,
    fontSize: 12,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.9,
  },
  benefits: {
    gap: 12,
    marginTop: 20,
    width: "100%",
  },
  benefitItem: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    backgroundColor: "rgba(165, 120, 120, 0.25)",
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  benefitDescription: {
    fontSize: 14,
    opacity: 0.85,
  },
  limitCopy: {
    fontSize: 14,
    opacity: 0.75,
    marginTop: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
