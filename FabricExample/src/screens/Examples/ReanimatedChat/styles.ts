import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  inverted: {
    transform: [
      {
        scaleY: -1,
      },
    ],
  },
});
