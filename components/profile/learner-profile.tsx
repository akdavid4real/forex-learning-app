import {
  Award,
  Bookmark,
  ChevronRight,
  Flame,
  Settings,
} from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/theme";

export function LearnerProfile() {
  return (
    <View style={styles.screen}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View>
          <Text selectable style={styles.name}>
            Alex Morgan
          </Text>
          <Text selectable style={styles.level}>
            Forex learner · Level 2
          </Text>
        </View>
      </View>
      <View style={styles.stats}>
        <Stat icon={Flame} label="Streak" value="12 days" />
        <Stat icon={Award} label="XP" value="80" />
        <Stat icon={Bookmark} label="Saved" value="4" />
      </View>
      <View style={styles.settingCard}>
        <Settings color={colors.mutedText} size={22} />
        <View>
          <Text selectable style={styles.settingTitle}>
            Learning settings
          </Text>
          <Text selectable style={styles.settingText}>
            Daily reminders and preferences
          </Text>
        </View>
      </View>
      <Text selectable style={styles.sectionTitle}>
        Saved for later
      </Text>
      <SavedLesson title="Candlestick patterns" type="Lesson" />
      <SavedLesson title="Risk management checklist" type="Guide" />
    </View>
  );
}

type StatProps = { icon: typeof Flame; label: string; value: string };

function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <View style={styles.stat}>
      <Icon color={colors.accent} size={20} />
      <Text selectable style={styles.statValue}>
        {value}
      </Text>
      <Text selectable style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

type SavedLessonProps = {
  title: string;
  type: string;
};

function SavedLesson({ title, type }: SavedLessonProps) {
  return (
    <View style={styles.savedLesson}>
      <View style={styles.savedIcon}>
        <Bookmark color={colors.primary} size={19} strokeWidth={2.3} />
      </View>
      <View style={styles.savedCopy}>
        <Text selectable style={styles.savedTitle}>
          {title}
        </Text>
        <Text selectable style={styles.savedType}>
          {type}
        </Text>
      </View>
      <ChevronRight color={colors.mutedText} size={20} strokeWidth={2.3} />
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
  profileHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
  avatarText: { color: colors.background, fontSize: 26, fontWeight: "800" },
  name: { color: colors.text, fontSize: 24, fontWeight: "800" },
  level: { marginTop: 3, color: colors.mutedText, fontSize: 14 },
  stats: { flexDirection: "row", gap: 10 },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  statValue: { color: colors.text, fontSize: 16, fontWeight: "800" },
  statLabel: { color: colors.mutedText, fontSize: 11, fontWeight: "700" },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  settingTitle: { color: colors.text, fontSize: 16, fontWeight: "800" },
  settingText: { marginTop: 2, color: colors.mutedText, fontSize: 13 },
  sectionTitle: {
    marginTop: 4,
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  savedLesson: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  savedIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#0D3D48",
  },
  savedCopy: { flex: 1 },
  savedTitle: { color: colors.text, fontSize: 15, fontWeight: "800" },
  savedType: { marginTop: 2, color: colors.mutedText, fontSize: 12 },
});
