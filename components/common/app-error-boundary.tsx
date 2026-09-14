import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../src/theme';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) console.error('Forex Learning crashed inside the React tree', error, info.componentStack);
  }

  private retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <View style={styles.page}>
        <Text style={styles.eyebrow}>FOREX LEARNING</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.copy}>Your learning progress is stored on the server. Retry the app screen, or reopen the app if the problem continues.</Text>
        <Pressable onPress={this.retry} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 28, gap: 14 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.mainText, fontSize: 30, fontWeight: '900' },
  copy: { color: colors.mutedText, fontSize: 16, lineHeight: 24 },
  button: { minHeight: 50, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: '#06211F', fontWeight: '900', fontSize: 16 },
});
