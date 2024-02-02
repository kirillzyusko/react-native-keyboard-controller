import React, { useCallback, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import {
  KeyboardController,
  KeyboardEvents,
} from "react-native-keyboard-controller";

export type Contact = {
  image: string;
  name: string;
};
const contacts: Contact[] = [
  {
    image: "https://avatars.githubusercontent.com/u/22820318",
    name: "Kiryl",
  },
  {
    image: "https://avatars.githubusercontent.com/u/86000012?v=4",
    name: "Ivan",
  },
  {
    image: "https://avatars.githubusercontent.com/u/504909?v=4",
    name: "Hirbod",
  },
  {
    image: "https://avatars.githubusercontent.com/u/99968085?v=4",
    name: "Oren",
  },
  {
    image: "https://avatars.githubusercontent.com/u/115457344?v=4",
    name: "Vladyslav",
  },
];

type Props = {
  onContactSelected: (contact: Contact) => void;
};

const AutoFillContacts = ({ onContactSelected }: Props) => {
  const [visible, setVisible] = useState(false);
  const handlePresentModalPress = useCallback(() => {
    const subscription = KeyboardEvents.addListener("keyboardDidHide", () => {
      setVisible(true);
      subscription.remove();
    });

    KeyboardController.dismiss();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    setVisible(false);

    setTimeout(() => {
      KeyboardController.setFocusTo("current");
    }, 500);
  }, []);
  const handleContactSelection = useCallback((contact: Contact) => {
    onContactSelected(contact);
    setVisible(false);

    setTimeout(() => {
      KeyboardController.setFocusTo("next");
    }, 500);
  }, []);

  return (
    <>
      <TouchableOpacity
        testID="autofill_contacts"
        onPress={handlePresentModalPress}
      >
        <Text>AutoFill Contacts</Text>
      </TouchableOpacity>
      <Modal
        style={{ marginTop: 200 }}
        visible={visible}
        animationType="slide"
        transparent
        testID="autofill_contacts_modal"
      >
        <View
          style={{
            marginTop: 200,
            backgroundColor: "#cecece",
            flex: 1,
            paddingHorizontal: 12,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleCloseModalPress}
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              marginTop: 8,
              marginRight: 4,
            }}
            testID="autofill_contacts_close"
          >
            <Text>Close</Text>
          </TouchableOpacity>
          {contacts.map((contact, i) => (
            <TouchableOpacity
              key={contact.name}
              testID={`contact_${i}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 6,
              }}
              onPress={() => handleContactSelection(contact)}
            >
              <Image
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#fafafa",
                  borderRadius: 20,
                }}
                source={{ uri: contact.image }}
              />
              <Text style={{ marginLeft: 12, color: "black" }}>
                {contact.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
};

export default AutoFillContacts;
