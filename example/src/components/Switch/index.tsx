import { StyleSheet, TouchableOpacity, View } from "react-native";

type SwitchProps = {
  value: boolean;
  onChange: () => void;
  testID: string;
};

const Switch = ({ onChange, testID, value }: SwitchProps) => {
  return (
    <TouchableOpacity testID={testID} onPress={onChange}>
      <View style={[styles.checkbox, value && styles.checked]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#3c3c3c",
    borderRadius: 4,
  },
  checked: {
    backgroundColor: "#28519e",
  },
});

export default Switch;
