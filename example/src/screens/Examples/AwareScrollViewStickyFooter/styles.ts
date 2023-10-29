import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 50,
  },
  pageContainer: {
    flex: 1,
  },
  footer: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    gap: 10,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
