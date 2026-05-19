import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import type { TextInputProps } from "react-native";

type Behavior = "padding" | "height" | "position";
const behaviors: Behavior[] = ["padding", "height", "position"];

function TextInput(props: TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <RNTextInput
      {...props}
      style={[styles.textInput, focused && styles.textInputFocused]}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
    />
  );
}

function KAVContent({
  behavior,
  keyboardVerticalOffset,
  automaticOffset,
}: {
  behavior: Behavior;
  keyboardVerticalOffset: number;
  automaticOffset: boolean;
}) {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <KeyboardAvoidingView
      automaticOffset={automaticOffset}
      behavior={behavior}
      contentContainerStyle={
        behavior === "position" ? styles.container : undefined
      }
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.content}
    >
      <View style={styles.inner}>
        <View style={styles.headerSection}>
          <Text style={styles.heading}>Sign in to your{"\n"}Account</Text>
          <Text style={styles.subtitle}>
            Enter your email and password to log in
          </Text>
        </View>
        <View style={styles.formSection}>
          <View style={styles.inputs}>
            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="name@example.com"
                placeholderTextColor="#C4C4C7"
              />
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                secureTextEntry
                autoCapitalize="none"
                placeholder="Enter your password"
                placeholderTextColor="#C4C4C7"
              />
            </View>

            {/* Remember me + Forgot */}
            <View style={styles.forgotRow}>
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function KeyboardAvoidingViewAutomaticExample() {
  const [behavior, setBehavior] = useState<Behavior>(behaviors[0]);
  const [automaticOffset, setAutomaticOffset] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const offsets = [0, 50, 100];

  return (
    <>
      <View style={styles.settings}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            const index = behaviors.indexOf(behavior);

            setBehavior(
              behaviors[index === behaviors.length - 1 ? 0 : index + 1],
            );
          }}
        >
          <Text style={styles.settingsText}>{behavior}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            const index = offsets.indexOf(offset);

            setOffset(offsets[index === offsets.length - 1 ? 0 : index + 1]);
          }}
        >
          <Text style={styles.settingsText}>+{offset}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setAutomaticOffset((v) => !v)}
        >
          <Text style={styles.settingsText}>
            {automaticOffset ? "Auto" : "Manual"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.settingsText}>Modal</Text>
        </TouchableOpacity>
      </View>
      <KAVContent
        automaticOffset={automaticOffset}
        behavior={behavior}
        keyboardVerticalOffset={offset}
      />
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            Modal ({automaticOffset ? "Auto" : "Manual"})
          </Text>
        </View>
        <KAVContent
          automaticOffset={automaticOffset}
          behavior={behavior}
          keyboardVerticalOffset={offset}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  inner: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 28,
    paddingHorizontal: 28,
    paddingBottom: 4,
  },
  heading: {
    color: "#1A1A2E",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 0.2,
    lineHeight: 40,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "400",
    marginTop: 10,
    lineHeight: 21,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  inputs: {},
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    marginLeft: 2,
  },
  textInput: {
    height: 52,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1A1A2E",
  },
  textInputFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  forgotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  rememberText: {
    fontSize: 14,
    color: "#6B7280",
  },
  forgotText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    marginHorizontal: 28,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    marginHorizontal: 28,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 28,
    gap: 10,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  googleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 28,
    paddingTop: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  settings: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F2F2F7",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  settingsButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  settingsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
    color: "#1A1A2E",
  },
});
