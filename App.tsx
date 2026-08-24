import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { HomeDashboard } from "./components/dashboard/home-dashboard";
import { CurrencyPairsLesson } from "./components/lesson/currency-pairs-lesson";
import { AppTabBar, type AppTab } from "./components/navigation/app-tab-bar";
import { LearningProgress } from "./components/progress/learning-progress";
import { LearnerProfile } from "./components/profile/learner-profile";
import { CurrencyPairsQuiz } from "./components/quiz/currency-pairs-quiz";
import { CourseRoadmap } from "./components/roadmap/course-roadmap";
import { colors } from "./src/theme";

type AppScreen = AppTab | "lesson" | "quiz";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [currencyPairsComplete, setCurrencyPairsComplete] = useState(false);
  const showTabBar = currentScreen !== "lesson" && currentScreen !== "quiz";

  return (
    <View style={styles.app}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        {currentScreen === "home" ? (
          <HomeDashboard onContinue={() => setCurrentScreen("roadmap")} />
        ) : null}
        {currentScreen === "roadmap" ? (
          <CourseRoadmap
            currencyPairsComplete={currencyPairsComplete}
            onBack={() => setCurrentScreen("home")}
            onStartModule={() => setCurrentScreen("lesson")}
          />
        ) : null}
        {currentScreen === "lesson" ? (
          <CurrencyPairsLesson
            onBack={() => setCurrentScreen("roadmap")}
            onNext={() => setCurrentScreen("quiz")}
          />
        ) : null}
        {currentScreen === "quiz" ? (
          <CurrencyPairsQuiz
            onBack={() => setCurrentScreen("lesson")}
            onComplete={() => {
              setCurrencyPairsComplete(true);
              setCurrentScreen("roadmap");
            }}
          />
        ) : null}
        {currentScreen === "progress" ? <LearningProgress /> : null}
        {currentScreen === "profile" ? <LearnerProfile /> : null}
      </ScrollView>
      {showTabBar ? (
        <AppTabBar activeTab={currentScreen} onTabChange={setCurrentScreen} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
});
