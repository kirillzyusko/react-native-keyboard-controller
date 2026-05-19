import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import Switch from "../../../components/Switch";
import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<ExamplesStackParamList>;

const ABOUT_ME = `I'm a software engineer based in San Francisco. I have over 5 years of experience working with React Native and mobile development. Currently looking to verify my identity to unlock full platform features.`;

export default function AwareScrollView({ navigation }: Props) {
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [disableScrollOnKeyboardHide, setDisableScrollOnKeyboardHide] =
    useState(false);
  const [enabled, setEnabled] = useState(true);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.expand();
  }, []);

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerStyle={styles.content}
        disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
        enabled={enabled}
        style={styles.container}
        testID="aware_scroll_view_container"
      >
        <Text style={styles.formTitle}>Identity Verification</Text>
        <Text style={styles.formSubtitle}>
          Please fill in your details below to complete your KYC verification.
          All fields are required.
        </Text>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TextInput
          title="First Name"
          keyboardType="default"
          placeholder="First Name"
          returnKeyType="next"
        />
        <TextInput
          title="Last Name"
          keyboardType="default"
          placeholder="Last Name"
          returnKeyType="next"
        />
        <TextInput
          title="Date of Birth"
          keyboardType="default"
          placeholder="Date of Birth"
          returnKeyType="next"
        />
        <TextInput
          title="Nationality"
          keyboardType="default"
          placeholder="Nationality"
          returnKeyType="next"
        />

        {/* Contact Details */}
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <TextInput
          title="Email Address"
          keyboardType="email-address"
          placeholder="Email Address"
          returnKeyType="next"
        />
        <TextInput
          title="Phone Number"
          keyboardType="phone-pad"
          placeholder="Phone Number"
          returnKeyType="next"
        />

        {/* Address */}
        <Text style={styles.sectionTitle}>Residential Address</Text>
        <TextInput
          title="Street Address"
          keyboardType="default"
          placeholder="Street Address"
          returnKeyType="next"
        />
        <TextInput
          title="City"
          keyboardType="default"
          placeholder="City"
          returnKeyType="next"
        />
        <TextInput
          title="State / Province"
          keyboardType="default"
          placeholder="State / Province"
          returnKeyType="next"
        />
        <TextInput
          title="Postal Code"
          keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
          placeholder="Postal Code"
          returnKeyType="next"
        />
        <TextInput
          title="Country"
          keyboardType="default"
          placeholder="Country"
          returnKeyType="next"
        />

        {/* Document Info */}
        <Text style={styles.sectionTitle}>Document Information</Text>
        <TextInput
          title="Document Type"
          keyboardType="default"
          placeholder="Document Type"
          returnKeyType="next"
        />
        <TextInput
          title="Document Number"
          contextMenuHidden={Platform.OS === "ios"}
          keyboardType="default"
          placeholder="Document Number"
          returnKeyType="next"
        />
        <TextInput
          title="Issuing Country"
          keyboardType="default"
          placeholder="Issuing Country"
          returnKeyType="next"
        />
        <TextInput
          title="Expiration Date"
          keyboardType="default"
          placeholder="Expiration Date"
          returnKeyType="next"
        />

        {/* Additional */}
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <TextInput
          defaultValue={ABOUT_ME}
          title="About Me"
          placeholder="About Me"
          style={styles.input}
        />
      </KeyboardAwareScrollView>

      <BottomSheet ref={bottomSheetModalRef} index={-1} snapPoints={["40%"]}>
        <BottomSheetView style={styles.bottomSheetContent}>
          <Button
            testID="bottom_sheet_close_modal"
            title="Close modal"
            onPress={() => bottomSheetModalRef.current?.close()}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Toggle back scroll</Text>
            <Switch
              testID="bottom_sheet_toggle_back_scroll"
              value={disableScrollOnKeyboardHide}
              onChange={() => {
                setDisableScrollOnKeyboardHide(!disableScrollOnKeyboardHide);
              }}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Toggle enabled</Text>
            <Switch
              testID="bottom_sheet_toggle_enabled_state"
              value={enabled}
              onChange={() => {
                setEnabled(!enabled);
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
