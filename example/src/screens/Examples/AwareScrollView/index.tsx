import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Switch from "../../../components/Switch";
import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<ExamplesStackParamList>;

const ADDITIONAL_NOTES = `I'm relocating from Germany to the US next month, so my residential address will change. Please use my current address for now. I can provide updated documentation once my new lease is finalized.`;

export default function AwareScrollView({ navigation }: Props) {
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [disableScrollOnKeyboardHide, setDisableScrollOnKeyboardHide] =
    useState(false);
  const [enabled, setEnabled] = useState(true);
  const insets = useSafeAreaInsets();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.expand();
  }, []);

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
        enabled={enabled}
        style={styles.container}
        testID="aware_scroll_view_container"
      >
        <View style={styles.progressContainer}>
          <Text style={styles.stepLabel}>Step 1 of 3</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

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
          placeholder="John"
          returnKeyType="next"
        />
        <TextInput
          title="Last Name"
          keyboardType="default"
          placeholder="Doe"
          returnKeyType="next"
        />
        <TextInput
          title="Date of Birth"
          keyboardType="default"
          placeholder="MM / DD / YYYY"
          returnKeyType="next"
        />
        <TextInput
          title="Nationality"
          keyboardType="default"
          placeholder="e.g. American"
          returnKeyType="next"
        />

        {/* Contact Details */}
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <TextInput
          title="Email Address"
          keyboardType="email-address"
          placeholder="john.doe@example.com"
          returnKeyType="next"
        />
        <TextInput
          title="Phone Number"
          keyboardType="phone-pad"
          placeholder="+1 (555) 000-0000"
          returnKeyType="next"
        />

        {/* Address */}
        <Text style={styles.sectionTitle}>Residential Address</Text>
        <TextInput
          title="Street Address"
          keyboardType="default"
          placeholder="123 Main Street, Apt 4B"
          returnKeyType="next"
        />
        <TextInput
          title="City"
          keyboardType="default"
          placeholder="San Francisco"
          returnKeyType="next"
        />
        <TextInput
          title="State / Province"
          keyboardType="default"
          placeholder="California"
          returnKeyType="next"
        />
        <TextInput
          title="Postal Code"
          keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
          placeholder="94102"
          returnKeyType="next"
        />
        <TextInput
          title="Country"
          keyboardType="default"
          placeholder="United States"
          returnKeyType="next"
        />

        {/* Document Info */}
        <Text style={styles.sectionTitle}>Document Information</Text>
        <TextInput
          title="Document Type"
          keyboardType="default"
          placeholder="e.g. Passport, Driver's License"
          returnKeyType="next"
        />
        <TextInput
          title="Document Number"
          contextMenuHidden={Platform.OS === "ios"}
          keyboardType="default"
          placeholder="e.g. AB1234567"
          returnKeyType="next"
        />
        <TextInput
          title="Issuing Country"
          keyboardType="default"
          placeholder="United States"
          returnKeyType="next"
        />
        <TextInput
          title="Expiration Date"
          keyboardType="default"
          placeholder="MM / DD / YYYY"
          returnKeyType="next"
        />

        {/* Additional */}
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <TextInput
          defaultValue={ADDITIONAL_NOTES}
          title="Additional Notes"
          placeholder="Any additional information or special circumstances..."
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
