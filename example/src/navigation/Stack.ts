import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "./RootStack";

export const Stack = createNativeStackNavigator<RootStackParamList>();
