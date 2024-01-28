import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  KeyboardController,
  KeyboardEvents,
} from "react-native-keyboard-controller";

type Contact = {
  image: string;
  name: string;
};
const contacts: Contact[] = [
  {
    image: "https://avatars.githubusercontent.com/u/22820318",
    name: "Kiryl Ziusko",
  },
  {
    image: "https://avatars.githubusercontent.com/u/86000012?v=4",
    name: "Ivan Ihnatsiuk",
  },
  {
    image: "https://avatars.githubusercontent.com/u/504909?v=4",
    name: "Hirbod",
  },
  {
    image: "https://avatars.githubusercontent.com/u/99968085?v=4",
    name: "Oren Nurkeldi",
  },
  {
    image: "https://avatars.githubusercontent.com/u/115457344?v=4",
    name: "Vladyslav Martynov",
  },
];

const AutoFillContacts = () => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const handlePresentModalPress = useCallback(() => {
    KeyboardController.dismiss();

    const subscription = KeyboardEvents.addListener("keyboardDidHide", () => {
      bottomSheetModalRef.current?.present();
      subscription.remove();
    });
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();

    setTimeout(() => {
      KeyboardController.setFocusTo("current");
    }, 500);
  }, []);
  const handleContactSelection = useCallback((contact: Contact) => {
    bottomSheetModalRef.current?.close();
  }, []);

  return (
    <>
      <TouchableOpacity onPress={handlePresentModalPress}>
        <Text>AutoFill Contacts</Text>
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{ borderRadius: 20, backgroundColor: "#ebebeb" }}
        handleComponent={null}
      >
        <View style={{ paddingHorizontal: 12 }}>
          <TouchableOpacity
            onPress={handleCloseModalPress}
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              marginTop: 8,
              marginRight: 4,
            }}
          >
            <Text>Close</Text>
          </TouchableOpacity>
          {contacts.map((contact) => (
            <TouchableOpacity
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
                  backgroundColor: "red",
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
      </BottomSheetModal>
    </>
  );
};

export default AutoFillContacts;
