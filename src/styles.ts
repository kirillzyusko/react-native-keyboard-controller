import { StyleSheet, ViewStyle } from "react-native";

type Styles = {
  container: ViewStyle;
};

export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
});
