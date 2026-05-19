import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SwitchProps = {
  value: boolean;
  onChange: () => void;
  testID: string;
};

const Switch = ({ onChange, testID, value }: SwitchProps) => {
  return (
    <TouchableOpacity testID={testID} onPress={onChange}>
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <Text style={styles.checkmark}>{"✓"}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Switch;
