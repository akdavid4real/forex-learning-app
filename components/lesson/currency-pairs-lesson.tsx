import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  CircleDollarSign,
  Euro,
  Lightbulb,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/theme";

type CurrencyPairsLessonProps = {
  onBack: () => void;
  onNext: () => void;
};

export function CurrencyPairsLesson({
  onBack,
  onNext,
}: CurrencyPairsLessonProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to roadmap"
          onPress={onBack}
          style={styles.backButton}
        >
          <ArrowLeft color={colors.text} size={22} strokeWidth={2.4} />
        </Pressable>
        <Text selectable style={styles.lessonCount}>
          Lesson 2 of 5
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.intro}>
        <Text selectable style={styles.eyebrow}>
          FOREX FOUNDATIONS
        </Text>
        <Text selectable style={styles.title}>
          Understanding Currency Pairs
        </Text>
        <Text selectable style={styles.description}>
          Forex pairs show the value of one currency compared with another.
        </Text>
      </View>

      <View style={styles.pairCard}>
        <Text selectable style={styles.cardLabel}>
          EXAMPLE PAIR
        </Text>
        <View style={styles.pairVisual}>
          <CurrencyBadge label="EUR" icon={Euro} />
          <ArrowLeftRight color={colors.primary} size={27} strokeWidth={2.3} />
          <CurrencyBadge label="USD" icon={CircleDollarSign} />
        </View>
        <View style={styles.quoteRow}>
          <Text selectable style={styles.quoteLabel}>
            EUR/USD
          </Text>
          <Text selectable style={styles.quoteValue}>
            1.0850
          </Text>
        </View>
        <Text selectable style={styles.quoteExplanation}>
          1 euro costs 1.0850 US dollars.
        </Text>
      </View>

      <View style={styles.takeawayCard}>
        <View style={styles.takeawayIcon}>
          <Lightbulb color={colors.primary} size={24} strokeWidth={2.3} />
        </View>
        <View style={styles.takeawayCopy}>
          <Text selectable style={styles.takeawayTitle}>
            Key takeaway
          </Text>
          <Text selectable style={styles.takeawayText}>
            The first currency is the base. The second is the quote currency.
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityLabel="Continue to the quick quiz"
        onPress={onNext}
        style={styles.nextButton}
      >
        <Text style={styles.nextButtonText}>Next lesson</Text>
        <ArrowRight color={colors.background} size={25} strokeWidth={2.8} />
      </Pressable>
    </View>
  );
}

type CurrencyBadgeProps = {
  icon: typeof Euro;
  label: string;
};

function CurrencyBadge({ icon: Icon, label }: CurrencyBadgeProps) {
  return (
    <View style={styles.currencyBadge}>
      <Icon color={colors.text} size={29} strokeWidth={2.3} />
      <Text selectable style={styles.currencyLabel}>
        {label}
      </Text>
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
  lessonCount: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: "700",
  },
  progressTrack: {
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
  intro: {
    gap: 8,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  title: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "800",
    lineHeight: 35,
  },
  description: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23,
  },
  pairCard: {
    gap: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  cardLabel: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  pairVisual: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  currencyBadge: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 22,
    backgroundColor: "#0D3D48",
  },
  currencyLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  quoteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quoteLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  quoteValue: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  quoteExplanation: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  takeawayCard: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#17616A",
    borderRadius: 20,
    backgroundColor: "#0C2B33",
  },
  takeawayIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#0B434D",
  },
  takeawayCopy: {
    flex: 1,
    gap: 4,
  },
  takeawayTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800",
  },
  takeawayText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  nextButtonText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: "800",
  },
});
