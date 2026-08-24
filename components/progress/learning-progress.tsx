import { Award, BookOpenCheck, Flame, Target } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/theme";

export function LearningProgress() {
  return (
    <View style={styles.screen}>
      <Text selectable style={styles.title}>
        Your progress
      </Text>
      <Text selectable style={styles.subtitle}>
        You are building a strong forex foundation.
      </Text>
      <View style={styles.courseCard}>
        <View style={styles.courseHeader}>
          <View>
            <Text selectable style={styles.eyebrow}>
              FOREX FOUNDATIONS
            </Text>
            <Text selectable style={styles.courseTitle}>
              65% complete
            </Text>
          </View>
          <Target color={colors.primary} size={28} strokeWidth={2.2} />
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <Text selectable style={styles.courseText}>
          3 of 5 modules complete
        </Text>
      </View>
      <ProgressItem icon={Flame} label="12 day streak" detail="Keep it going" />
      <ProgressItem
        icon={BookOpenCheck}
        label="3 lessons"
        detail="Learning steadily"
      />
      <ProgressItem icon={Award} label="80 XP" detail="Forex Foundations" />
    </View>
  );
}

type ProgressItemProps = {
  detail: string;
  icon: typeof Flame;
  label: string;
};

function ProgressItem({ detail, icon: Icon, label }: ProgressItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.itemIcon}>
        <Icon color={colors.accent} size={22} />
      </View>
      <View>
        <Text selectable style={styles.itemLabel}>
          {label}
        </Text>
        <Text selectable style={styles.itemDetail}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 14,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 28,
    backgroundColor: colors.background,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.mutedText, fontSize: 15 },
  courseCard: {
    gap: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    backgroundColor: colors.surface,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  courseTitle: {
    marginTop: 4,
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    overflow: "hidden",
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
  },
  progressFill: {
    width: "65%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  courseText: { color: colors.mutedText, fontSize: 14 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  itemIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#3E2F14",
  },
  itemLabel: { color: colors.text, fontSize: 16, fontWeight: "800" },
  itemDetail: { marginTop: 2, color: colors.mutedText, fontSize: 13 },
});
