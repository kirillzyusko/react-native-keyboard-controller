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
        transparent
        animationType="slide"
        style={styles.container}
        testID="autofill_contacts_modal"
        visible={visible}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.closeButton}
            testID="autofill_contacts_close"
            onPress={handleCloseModalPress}
          >
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
          {contacts.map((contact, i) => (
            <TouchableOpacity
              key={contact.name}
              style={styles.contactButton}
              testID={`contact_${i}`}
              onPress={() => handleContactSelection(contact)}
            >
              <Image source={{ uri: contact.image }} style={styles.avatar} />
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
