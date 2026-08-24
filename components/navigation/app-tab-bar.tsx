import {
  BookOpen,
  ChartNoAxesCombined,
  CircleUserRound,
  House,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/theme";

export type AppTab = "home" | "progress" | "profile" | "roadmap";

type AppTabBarProps = {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
};

const tabs: Array<{ icon: LucideIcon; label: string; name: AppTab }> = [
  { icon: House, label: "Home", name: "home" },
  { icon: BookOpen, label: "Learn", name: "roadmap" },
  { icon: ChartNoAxesCombined, label: "Progress", name: "progress" },
  { icon: CircleUserRound, label: "Profile", name: "profile" },
];

export function AppTabBar({ activeTab, onTabChange }: AppTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = tab.name === activeTab;
        const color = isActive ? colors.primary : colors.mutedText;
        const Icon = tab.icon;

        return (
          <Pressable
            accessibilityLabel={tab.label}
            key={tab.name}
            onPress={() => onTabChange(tab.name)}
            style={styles.tab}
          >
            <Icon color={color} size={22} strokeWidth={2.2} />
            <Text
              selectable
              style={[styles.label, isActive && styles.activeLabel]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  tab: {
    alignItems: "center",
    gap: 4,
    minWidth: 58,
  },
  label: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "700",
  },
  activeLabel: {
    color: colors.primary,
  },
});
