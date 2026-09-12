import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../src/theme';

export function SectionLoading({ label = 'Loading…' }: { label?: string }) {
  return <View style={styles.state}><ActivityIndicator /><Text style={styles.muted}>{label}</Text></View>;
}

export function SectionError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.state}>
      <Text style={styles.error}>{message}</Text>
      {onRetry ? <Pressable onPress={onRetry}><Text style={styles.retry}>Try again</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  state: { padding: 20, alignItems: 'center', justifyContent: 'center', gap: 10 },
  muted: { color: colors.mutedText },
  error: { color: '#FCA5A5', textAlign: 'center' },
  retry: { color: colors.primary, fontWeight: '800' },
});
