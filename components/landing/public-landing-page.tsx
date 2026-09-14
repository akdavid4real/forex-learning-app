import { ArrowRight, BadgeCheck, BookOpen, ShieldCheck, Smartphone } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '../../src/theme';
import { PaymentEnrollmentForm } from './payment-enrollment-form';

const benefits = [
  'A structured path from market foundations to risk and trading process.',
  'Short lessons, checkpoints, progress tracking, XP and achievements.',
  'A learning-first product built around discipline rather than signals or hype.',
];

const steps = [
  { icon: BookOpen, title: 'Learn the programme', description: 'Review the training approach and decide whether the course fits your goals.' },
  { icon: ShieldCheck, title: 'Pay securely', description: 'Use the published bank details and keep your transfer reference.' },
  { icon: Smartphone, title: 'Send proof for review', description: 'Send your payment proof on the official WhatsApp number. The team verifies access manually.' },
];

export function PublicLandingPage() {
  const scrollRef = useRef<ScrollView>(null);
  const [enrollmentY, setEnrollmentY] = useState(0);
  const [proofSent, setProofSent] = useState(false);
  const { width } = useWindowDimensions();
  const wide = width >= 860;

  function goToEnrollment() {
    scrollRef.current?.scrollTo({ y: enrollmentY, animated: true });
  }

  return (
    <ScrollView ref={scrollRef} style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, wide && styles.wide]}>
        <Text style={styles.brand}>Forex Learning</Text>
        <Pressable onPress={goToEnrollment} style={styles.headerButton}><Text style={styles.headerButtonText}>Get started</Text></Pressable>
      </View>

      <View style={[styles.hero, wide && styles.heroWide, wide && styles.wide]}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>STRUCTURED FOREX EDUCATION</Text>
          <Text style={styles.heroTitle}>Trade with a plan, not a promise.</Text>
          <Text style={styles.heroText}>Learn how currency markets work, how to manage risk, and how to build a repeatable decision process before putting money at risk.</Text>
          <Pressable onPress={goToEnrollment} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Start enrollment</Text><ArrowRight size={19} color={colors.background} /></Pressable>
          <Text style={styles.microcopy}>Education only. No signals, guaranteed returns, or trade execution.</Text>
        </View>
        <View style={styles.mockupWrap}>
          <Image accessibilityLabel="Forex Learning learner dashboard" source={require('../../assets/mockups/forex-home-dashboard.png')} resizeMode="cover" style={styles.mockup} />
        </View>
      </View>

      <View style={styles.riskBand}>
        <ShieldCheck color={colors.accent} size={24} />
        <Text style={styles.riskText}><Text style={styles.riskStrong}>Know the risk.</Text> Forex trading can result in losses. This programme is educational and does not provide personalized investment advice or guarantee profit.</Text>
      </View>

      <View style={[styles.section, wide && styles.wide]}>
        <Text style={styles.sectionEyebrow}>WHY FOREX LEARNING</Text>
        <Text style={styles.sectionTitle}>Build understanding before exposure.</Text>
        <View style={[styles.cardGrid, wide && styles.cardGridWide]}>
          {benefits.map((benefit, index) => <View key={benefit} style={styles.card}><Text style={styles.cardNumber}>0{index + 1}</Text><Text style={styles.cardText}>{benefit}</Text></View>)}
        </View>
      </View>

      <View style={styles.darkSection}>
        <View style={[styles.section, wide && styles.wide]}>
          <Text style={styles.sectionEyebrow}>HOW ENROLLMENT WORKS</Text>
          <Text style={styles.sectionTitle}>Simple, manual, transparent.</Text>
          <Text style={styles.sectionCopy}>There is no fake instant approval. Payment proof is reviewed by the team before learner access is released.</Text>
          <View style={[styles.cardGrid, wide && styles.cardGridWide]}>
            {steps.map(({ icon: Icon, title, description }, index) => <View key={title} style={styles.stepCard}><View style={styles.iconCircle}><Icon color={colors.primary} size={22} /></View><Text style={styles.stepNumber}>STEP {index + 1}</Text><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepText}>{description}</Text></View>)}
          </View>
        </View>
      </View>

      <View onLayout={(event) => setEnrollmentY(event.nativeEvent.layout.y)}>
        <PaymentEnrollmentForm onPaymentSubmitted={() => setProofSent(true)} />
      </View>

      <View style={[styles.approval, wide && styles.wide]}>
        <BadgeCheck color={proofSent ? colors.accent : colors.primary} size={28} />
        <View style={styles.approvalCopy}>
          <Text style={styles.approvalTitle}>{proofSent ? 'Payment proof marked as sent.' : 'Access follows manual payment verification.'}</Text>
          <Text style={styles.approvalText}>{proofSent ? 'The team still needs to verify the transfer. Use the same email address when your learner account is activated.' : 'After your transfer and proof are verified, the team will provide your learner access instructions.'}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>Forex Learning</Text>
        <Text style={styles.footerText}>Structured education for better market decisions.</Text>
        <Text style={styles.footerLegal}>Forex trading involves substantial risk. Educational content is not financial advice and does not guarantee results.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 0 },
  wide: { width: '100%', maxWidth: 1180, alignSelf: 'center' },
  header: { minHeight: 74, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  brand: { color: colors.text, fontWeight: '900', fontSize: 20 },
  headerButton: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11 },
  headerButtonText: { color: colors.background, fontWeight: '900' },
  hero: { paddingHorizontal: 22, paddingVertical: 58, gap: 36 },
  heroWide: { flexDirection: 'row', alignItems: 'center', paddingVertical: 80 },
  heroCopy: { flex: 1, gap: 16, maxWidth: 650 },
  eyebrow: { color: colors.accent, fontWeight: '900', letterSpacing: 1.6, fontSize: 12 },
  heroTitle: { color: colors.text, fontWeight: '900', fontSize: 48, lineHeight: 54, letterSpacing: -1.6 },
  heroText: { color: colors.mutedText, fontSize: 18, lineHeight: 28, maxWidth: 620 },
  primaryButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 15 },
  primaryButtonText: { color: colors.background, fontWeight: '900', fontSize: 15 },
  microcopy: { color: colors.mutedText, fontSize: 12, lineHeight: 18 },
  mockupWrap: { flex: 1, minHeight: 420, maxWidth: 500, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  mockup: { width: '100%', height: 520 },
  riskBand: { paddingHorizontal: 22, paddingVertical: 20, backgroundColor: '#171B24', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#4B3B16', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 12 },
  riskText: { maxWidth: 900, color: '#D7C9A5', lineHeight: 22, flexShrink: 1 },
  riskStrong: { color: colors.accent, fontWeight: '900' },
  section: { paddingHorizontal: 22, paddingVertical: 72, gap: 18 },
  sectionEyebrow: { color: colors.primary, fontWeight: '900', fontSize: 12, letterSpacing: 1.5 },
  sectionTitle: { color: colors.text, fontSize: 34, lineHeight: 41, fontWeight: '900', maxWidth: 700 },
  sectionCopy: { color: colors.mutedText, lineHeight: 23, maxWidth: 720 },
  cardGrid: { gap: 14 },
  cardGridWide: { flexDirection: 'row' },
  card: { flex: 1, minHeight: 170, backgroundColor: colors.surface, borderRadius: 18, padding: 20, gap: 16, borderWidth: 1, borderColor: colors.border },
  cardNumber: { color: colors.accent, fontWeight: '900', fontSize: 13 },
  cardText: { color: colors.text, fontWeight: '700', fontSize: 17, lineHeight: 25 },
  darkSection: { backgroundColor: '#0D1829' },
  stepCard: { flex: 1, minHeight: 220, backgroundColor: colors.surface, borderRadius: 18, padding: 20, gap: 10, borderWidth: 1, borderColor: '#2B4262' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0C2A2B', alignItems: 'center', justifyContent: 'center' },
  stepNumber: { color: colors.accent, fontWeight: '900', fontSize: 11, letterSpacing: 1.2, marginTop: 6 },
  stepTitle: { color: colors.text, fontWeight: '900', fontSize: 18 },
  stepText: { color: colors.mutedText, lineHeight: 22 },
  approval: { paddingHorizontal: 22, paddingVertical: 50, flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  approvalCopy: { flex: 1, gap: 7 },
  approvalTitle: { color: colors.text, fontWeight: '900', fontSize: 22 },
  approvalText: { color: colors.mutedText, lineHeight: 22, maxWidth: 760 },
  footer: { backgroundColor: '#070C14', paddingHorizontal: 22, paddingVertical: 44, alignItems: 'center', gap: 8 },
  footerBrand: { color: colors.text, fontWeight: '900', fontSize: 18 },
  footerText: { color: colors.mutedText, textAlign: 'center' },
  footerLegal: { color: '#718096', maxWidth: 760, textAlign: 'center', lineHeight: 18, fontSize: 11, marginTop: 8 },
});
