import React, { useCallback, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
        <Text style={styles.autoFillContacts}>AutoFill Contacts</Text>
      </TouchableOpacity>
      <Modal
        style={styles.container}
        visible={visible}
        animationType="slide"
        transparent
        testID="autofill_contacts_modal"
      >
        <View style={styles.content}>
          <TouchableOpacity
            onPress={handleCloseModalPress}
            style={styles.closeButton}
            testID="autofill_contacts_close"
          >
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
          {contacts.map((contact, i) => (
            <TouchableOpacity
              key={contact.name}
              testID={`contact_${i}`}
              style={styles.contactButton}
              onPress={() => handleContactSelection(contact)}
            >
              <Image style={styles.avatar} source={{ uri: contact.image }} />
              <Text style={styles.contactName}>{contact.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#fafafa",
    borderRadius: 20,
  },
  autoFillContacts: {
    color: "#acacac",
  },
  container: {
    marginTop: 200,
  },
  content: {
    marginTop: 200,
    backgroundColor: "#cecece",
    flex: 1,
    paddingHorizontal: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  close: {
    color: "black",
  },
  closeButton: {
    justifyContent: "flex-end",
    flexDirection: "row",
    marginTop: 8,
    marginRight: 4,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  contactName: {
    marginLeft: 12,
    color: "black",
  },
});

export default AutoFillContacts;
