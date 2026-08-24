import { StyleSheet, Text, View } from "react-native";
import { CircleUserRound, Flame } from "lucide-react-native";

import { colors } from "../../src/theme";
import { DailyLessonCard } from "./daily-lesson-card";
import { ProgressCard } from "./progress-card";

type HomeDashboardProps = {
  onContinue: () => void;
};

export function HomeDashboard({ onContinue }: HomeDashboardProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text selectable style={styles.greeting}>
            Good morning, Alex
          </Text>
          <Text selectable style={styles.subtitle}>
            A little progress every day.
          </Text>
        </View>
        <View style={styles.profileAvatar}>
          <CircleUserRound color={colors.mutedText} size={25} strokeWidth={2} />
        </View>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.fireIcon}>
          <Flame color={colors.accent} size={27} fill={colors.accent} />
        </View>
        <View style={styles.streakContent}>
          <Text selectable style={styles.streakTitle}>
            Day 12 streak
          </Text>
          <View style={styles.streakDays}>
            <View style={styles.activeDay} />
            <View style={styles.activeDay} />
            <View style={styles.activeDay} />
            <View style={styles.activeDay} />
            <View style={styles.activeDay} />
            <View style={styles.activeDay} />
            <View style={styles.activeDay} />
          </View>
        </View>
      </View>

      <ProgressCard completionPercentage={65} courseName="Forex Foundations" />
      <DailyLessonCard
        onPress={onContinue}
        title="Understanding Currency Pairs"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 14,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 22,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 4,
  },
  greeting: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 5,
    color: colors.mutedText,
    fontSize: 14,
  },
  profileAvatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 21,
    backgroundColor: colors.surfaceElevated,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#6D5420",
    borderRadius: 22,
    backgroundColor: colors.surface,
  },
  fireIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 24,
    backgroundColor: "#3E2F14",
  },
  streakContent: {
    flex: 1,
    gap: 8,
  },
  streakTitle: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "800",
  },
  streakDays: {
    flexDirection: "row",
    gap: 7,
  },
  activeDay: {
    width: 14,
    height: 14,
    borderRadius: 9,
    backgroundColor: colors.accent,
  },
});
