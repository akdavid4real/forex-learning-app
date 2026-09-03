import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  Smartphone,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { colors } from "../../src/theme";
import { PaymentEnrollmentForm } from "./payment-enrollment-form";

const advantages = [
  "A clear learning path from forex foundations to risk management.",
  "Short lessons and quizzes built to make concepts stick.",
  "One approved place for your course materials and progress.",
];

const registrationSteps = [
  {
    description:
      "Register with your NIN and email. Your unique referral code is generated for you.",
    icon: MailCheck,
    number: "01",
    title: "Register securely",
  },
  {
    description:
      "Make your transfer using the details on this page, then send your proof of payment.",
    icon: ShieldCheck,
    number: "02",
    title: "Confirm your payment",
  },
  {
    description:
      "Once payment is approved, your download link becomes available and training can begin.",
    icon: Smartphone,
    number: "03",
    title: "Download the app",
  },
];

export function LandingPage() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [enrollmentOffset, setEnrollmentOffset] = useState(0);
  const [hasSubmittedPayment, setHasSubmittedPayment] = useState(false);
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 760;

  function scrollToEnrollment() {
    scrollViewRef.current?.scrollTo({
      animated: true,
      y: enrollmentOffset,
    });
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <View style={[styles.header, isWideLayout && styles.widePadding]}>
        <Text selectable style={styles.brand}>
          Forex Learning
        </Text>
        {isWideLayout ? (
          <View style={styles.navigation}>
            <Text selectable style={styles.navigationLink}>
              Programme
            </Text>
            <Text selectable style={styles.navigationLink}>
              How it works
            </Text>
            <Text selectable style={styles.navigationLink}>
              FAQs
            </Text>
          </View>
        ) : null}
        <Pressable onPress={scrollToEnrollment} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Get started</Text>
        </Pressable>
      </View>

      <View style={[styles.hero, isWideLayout && styles.wideHero]}>
        <View style={styles.heroCopy}>
          <Text selectable style={styles.heroTitle}>
            Trade with a plan, not a promise.
          </Text>
          <Text selectable style={styles.heroDescription}>
            Forex Learning gives you a structured way to build the knowledge,
            discipline, and practical understanding behind every decision.
          </Text>
          <Pressable onPress={scrollToEnrollment} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              Start your registration
            </Text>
            <ArrowRight color={colors.background} size={19} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.heroFootnote}>
            <LockKeyhole color={colors.primary} size={16} strokeWidth={2.3} />
            <Text selectable style={styles.heroFootnoteText}>
              App access is released after payment approval.
            </Text>
          </View>
        </View>

        <View style={styles.phoneScene}>
          <View style={styles.chartLineOne} />
          <View style={styles.chartLineTwo} />
          <View style={styles.phoneFrame}>
            <Image
              accessibilityLabel="Forex Learning course screen"
              resizeMode="cover"
              source={require("../../assets/mockups/forex-home-dashboard.png")}
              style={styles.phoneImage}
            />
          </View>
          <View style={styles.sceneCaption}>
            <BookOpen color={colors.accent} size={18} strokeWidth={2.2} />
            <Text selectable style={styles.sceneCaptionText}>
              Training that meets you at your level.
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.introBand, isWideLayout && styles.wideIntroBand]}>
        <Text selectable style={styles.bandStatement}>
          Learning forex should feel clear, focused, and within reach.
        </Text>
        <Text selectable style={styles.bandCopy}>
          This is a training programme for people who want to understand the
          market before they risk their money.
        </Text>
      </View>

      <View
        style={[styles.advantagesSection, isWideLayout && styles.widePadding]}
      >
        <View style={styles.advantagesHeading}>
          <Text selectable style={styles.sectionTitle}>
            A better place to begin.
          </Text>
        </View>
        <View style={styles.advantagesList}>
          {advantages.map((advantage, index) => (
            <View key={advantage} style={styles.advantageItem}>
              <Text selectable style={styles.advantageNumber}>
                0{index + 1}
              </Text>
              <Text selectable style={styles.advantageText}>
                {advantage}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.processSection}>
        <View
          style={[styles.processHeading, isWideLayout && styles.widePadding]}
        >
          <Text selectable style={styles.sectionTitle}>
            A simple route to your training app.
          </Text>
          <Text selectable style={styles.processIntro}>
            We keep access intentional. Complete each step, and you will know
            exactly what happens next.
          </Text>
        </View>
        <View style={[styles.steps, isWideLayout && styles.wideSteps]}>
          {registrationSteps.map((step) => {
            const Icon = step.icon;

            return (
              <View key={step.number} style={styles.step}>
                <Text selectable style={styles.stepNumber}>
                  {step.number}
                </Text>
                <Icon color={colors.primary} size={26} strokeWidth={1.9} />
                <Text selectable style={styles.stepTitle}>
                  {step.title}
                </Text>
                <Text selectable style={styles.stepDescription}>
                  {step.description}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View
        onLayout={(event) => setEnrollmentOffset(event.nativeEvent.layout.y)}
      >
        <PaymentEnrollmentForm
          onPaymentSubmitted={() => setHasSubmittedPayment(true)}
        />
      </View>

      <View
        style={[styles.approvalSection, isWideLayout && styles.wideApproval]}
      >
        <View style={styles.approvalCopy}>
          <BadgeCheck color={colors.primary} size={26} strokeWidth={2} />
          <Text selectable style={styles.approvalTitle}>
            {hasSubmittedPayment
              ? "Your payment is awaiting verification."
              : "Your app download unlocks after approval."}
          </Text>
          <Text selectable style={styles.approvalDescription}>
            {hasSubmittedPayment
              ? "The team will review your transfer and release your access once payment is confirmed."
              : "After the team confirms your payment proof, you will receive access to the Forex Learning app and its training materials."}
          </Text>
        </View>
        <View
          style={
            hasSubmittedPayment
              ? styles.awaitingApproval
              : styles.lockedDownload
          }
        >
          <LockKeyhole
            color={hasSubmittedPayment ? "#F4D68C" : colors.mutedText}
            size={19}
            strokeWidth={2.1}
          />
          <Text
            selectable
            style={
              hasSubmittedPayment
                ? styles.awaitingApprovalText
                : styles.lockedDownloadText
            }
          >
            {hasSubmittedPayment
              ? "Awaiting approval — download link will be sent after confirmation."
              : "Download link locked"}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, isWideLayout && styles.widePadding]}>
        <Text selectable style={styles.footerBrand}>
          Forex Learning
        </Text>
        <Text selectable style={styles.footerCopy}>
          Structured forex education for deliberate learners.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  widePadding: {
    paddingHorizontal: "8%",
  },
  brand: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  navigation: {
    flexDirection: "row",
    gap: 34,
  },
  navigationLink: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "700",
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  headerButtonText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: "800",
  },
  hero: {
    gap: 38,
    paddingHorizontal: 22,
    paddingTop: 62,
    paddingBottom: 72,
  },
  wideHero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 70,
    minHeight: 610,
    paddingHorizontal: "8%",
    paddingVertical: 78,
  },
  heroCopy: {
    flex: 1,
    maxWidth: 570,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 51,
    fontWeight: "800",
    letterSpacing: -2.1,
    lineHeight: 57,
  },
  heroDescription: {
    marginTop: 20,
    color: colors.mutedText,
    fontSize: 17,
    lineHeight: 27,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
    minHeight: 53,
    marginTop: 30,
    paddingHorizontal: 19,
    borderRadius: 11,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "800",
  },
  heroFootnote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 19,
  },
  heroFootnoteText: {
    color: "#B4C7D9",
    fontSize: 13,
    fontWeight: "600",
  },
  phoneScene: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 330,
    height: 435,
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#10243A",
  },
  chartLineOne: {
    position: "absolute",
    top: 109,
    left: -35,
    width: 330,
    height: 1,
    transform: [{ rotate: "-23deg" }],
    backgroundColor: "#266A73",
  },
  chartLineTwo: {
    position: "absolute",
    top: 245,
    right: -55,
    width: 340,
    height: 1,
    transform: [{ rotate: "22deg" }],
    backgroundColor: "#725D31",
  },
  phoneFrame: {
    width: 194,
    height: 350,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#263650",
    borderRadius: 27,
    backgroundColor: colors.surface,
  },
  phoneImage: {
    width: "100%",
    height: "100%",
  },
  sceneCaption: {
    position: "absolute",
    right: 16,
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 11,
    borderWidth: 1,
    borderColor: "#31516C",
    borderRadius: 10,
    backgroundColor: "#101B2ACC",
  },
  sceneCaptionText: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  introBand: {
    gap: 20,
    paddingHorizontal: 22,
    paddingVertical: 58,
    backgroundColor: colors.primary,
  },
  wideIntroBand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 72,
    paddingHorizontal: "12%",
    paddingVertical: 68,
  },
  bandStatement: {
    flex: 1,
    color: colors.background,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 35,
  },
  bandCopy: {
    flex: 1,
    maxWidth: 410,
    color: "#073B39",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 25,
  },
  advantagesSection: {
    gap: 44,
    paddingHorizontal: 22,
    paddingVertical: 76,
  },
  advantagesHeading: {
    gap: 12,
    maxWidth: 410,
  },
  sectionNumber: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 33,
    fontWeight: "800",
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  advantagesList: {
    gap: 0,
    maxWidth: 800,
  },
  advantageItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  advantageNumber: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  advantageText: {
    flex: 1,
    color: "#D5E0EE",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 26,
  },
  processSection: {
    paddingTop: 76,
    paddingBottom: 18,
    backgroundColor: "#0D1829",
  },
  processHeading: {
    gap: 14,
    paddingHorizontal: 22,
    paddingBottom: 42,
  },
  processIntro: {
    maxWidth: 520,
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 25,
  },
  steps: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  wideSteps: {
    flexDirection: "row",
  },
  step: {
    flex: 1,
    gap: 15,
    minHeight: 274,
    padding: 26,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  stepNumber: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  stepTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  stepDescription: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 22,
  },
  approvalSection: {
    gap: 28,
    paddingHorizontal: 22,
    paddingVertical: 62,
  },
  wideApproval: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 60,
    paddingHorizontal: "12%",
    paddingVertical: 72,
  },
  approvalCopy: {
    gap: 13,
    maxWidth: 560,
  },
  approvalTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 37,
  },
  approvalDescription: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 25,
  },
  lockedDownload: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#31415A",
    borderRadius: 10,
  },
  lockedDownloadText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "800",
  },
  awaitingApproval: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: 320,
    padding: 18,
    borderWidth: 1,
    borderColor: "#947836",
    borderRadius: 12,
    backgroundColor: "#2C2819",
  },
  awaitingApprovalText: {
    flex: 1,
    color: "#F4D68C",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
  },
  footer: {
    gap: 9,
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 48,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerBrand: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  footerCopy: {
    color: colors.mutedText,
    fontSize: 13,
  },
});
