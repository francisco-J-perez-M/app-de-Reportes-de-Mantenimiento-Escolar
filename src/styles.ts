import { StyleSheet } from 'react-native';

export const colors = {
  ink: '#163447',
  muted: '#647887',
  primary: '#176B87',
  background: '#F2F6F7',
  white: '#FFFFFF',
  border: '#D8E2E6',
  danger: '#A93226',
  green: '#237A57',
  amber: '#A96B12',
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36 },
  header: { backgroundColor: colors.white, padding: 18, borderBottomWidth: 1, borderColor: colors.border },
  heading: { color: colors.ink, fontSize: 24, fontWeight: '700' },
  subheading: { color: colors.muted, fontSize: 14, marginTop: 5 },
  card: { backgroundColor: colors.white, padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 12, color: colors.ink, fontSize: 15 },
  label: { color: colors.ink, fontWeight: '600', marginBottom: 7, marginTop: 15 },
  button: { minHeight: 46, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  secondaryButton: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary },
  secondaryButtonText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  error: { color: colors.danger, marginTop: 12, lineHeight: 20 },
  muted: { color: colors.muted, lineHeight: 21 },
});
