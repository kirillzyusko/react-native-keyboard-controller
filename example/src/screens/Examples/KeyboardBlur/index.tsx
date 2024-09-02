import { BlurView } from "@react-native-community/blur";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  InputAccessoryView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

function KeyboardBlur() {
  return (
    <>
      <View style={{ flex: 1 }}>
        <TextInput
          inputAccessoryViewID="TextInput#1"
          style={{ width: "100%", height: 50, backgroundColor: "yellow" }}
        />
        <ImageBackground
          source={require("./background.jpg")}
          style={{ flex: 1, width: "100%" }}
        />
      </View>
      <InputAccessoryView
        nativeID="TextInput#1"
        style={{ height: 50, width: -1 }}
      >
        <View style={{ height: 50, width: -1 }} />
        
      </InputAccessoryView>
      <KeyboardStickyView offset={{}}>
        <View style={{ height: 50, width: "100%" }} />
        <BlurView
          blurAmount={32}
          blurType={"chromeMaterial"}
          reducedTransparencyFallbackColor="white"
          style={StyleSheet.absoluteFillObject}
        />
      </KeyboardStickyView>
    </>
  );
}

export default KeyboardBlur;
