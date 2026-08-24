import {
  Check,
  ChevronRight,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/theme";

type ModuleStatus = "active" | "complete" | "locked";

type CourseModuleCardProps = {
  icon: LucideIcon;
  index: number;
  onPress?: () => void;
  status: ModuleStatus;
  title: string;
};

export function CourseModuleCard({
  icon: Icon,
  index,
  onPress,
  status,
  title,
}: CourseModuleCardProps) {
  const isActive = status === "active";
  const isComplete = status === "complete";
  const iconColor = isLocked(status) ? colors.mutedText : colors.primary;

  return (
    <Pressable
      accessibilityLabel={`${title}, ${status}`}
      disabled={!isActive}
      onPress={onPress}
      style={[
        styles.card,
        isActive && styles.activeCard,
        isLocked(status) && styles.lockedCard,
      ]}
    >
      <View
        style={[styles.iconContainer, isActive && styles.activeIconContainer]}
      >
        <Icon color={iconColor} size={25} strokeWidth={2.2} />
      </View>

      <View style={styles.moduleContent}>
        <Text selectable style={styles.moduleNumber}>
          MODULE {index}
        </Text>
        <Text
          selectable
          style={[styles.title, isLocked(status) && styles.lockedText]}
        >
          {title}
        </Text>
      </View>

      {isComplete ? (
        <Check color={colors.primary} size={23} strokeWidth={3} />
      ) : null}
      {isActive ? (
        <ChevronRight color={colors.primary} size={25} strokeWidth={2.6} />
      ) : null}
      {isLocked(status) ? (
        <LockKeyhole color={colors.mutedText} size={20} />
      ) : null}
    </Pressable>
  );
}

function isLocked(status: ModuleStatus) {
  return status === "locked";
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 86,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  activeCard: {
    borderColor: colors.primary,
    backgroundColor: "#0D323B",
  },
  lockedCard: {
    opacity: 0.72,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
  },
  activeIconContainer: {
    backgroundColor: "#0D4E59",
  },
  moduleContent: {
    flex: 1,
    gap: 3,
  },
  moduleNumber: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  lockedText: {
    color: colors.mutedText,
  },
});
