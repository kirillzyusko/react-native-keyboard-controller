import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    color: 'black',
    marginRight: 12,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    maxHeight: 600,
  },
  heading: {
    fontSize: 36,
    marginBottom: 48,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-between',
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});
