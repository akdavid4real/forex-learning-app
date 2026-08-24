import { useState } from "react";
import { ArrowLeft, Check, CircleCheckBig, Trophy } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/theme";

type CurrencyPairsQuizProps = {
  onBack: () => void;
  onComplete: () => void;
};

const answers = [
  "The euro priced in US dollars",
  "The US dollar priced in euros",
  "A stock market index",
  "A trading platform",
];

export function CurrencyPairsQuiz({
  onBack,
  onComplete,
}: CurrencyPairsQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const answeredCorrectly = selectedAnswer === 0;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to lesson"
          onPress={onBack}
          style={styles.backButton}
        >
          <ArrowLeft color={colors.text} size={22} strokeWidth={2.4} />
        </Pressable>
        <View>
          <Text selectable style={styles.title}>
            Quick quiz
          </Text>
          <Text selectable style={styles.subtitle}>
            Question 1 of 1
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <Text selectable style={styles.question}>
        What does EUR/USD represent?
      </Text>

      <View style={styles.answers}>
        {answers.map((answer, index) => (
          <AnswerOption
            answer={answer}
            index={index}
            key={answer}
            selectedAnswer={selectedAnswer}
            onSelect={setSelectedAnswer}
          />
        ))}
      </View>

      {selectedAnswer !== null ? (
        <>
          <View style={styles.resultCard}>
            {answeredCorrectly ? (
              <CircleCheckBig
                color={colors.primary}
                size={32}
                strokeWidth={2.4}
              />
            ) : (
              <Trophy color={colors.accent} size={32} strokeWidth={2.4} />
            )}
            <View style={styles.resultCopy}>
              <Text selectable style={styles.resultTitle}>
                {answeredCorrectly ? "Correct! +20 XP" : "Not quite"}
              </Text>
              <Text selectable style={styles.resultText}>
                {answeredCorrectly
                  ? "EUR/USD tells you the value of one euro in US dollars."
                  : "EUR is the base currency and USD is the quote currency."}
              </Text>
            </View>
          </View>
          <Pressable onPress={onComplete} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Finish module</Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

type AnswerOptionProps = {
  answer: string;
  index: number;
  onSelect: (index: number) => void;
  selectedAnswer: number | null;
};

function AnswerOption({
  answer,
  index,
  onSelect,
  selectedAnswer,
}: AnswerOptionProps) {
  const isSelected = selectedAnswer === index;
  const isCorrect = index === 0;
  const showCorrectState = selectedAnswer !== null && isCorrect;

  return (
    <Pressable
      accessibilityLabel={`Answer: ${answer}`}
      onPress={() => onSelect(index)}
      style={[
        styles.answer,
        isSelected && styles.selectedAnswer,
        showCorrectState && styles.correctAnswer,
      ]}
    >
      <Text selectable style={styles.answerLetter}>
        {String.fromCharCode(65 + index)}
      </Text>
      <Text selectable style={styles.answerText}>
        {answer}
      </Text>
      {showCorrectState ? (
        <Check color={colors.primary} size={22} strokeWidth={3} />
      ) : null}
    </Pressable>
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
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    color: colors.mutedText,
    fontSize: 14,
  },
  progressTrack: {
    height: 8,
    overflow: "hidden",
    borderRadius: 99,
    backgroundColor: colors.progressTrack,
  },
  progressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
  },
  question: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 33,
  },
  answers: {
    gap: 10,
  },
  answer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 72,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  selectedAnswer: {
    borderColor: colors.accent,
  },
  correctAnswer: {
    borderColor: colors.primary,
    backgroundColor: "#0D323B",
  },
  answerLetter: {
    width: 38,
    height: 38,
    overflow: "hidden",
    paddingTop: 8,
    borderRadius: 19,
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  answerText: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  resultCard: {
    flexDirection: "row",
    gap: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#17616A",
    borderRadius: 20,
    backgroundColor: "#0C2B33",
  },
  resultCopy: {
    flex: 1,
    gap: 4,
  },
  resultTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  resultText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  completeButton: {
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  completeButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "800",
  },
});
