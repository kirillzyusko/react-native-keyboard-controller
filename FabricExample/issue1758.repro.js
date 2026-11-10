import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppRegistry,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardProvider,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { name as appName } from "./app.json";

const messages = Array.from({ length: 30 }, (_, id) => ({ id }));
const trace = [];

global.issue1758Trace = trace;

function Chat() {
  const { bottom } = useSafeAreaInsets();
  const input = useRef(null);
  const padding = useSharedValue(64);
  const [commits, setCommits] = useState(0);
  const [result, setResult] = useState({ label: "No callback", count: 0 });

  // Keep publishing JS changes to the existing ScrollView while pressing rows.
  useEffect(() => {
    const timer = setInterval(() => setCommits((value) => value + 1), 40);

    return () => clearInterval(timer);
  }, []);

  const report = useCallback((label, id) => {
    trace.push({ time: Date.now(), event: label, id });
    setResult((value) => ({
      label: `${label} ${id}`,
      count: value.count + 1,
    }));
  }, []);
  const renderScrollComponent = useCallback(
    (props) => (
      <KeyboardChatScrollView
        {...props}
        inverted
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        extraContentPadding={padding}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        offset={bottom}
        testID="issue1758-scroll"
      />
    ),
    [bottom, padding],
  );

  return (
    <View style={[styles.root, { marginBottom: bottom }]}>
      <Text style={styles.title} testID="issue1758-commits">
        #1758 / JS updates: {commits}
      </Text>
      <Text style={styles.result} testID="issue1758-result">
        {result.label} / callbacks {result.count}
      </Text>
      <Button
        testID="issue1758-focus"
        title="Open keyboard"
        onPress={() => input.current?.focus()}
      />
      <FlatList
        inverted
        data={messages}
        extraData={commits}
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            accessibilityLabel={`Message ${item.id}`}
            delayLongPress={350}
            style={styles.message}
            testID={`issue1758-message-${item.id}`}
            onLongPress={() => report("LONG PRESS", item.id)}
            onPress={() => report("PRESS", item.id)}
          >
            <Text style={styles.messageText}>Message {item.id}</Text>
            <Text style={styles.messageText}>
              Hold, then move just 2 pixels.
            </Text>
            <Text
              style={styles.link}
              testID={`issue1758-link-${item.id}`}
              onPress={() => report("LINK", item.id)}
            >
              Read more
            </Text>
          </Pressable>
        )}
        renderScrollComponent={renderScrollComponent}
        style={[styles.list, { opacity: commits % 2 ? 1 : 0.999 }]}
      />
      <KeyboardStickyView offset={{ opened: bottom }} style={styles.composer}>
        <TextInput
          ref={input}
          accessibilityLabel="Message composer"
          placeholder="Message"
          style={styles.input}
          testID="issue1758-input"
        />
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 30, backgroundColor: "white" },
  title: { paddingHorizontal: 12, fontSize: 20, color: "#14213d" },
  result: { padding: 12, fontSize: 14, color: "#14213d" },
  list: { flex: 1 },
  message: {
    height: 112,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#dae9fc",
  },
  messageText: { fontSize: 16, color: "#14213d" },
  link: { paddingTop: 10, color: "#174faa" },
  composer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    padding: 8,
    backgroundColor: "white",
  },
  input: { padding: 10, borderWidth: 1, borderRadius: 8, color: "#14213d" },
});

function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <Chat />
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
