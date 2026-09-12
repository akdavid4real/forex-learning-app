import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLearnerData } from '../../src/learner-data-context';
import { useSession } from '../../src/session-context';
import { colors } from '../../src/theme';

export function LiveLearnerProfile() {
  const { achievements, bookmarks, profile } = useLearnerData();
  const { session, signOut } = useSession();

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>PROFILE</Text>
      <Text style={styles.title}>{profile?.display_name || session?.user.email?.split('@')[0] || 'Forex Learner'}</Text>
      <Text style={styles.muted}>{session?.user.email ?? 'Demo learner'}</Text>

      <View style={styles.stats}>
        <Stat label="XP" value={String(profile?.xp ?? 0)} />
        <Stat label="Current streak" value={`${profile?.current_streak ?? 0}d`} />
        <Stat label="Best streak" value={`${profile?.longest_streak ?? 0}d`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Achievements</Text>
        <Text style={styles.bigNumber}>{achievements.length}</Text>
        <Text style={styles.muted}>{achievements.length ? 'Keep building your learning streak.' : 'Your first achievement is waiting.'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saved lessons</Text>
        <Text style={styles.bigNumber}>{bookmarks.length}</Text>
        <Text style={styles.muted}>Bookmark lessons you want to revisit quickly.</Text>
      </View>

      {session ? (
        <Pressable onPress={() => void signOut()} style={styles.signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { padding: 20, gap: 14 },
  eyebrow: { color: colors.accent, fontWeight: '800', letterSpacing: 1.3, fontSize: 12 },
  title: { color: colors.mainText, fontWeight: '900', fontSize: 30 },
  muted: { color: colors.mutedText, lineHeight: 20 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, minHeight: 86, justifyContent: 'center' },
  statValue: { color: colors.mainText, fontWeight: '900', fontSize: 22 },
  statLabel: { color: colors.mutedText, fontSize: 12, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, gap: 6 },
  cardTitle: { color: colors.mainText, fontWeight: '800', fontSize: 17 },
  bigNumber: { color: colors.primary, fontWeight: '900', fontSize: 32 },
  signOut: { borderRadius: 14, borderWidth: 1, borderColor: '#57313A', minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  signOutText: { color: '#FCA5A5', fontWeight: '800' },
});
