import { useColorScheme as useColorSchemeRN } from "react-native";

const useColorScheme = () => useColorSchemeRN() || "light";

export default useColorScheme;
