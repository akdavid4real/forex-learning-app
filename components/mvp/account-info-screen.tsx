import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../src/theme';

type InfoKind = 'about' | 'privacy' | 'support';

const content: Record<Exclude<InfoKind, 'support'>, { eyebrow: string; title: string; paragraphs: string[] }> = {
  about: {
    eyebrow: 'ABOUT',
    title: 'Forex Learning',
    paragraphs: [
      'Forex Learning is a structured education product for understanding currency markets, risk management and disciplined trading processes.',
      'It is not a signal service, broker, investment adviser or promise of profit. Learning content is designed to help users understand risk before putting capital at risk.',
      'Version 1.0.0',
    ],
  },
  privacy: {
    eyebrow: 'PRIVACY',
    title: 'How your data is used',
    paragraphs: [
      'Your account uses Supabase authentication. The learning service stores only the profile and learning records needed to provide your course experience, including progress, quiz attempts, bookmarks, XP and streaks.',
      'The mobile app does not require your NIN, banking PIN, OTP or Supabase service-role credentials. Payment proof is handled separately through the public enrollment process.',
      'Your employer or unrelated third parties are not part of this learning account flow. Administrative access is restricted to trusted application administrators.',
      'Before public store release, the same policy must also be published at the external privacy-policy URL used in the app-store listing.',
    ],
  },
};

export function AccountInfoScreen({ kind, onBack }: { kind: InfoKind; onBack: () => void }) {
  const supportEmail = process.env.EXPO_PUBLIC_SUPPORT_EMAIL?.trim() ?? '';

  if (kind === 'support') {
    return (
      <View style={styles.screen}>
        <Pressable onPress={onBack}><Text style={styles.link}>← Profile</Text></Pressable>
        <Text style={styles.eyebrow}>SUPPORT</Text>
        <Text style={styles.title}>Need help?</Text>
        <Text style={styles.copy}>For account access, payment approval or a learning issue, contact the Forex Learning team.</Text>
        {supportEmail ? (
          <Pressable onPress={() => void Linking.openURL(`mailto:${supportEmail}?subject=Forex%20Learning%20Support`)} style={styles.primary}>
            <Text style={styles.primaryText}>Email {supportEmail}</Text>
          </Pressable>
        ) : (
          <View style={styles.notice}><Text selectable style={styles.noticeText}>Support email is not configured yet. Use the official contact method provided during enrollment.</Text></View>
        )}
      </View>
    );
  }

  const section = content[kind];
  return (
    <View style={styles.screen}>
      <Pressable onPress={onBack}><Text style={styles.link}>← Profile</Text></Pressable>
      <Text style={styles.eyebrow}>{section.eyebrow}</Text>
      <Text style={styles.title}>{section.title}</Text>
      {section.paragraphs.map((paragraph) => <Text selectable key={paragraph} style={styles.copy}>{paragraph}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 14 },
  link: { color: colors.primary, fontWeight: '900' },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.mainText, fontSize: 28, lineHeight: 34, fontWeight: '900' },
  copy: { color: colors.mutedText, fontSize: 15, lineHeight: 23 },
  primary: { backgroundColor: colors.primary, borderRadius: 14, minHeight: 50, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  primaryText: { color: colors.background, fontWeight: '900' },
  notice: { backgroundColor: colors.surface, borderRadius: 14, padding: 14 },
  noticeText: { color: colors.mutedText, lineHeight: 20 },
});
