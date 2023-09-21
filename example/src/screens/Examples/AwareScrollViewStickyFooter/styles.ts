import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  pageContainer: {
    ...StyleSheet.absoluteFillObject,
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
