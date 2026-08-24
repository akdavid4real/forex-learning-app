import {
  ArrowLeft,
  ChartCandlestick,
  CircleDollarSign,
  Globe2,
  MessageSquareQuote,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/theme";
import { CourseModuleCard } from "./course-module-card";

type CourseRoadmapProps = {
  currencyPairsComplete: boolean;
  onBack: () => void;
  onStartModule: () => void;
};

type CourseModule = {
  icon: LucideIcon;
  status: "active" | "complete" | "locked";
  title: string;
};

const baseCourseModules: CourseModule[] = [
  { icon: Globe2, status: "complete", title: "Market Basics" },
  { icon: MessageSquareQuote, status: "locked", title: "Reading Quotes" },
  { icon: ChartCandlestick, status: "locked", title: "Candlesticks" },
  { icon: ShieldCheck, status: "locked", title: "Risk Management" },
];

export function CourseRoadmap({
  currencyPairsComplete,
  onBack,
  onStartModule,
}: CourseRoadmapProps) {
  const courseModules: CourseModule[] = [
    baseCourseModules[0],
    {
      icon: CircleDollarSign,
      status: currencyPairsComplete ? "complete" : "active",
      title: "Currency Pairs",
    },
    ...baseCourseModules.slice(1),
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to home"
          onPress={onBack}
          style={styles.backButton}
        >
          <ArrowLeft color={colors.text} size={22} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text selectable style={styles.title}>
            Forex Foundations
          </Text>
          <Text selectable style={styles.subtitle}>
            Your roadmap
          </Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <Text selectable style={styles.progressLabel}>
          COURSE PROGRESS
        </Text>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text selectable style={styles.progressValue}>
            2 / 5
          </Text>
        </View>
      </View>

      <View style={styles.modules}>
        {courseModules.map((module, index) => (
          <CourseModuleCard
            icon={module.icon}
            index={index + 1}
            key={module.title}
            onPress={module.status === "active" ? onStartModule : undefined}
            status={module.status}
            title={module.title}
          />
        ))}
      </View>

      <View style={styles.tipCard}>
        <Text selectable style={styles.tipTitle}>
          Keep going
        </Text>
        <Text selectable style={styles.tipText}>
          Complete Currency Pairs to unlock your next module.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 18,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 28,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  headerCopy: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 14,
  },
  progressCard: {
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  progressLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    overflow: "hidden",
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
  },
  progressFill: {
    width: "40%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  progressValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  modules: {
    gap: 12,
  },
  tipCard: {
    gap: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: "#705920",
    borderRadius: 20,
    backgroundColor: "#2F2818",
  },
  tipTitle: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: "800",
  },
  tipText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
