import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  header: {
    color: 'black',
    marginRight: 12,
  },
  inverted: {
    transform: [
      /*{
        scaleY: -1,
      },*/
    ],
  },
  content: {
    flex: 1,
  },
});
