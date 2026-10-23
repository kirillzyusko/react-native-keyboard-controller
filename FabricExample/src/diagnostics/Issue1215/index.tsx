// Reproduction of https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1215.
// Screen content/styles follow rhinck/keyboard-example, blob d5e87ab.
import { useHeaderHeight } from "@react-navigation/elements";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AppRegistry,
  Keyboard,
  Platform,
  Pressable,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardProvider,
} from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Params = {
  Home: undefined;
  Feedback: { implementation: "package" | "rn"; autoFocus: boolean };
};
const Stack = createNativeStackNavigator<Params>();
const BackdropContext = createContext(false);
const trace: { at: number; event: string; data: unknown }[] = [];

Object.assign(globalThis, { issue1215Trace: trace });
let started = Date.now();

function record(event: string, data: unknown = null) {
  const entry = { at: Date.now() - started, event, data };

  trace.push(entry);

  if (event !== "form-frame") {
    console.log("[issue1215]", JSON.stringify(entry));
  }
}

function Feedback({ route }: NativeStackScreenProps<Params, "Feedback">) {
  const withBackdrop = useContext(BackdropContext);
  const [feedback, setFeedback] = useState("");
  const headerHeight = useHeaderHeight();
  const form = useRef<React.ComponentRef<typeof View>>(null);
  const Container =
    route.params.implementation === "rn"
      ? RNKeyboardAvoidingView
      : KeyboardAvoidingView;

  useEffect(() => record("header-height", headerHeight), [headerHeight]);

  useEffect(() => {
    record("feedback-mount", { headerHeight, ...route.params });
    let frame = 0;
    let previousY = -1;
    const until = Date.now() + 2000;
    const sample = () => {
      form.current?.measureInWindow((x, y, width, height) => {
        if (Math.abs(y - previousY) > 0.5) {
          record("form-frame", { x, y, width, height });
          previousY = y;
        }
      });

      if (Date.now() < until) {
        frame = requestAnimationFrame(sample);
      }
    };

    frame = requestAnimationFrame(sample);

    return () => {
      cancelAnimationFrame(frame);
      record("feedback-unmount");
    };
  }, []);

  return (
    <Pressable
      accessible={false}
      style={styles.screen}
      onPress={Keyboard.dismiss}
    >
      {withBackdrop && (
        <View pointerEvents="none" style={styles.keyboardBackdrop}>
          <LottieView
            autoPlay
            loop
            resizeMode="cover"
            source={require("./keyboard-backdrop.json")}
            style={styles.lottie}
            testID="keyboard-backdrop-lottie"
          />
        </View>
      )}
      <Container
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
        style={[styles.screen, withBackdrop && styles.transparent]}
        testID="issue1215.kav"
        onLayout={(event) => record("kav-layout", event.nativeEvent.layout)}
      >
        <View style={styles.content}>
          <View>
            <Text style={styles.title}>
              Help us shape upcoming features—what would make your experience
              better?
            </Text>
            <Text style={styles.subtitle}>
              Tell us the idea so we can prioritize it for future releases.
            </Text>
          </View>
          <View ref={form} collapsable={false} style={styles.form}>
            <TextInput
              multiline
              autoFocus={route.params.autoFocus}
              placeholder="Your feedback..."
              placeholderTextColor="#A3A3A3"
              style={styles.input}
              testID="issue1215.input"
              textAlignVertical="top"
              value={feedback}
              onChangeText={setFeedback}
              onFocus={() => record("input-focus")}
            />
            <Pressable
              style={styles.submitButton}
              testID="issue1215.submit"
              onPress={Keyboard.dismiss}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Container>
    </Pressable>
  );
}

function Home({ navigation }: NativeStackScreenProps<Params, "Home">) {
  return (
    <View style={styles.home}>
      <Text style={styles.title} testID="issue1215.home">
        Issue 1215: native stack + autofocus
      </Text>
      {(["package", "rn"] as const).map((implementation) => (
        <Pressable
          key={implementation}
          style={styles.submitButton}
          testID={`issue1215.push.${implementation}`}
          onPress={() => {
            started = Date.now();
            trace.length = 0;
            record("push", { implementation });
            navigation.push("Feedback", { implementation, autoFocus: true });
          }}
        >
          <Text style={styles.submitButtonText}>
            Push {implementation} KAV + autofocus
          </Text>
        </Pressable>
      ))}
      <Pressable
        style={styles.submitButton}
        testID="issue1215.manual"
        onPress={() => {
          started = Date.now();
          trace.length = 0;
          record("push-manual");
          navigation.push("Feedback", {
            implementation: "package",
            autoFocus: false,
          });
        }}
      >
        <Text style={styles.submitButtonText}>
          Push package KAV + manual focus
        </Text>
      </Pressable>
      <Pressable
        style={styles.submitButton}
        testID="issue1215.root"
        onPress={() => {
          started = Date.now();
          trace.length = 0;
          record("root");
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Feedback",
                params: { implementation: "package", autoFocus: true },
              },
            ],
          });
        }}
      >
        <Text style={styles.submitButtonText}>Package KAV as root</Text>
      </Pressable>
    </View>
  );
}

export default function Issue1215({
  withBackdrop = false,
}: {
  withBackdrop?: boolean;
}) {
  useEffect(() => {
    const subscriptions = (
      [
        "keyboardWillShow",
        "keyboardDidShow",
        "keyboardWillHide",
        "keyboardDidHide",
        "keyboardWillChangeFrame",
        "keyboardDidChangeFrame",
      ] as const
    ).map((event) =>
      Keyboard.addListener(event, (data) => record(event, data)),
    );

    record("runtime", {
      version: Platform.Version,
      fabric: "nativeFabricUIManager" in globalThis,
      components: AppRegistry.getAppKeys(),
    });

    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

  return (
    <BackdropContext.Provider value={withBackdrop}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenListeners={{
                transitionStart: (event) =>
                  record("transitionStart", event.data),
                transitionEnd: (event) => record("transitionEnd", event.data),
              }}
            >
              <Stack.Screen component={Home} name="Home" />
              <Stack.Screen component={Feedback} name="Feedback" />
            </Stack.Navigator>
          </NavigationContainer>
        </KeyboardProvider>
      </SafeAreaProvider>
    </BackdropContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  transparent: { backgroundColor: "transparent" },
  keyboardBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 360,
  },
  lottie: { width: "100%", height: 360 },
  home: { flex: 1, padding: 24, justifyContent: "center", gap: 16 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: "600", color: "#111827", lineHeight: 28 },
  subtitle: { marginTop: 8, fontSize: 14, color: "#6B7280" },
  form: { gap: 16 },
  input: {
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: { fontSize: 18, color: "#FFFFFF", fontWeight: "600" },
});
