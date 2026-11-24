/* global globalThis, performance */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppRegistry,
  Button,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardContext,
  KeyboardController,
  KeyboardProvider,
  useKeyboardContext,
  useKeyboardHandler,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import { runOnJS } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { name as appName } from "./app.json";
import Regression from "./issue1800.regression";
import StartBeforeSync from "./issue1800.start";

const Stack = createNativeStackNavigator();
const fill = { flex: 1 };
const trace = [];
let forwardAfterClose;

globalThis.issue1800 = { trace, leadMs: 32, busyMs: 400 };

function log(event, data) {
  const entry = { t: Math.round(performance.now()), event, ...data };

  trace.push(entry);
  console.log("[issue1800]", JSON.stringify(entry));
}

function onNativeKeyboardEnd(height, progress) {
  if (height === 0 && progress === 0) {
    forwardAfterClose?.(height, progress);
  }
}

function CloseObserver() {
  useKeyboardHandler(
    {
      onEnd: (e) => {
        "worklet";
        runOnJS(onNativeKeyboardEnd)(e.height, e.progress);
      },
    },
    [],
  );

  return null;
}

function onDelayedSync(height, progress) {
  log("geometry handler sync on UI", { height, progress });
  globalThis.issue1800.delayedSync = true;
}

function simulateSlowMount() {
  const until = performance.now() + globalThis.issue1800.busyMs;

  while (performance.now() < until) {
    // Simulate synchronous work in an expensive commit while the IME animates.
  }
}

function ScreenA({ navigation }) {
  const input = useRef(null);
  const { height, progress } = useReanimatedKeyboardAnimation();

  function push(slow) {
    log("push pressed", {
      slow,
      height: height.value,
      progress: progress.value,
    });

    if (slow && Platform.OS !== "ios") {
      input.current.blur();
      setTimeout(
        () => navigation.push("Screen B", { slow }),
        globalThis.issue1800.leadMs,
      );
    } else {
      navigation.push("Screen B", { slow });
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 16 }}>
      <TextInput
        ref={input}
        placeholder="Focus to open keyboard"
        style={{ borderWidth: 1, borderRadius: 6, padding: 12 }}
        testID="issue1800-input"
      />
      <Button
        testID="issue1800-push"
        title="Push screen B"
        onPress={() => push(false)}
      />
      <Button
        testID="issue1800-slow"
        title="Push with slow mount"
        onPress={() => push(true)}
      />
      <Button
        testID="issue1800-delay"
        title="Delay keyboard handler"
        onPress={() => {
          globalThis.issue1800.delayedSync = false;
          log("delayed push pressed", {
            height: height.value,
            progress: progress.value,
          });
          navigation.push("Screen B", { delayed: true });
        }}
      />
      <Button
        testID="issue1800-regression"
        title="Test autofocus and Suspense"
        onPress={() => navigation.push("Regression")}
      />
      {Platform.OS === "android" && (
        <Button
          testID="issue1800-start"
          title="Test onStart before snapshot"
          onPress={() => navigation.push("Start before sync")}
        />
      )}
    </View>
  );
}

function DelayedRegistration({ children }) {
  const context = useKeyboardContext();
  const delayed = useMemo(() => {
    let registration = 0;
    const { height, progress } = context.reanimated;
    const read = () => ({
      height: context.reanimated.height.value,
      progress: context.reanimated.progress.value,
    });

    return {
      ...context,
      setKeyboardHandlers(...args) {
        registration += 1;
        log("KAV requested registration", { registration, ...read() });

        // KAV registers translate-with-padding first and its geometry handler second.
        if (registration === 2) {
          if (Platform.OS === "android") {
            const [handler, sync] = args;
            let unsubscribe;
            const forward = (nativeHeight, nativeProgress) => {
              // eslint-disable-next-line react-compiler/react-compiler -- The native end callback releases this test registration.
              forwardAfterClose = undefined;
              log("native onEnd before geometry registration", {
                nativeHeight,
                nativeProgress,
                ...read(),
              });
              log("KAV registration forwarded", { registration, ...read() });

              if (sync) {
                unsubscribe = context.setKeyboardHandlers(handler, () => {
                  "worklet";
                  sync();
                  runOnJS(onDelayedSync)(height.value, progress.value);
                });
              } else {
                unsubscribe = context.setKeyboardHandlers(handler);
                globalThis.issue1800.delayedSync = true;
              }
            };

            forwardAfterClose = forward;
            void KeyboardController.dismiss();

            return () => {
              if (forwardAfterClose === forward) {
                forwardAfterClose = undefined;
              }
              unsubscribe?.();
            };
          }
          void KeyboardController.dismiss();
          simulateSlowMount();
        }
        log("KAV registration forwarded", { registration, ...read() });

        return context.setKeyboardHandlers(...args);
      },
    };
  }, [context]);

  return (
    <KeyboardContext.Provider value={delayed}>
      {children}
    </KeyboardContext.Provider>
  );
}

function ScreenB({ navigation, route }) {
  const { height, progress } = useReanimatedKeyboardAnimation();
  const outer = useRef(null);
  const content = useRef(null);
  const [result, setResult] = useState(null);
  const slow = route.params.slow;
  const delayed = route.params.delayed;
  const Registration = delayed ? DelayedRegistration : React.Fragment;

  useLayoutEffect(() => {
    log("B layout effects", { height: height.value, progress: progress.value });

    if (delayed) {
      void KeyboardController.dismiss();
    }
    if (slow) {
      if (Platform.OS === "ios") {
        void KeyboardController.dismiss();
      }
      // Reproduce an expensive screen commit. The native keyboard keeps animating.
      simulateSlowMount();
      log("B layout effects finished", {
        height: height.value,
        progress: progress.value,
      });
    }
  }, [delayed, height, progress, slow]);

  useEffect(() => {
    const deadline = performance.now() + 8000;
    let timer;

    function measure() {
      outer.current?.measure((_x, _y, _w, outerHeight) => {
        content.current?.measure((_cx, _cy, _cw, contentHeight) => {
          const sample = {
            outer: outerHeight,
            content: contentHeight,
            gap: outerHeight - contentHeight,
            height: height.value,
            progress: progress.value,
          };

          sample.verdict = sample.gap === 0 ? "PASS" : "FAIL";
          log("settled", sample);
          setResult(sample);
        });
      });
    }

    function waitForClosed() {
      const subscribed =
        !delayed ||
        Platform.OS !== "android" ||
        globalThis.issue1800.delayedSync;

      if (subscribed && height.value === 0 && progress.value === 0) {
        // Give Fabric time to commit the last frame before measuring the views.
        timer = setTimeout(measure, 100);
      } else if (performance.now() < deadline) {
        timer = setTimeout(waitForClosed, 100);
      } else {
        const sample = {
          verdict: "TIMEOUT",
          progress: progress.value,
          height: height.value,
        };

        log("keyboard close timeout", sample);
        setResult(sample);
      }
    }
    timer = setTimeout(waitForClosed, 1100);

    return () => clearTimeout(timer);
  }, [delayed, height, progress]);

  let resultText = "Measuring layout…";

  if (result?.verdict === "TIMEOUT") {
    resultText = "Timed out waiting for the keyboard to close.";
  } else if (result) {
    resultText = `Provider progress ${result.progress}, height ${result.height}. Bottom gap ${result.gap}.`;
  }

  return (
    <View
      ref={outer}
      collapsable={false}
      style={{ flex: 1, backgroundColor: "#ffe5c2" }}
    >
      <Registration>
        <KeyboardAvoidingView behavior="padding" style={fill}>
          <View
            ref={content}
            collapsable={false}
            style={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "#dff4ed",
              padding: 16,
            }}
          >
            <View>
              <Text testID="issue1800-result">{resultText}</Text>
              {result && (
                <>
                  <Text testID="issue1800-settled">Measurement complete</Text>
                  <Text testID="issue1800-verdict">{result.verdict}</Text>
                </>
              )}
              <Button
                testID="issue1800-back"
                title="Return to screen A"
                onPress={() => navigation.goBack()}
              />
            </View>
            <Text>Bottom of screen B content</Text>
          </View>
        </KeyboardAvoidingView>
      </Registration>
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        {Platform.OS === "android" && <CloseObserver />}
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen component={ScreenA} name="Screen A" />
            <Stack.Screen component={ScreenB} name="Screen B" />
            <Stack.Screen component={Regression} name="Regression" />
            <Stack.Screen
              component={StartBeforeSync}
              name="Start before sync"
            />
          </Stack.Navigator>
        </NavigationContainer>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
