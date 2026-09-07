import { render } from "@testing-library/react-native";
import React from "react";
import { TextInput, View } from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  KeyboardBackgroundView,
  KeyboardControllerView,
  KeyboardEffects,
  KeyboardExtender,
  KeyboardProvider,
  KeyboardStickyView,
  KeyboardToolbar,
  OverKeyboardView,
} from "react-native-keyboard-controller";

function EmptyView() {
  return <View style={{ width: 20, height: 20, backgroundColor: "black" }} />;
}

function KeyboardControllerViewTest() {
  return <KeyboardControllerView statusBarTranslucent />;
}

function KeyboardProviderTest() {
  return (
    <KeyboardProvider statusBarTranslucent>
      <EmptyView />
    </KeyboardProvider>
  );
}

const style = { marginBottom: 20 };

function KeyboardAvoidingViewTest() {
  return (
    <KeyboardAvoidingView behavior="height" style={style}>
      <EmptyView />
    </KeyboardAvoidingView>
  );
}

function KeyboardAwareScrollViewTest() {
  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      disableScrollOnKeyboardHide={false}
      enabled={true}
      style={style}
    >
      <EmptyView />
    </KeyboardAwareScrollView>
  );
}

const offset = { closed: -20, opened: -40 };

function KeyboardStickyViewTest() {
  return (
    <KeyboardStickyView offset={offset} style={style}>
      <EmptyView />
    </KeyboardStickyView>
  );
}

const content = <EmptyView />;

function KeyboardToolbarTest() {
  return <KeyboardToolbar content={content} />;
}

function KeyboardToolbarCompoundTest() {
  return (
    <>
      <KeyboardToolbar>
        <KeyboardToolbar.Background>
          <EmptyView />
        </KeyboardToolbar.Background>
        <KeyboardToolbar.Content>
          <EmptyView />
        </KeyboardToolbar.Content>
        <KeyboardToolbar.Prev />
        <KeyboardToolbar.Next />
        <KeyboardToolbar.Done />
      </KeyboardToolbar>
      <KeyboardToolbar.Group>
        <TextInput />
      </KeyboardToolbar.Group>
    </>
  );
}

function OverKeyboardViewTest() {
  return (
    <OverKeyboardView visible={true}>
      <EmptyView />
    </OverKeyboardView>
  );
}

function KeyboardBackgroundViewTest() {
  return <KeyboardBackgroundView />;
}

function KeyboardExtenderTest() {
  return <KeyboardExtender enabled={true}>{<EmptyView />}</KeyboardExtender>;
}

function KeyboardEffectsTest() {
  return <KeyboardEffects>{<EmptyView />}</KeyboardEffects>;
}

describe("components rendering", () => {
  it("should render `KeyboardControllerView`", async () => {
    expect(
      (await render(<KeyboardControllerViewTest />)).toJSON(),
    ).toMatchSnapshot();
  });

  it("should render `KeyboardProvider`", async () => {
    expect((await render(<KeyboardProviderTest />)).toJSON()).toMatchSnapshot();
  });

  it("should render `KeyboardAvoidingView`", async () => {
    expect(
      (await render(<KeyboardAvoidingViewTest />)).toJSON(),
    ).toMatchSnapshot();
  });

  it("should render `KeyboardAwareScrollView`", async () => {
    expect(
      (await render(<KeyboardAwareScrollViewTest />)).toJSON(),
    ).toMatchSnapshot();
  });

  it("should render `KeyboardStickyView`", async () => {
    expect(
      (await render(<KeyboardStickyViewTest />)).toJSON(),
    ).toMatchSnapshot();
  });

  it("should render `KeyboardToolbar`", async () => {
    expect((await render(<KeyboardToolbarTest />)).toJSON()).toMatchSnapshot();
  });

  it("should render compound `KeyboardToolbar`", async () => {
    expect(
      (await render(<KeyboardToolbarCompoundTest />)).toJSON(),
    ).toMatchSnapshot();
  });

  it("should render `OverKeyboardView`", async () => {
    expect((await render(<OverKeyboardViewTest />)).toJSON()).toMatchSnapshot();
  });

  it("should render `KeyboardBackgroundView`", async () => {
    expect(
      (await render(<KeyboardBackgroundViewTest />)).toJSON(),
    ).toMatchSnapshot();
  });

  it("should render `KeyboardExtenderTest`", async () => {
    expect((await render(<KeyboardExtenderTest />)).toJSON()).toMatchSnapshot();
  });

  it("should render `KeyboardEffectsTest`", async () => {
    expect((await render(<KeyboardEffectsTest />)).toJSON()).toMatchSnapshot();
  });
});
