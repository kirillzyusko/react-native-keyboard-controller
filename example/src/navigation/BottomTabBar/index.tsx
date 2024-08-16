import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { StyleSheet, Text } from "react-native";

import KeyboardAnimation from "../../screens/Examples/KeyboardAnimation";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const HomeStackScreens = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen component={KeyboardAnimation} name="Home" />
    </HomeStack.Navigator>
  );
};

const SettingsStackScreens = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen component={KeyboardAnimation} name="Settings" />
    </SettingsStack.Navigator>
  );
};

export default function BottomTabBar() {
  return (
    <Tab.Navigator
      detachInactiveScreens={true}
      screenOptions={({ route }) => ({
        tabBarItemStyle: styles.tabBar,
        tabBarIcon: () =>
          route.name === "HomeStack" ? (
            <Text style={styles.icon}>🏠</Text>
          ) : (
            <Text style={styles.icon}>⚙️</Text>
          ),
        tabBarLabel: () =>
          route.name === "HomeStack" ? (
            <Text style={styles.label}>Home</Text>
          ) : (
            <Text style={styles.label}>Settings</Text>
          ),
        headerShown: false,
      })}
    >
      <Tab.Screen component={HomeStackScreens} name="HomeStack" />
      <Tab.Screen component={SettingsStackScreens} name="SettingsStack" />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    color: "white",
    fontSize: 20,
  },
  label: {
    color: "white",
  },
  tabBar: {
    backgroundColor: "#2c2c2c",
  },
});
