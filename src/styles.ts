import { StyleSheet, ViewStyle } from 'react-native';

type Styles = {
  container: ViewStyle;
  hidden: ViewStyle;
};

export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  hidden: {
    display: 'none',
    position: 'absolute',
  },
});
