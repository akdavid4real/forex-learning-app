import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/theme";

type ProgressCardProps = {
  completionPercentage: number;
  courseName: string;
};

export function ProgressCard({
  completionPercentage,
  courseName,
}: ProgressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.progressRing}>
        <Text selectable style={styles.percentage}>
          {completionPercentage}%
        </Text>
        <Text selectable style={styles.completeLabel}>
          complete
        </Text>
      </View>

      <View style={styles.courseDetails}>
        <Text selectable style={styles.courseLabel}>
          YOUR COURSE
        </Text>
        <Text selectable style={styles.courseName}>
          {courseName}
        </Text>
        <View style={styles.moduleProgress}>
          <View style={styles.completedModule} />
          <View style={styles.completedModule} />
          <View style={styles.completedModule} />
          <View style={styles.remainingModule} />
          <View style={styles.remainingModule} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  progressRing: {
    width: 108,
    height: 108,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 10,
    borderColor: colors.primary,
    borderRightColor: colors.progressTrack,
    borderRadius: 54,
  },
  percentage: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  completeLabel: {
    marginTop: 2,
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
  },
  courseDetails: {
    flex: 1,
    gap: 6,
  },
  courseLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  courseName: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
  },
  moduleProgress: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  completedModule: {
    flex: 1,
    height: 7,
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  remainingModule: {
    flex: 1,
    height: 7,
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
  },
});
