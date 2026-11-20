import React from "react";

import ContactTitle from "./components/ContactTitle";

import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const renderContactTitle = () => <ContactTitle />;

const header: NativeStackNavigationOptions = {
  headerTintColor: "#fff",
  headerStyle: {
    backgroundColor: "#3A3A3C",
  },
  headerBackButtonDisplayMode: "minimal",
};

export const chatOptions: NativeStackNavigationOptions = {
  ...header,
  title: "Chat Kit",
  headerTitle: renderContactTitle,
};

export const profileOptions: NativeStackNavigationOptions = {
  ...header,
  title: "Contact",
};
