import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  DollarSign,
  Euro,
} from "lucide-react-native";

import { colors } from "../../src/theme";

type DailyLessonCardProps = {
  onPress: () => void;
  title: string;
};

export function DailyLessonCard({ onPress, title }: DailyLessonCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.lessonHeader}>
        <View style={styles.lessonIcon}>
          <BookOpen color={colors.primary} size={19} strokeWidth={2.4} />
        </View>
        <Text selectable style={styles.eyebrow}>
          DAILY LESSON
        </Text>
      </View>

      <Text selectable style={styles.title}>
        {title}
      </Text>

      <View style={styles.currencyVisual}>
        <View style={styles.currencyBadge}>
          <Euro color={colors.text} size={31} strokeWidth={2.3} />
        </View>
        <ArrowLeftRight color={colors.primary} size={26} strokeWidth={2.4} />
        <View style={[styles.currencyBadge, styles.dollarBadge]}>
          <DollarSign color={colors.text} size={31} strokeWidth={2.3} />
        </View>
        <View style={styles.growthBars}>
          <View style={styles.smallBar} />
          <View style={styles.mediumBar} />
          <View style={styles.tallBar} />
        </View>
      </View>

      <Pressable
        accessibilityLabel="Continue learning"
        onPress={onPress}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Continue learning</Text>
        <ArrowRight color={colors.background} size={28} strokeWidth={2.8} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  lessonIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "#0D3D48",
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    maxWidth: 250,
    color: colors.text,
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 33,
  },
  currencyVisual: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 88,
  },
  currencyBadge: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 28,
    backgroundColor: "#0D3D48",
  },
  dollarBadge: {
    borderColor: "#4F8EF7",
    backgroundColor: "#17315C",
  },
  growthBars: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 6,
    alignSelf: "stretch",
  },
  smallBar: {
    width: 12,
    height: 24,
    borderRadius: 7,
    backgroundColor: "#478B90",
  },
  mediumBar: {
    width: 12,
    height: 40,
    borderRadius: 7,
    backgroundColor: "#32A6A1",
  },
  tallBar: {
    width: 12,
    height: 58,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "800",
  },
});
