import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { ScreenNames } from "../../../../../constants/screenNames";
import { useChatConfigStore } from "../../store";
import Avatar from "../Avatar";

import type { ExamplesStackParamList } from "../../../../../navigation/ExamplesStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function ContactTitle() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExamplesStackParamList>>();
  const contactName = useChatConfigStore((state) => state.contactName);

  const openProfile = useCallback(() => {
    navigation.navigate(ScreenNames.CHAT_KIT_PROFILE);
  }, [navigation]);

  return (
    <TouchableOpacity
      style={styles.container}
      testID="chat.contact"
      onPress={openProfile}
    >
      <Avatar name={contactName} size={32} />
      <Text numberOfLines={1} style={styles.name}>
        {contactName.trim() || "Unknown"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    flexShrink: 1,
  },
});
