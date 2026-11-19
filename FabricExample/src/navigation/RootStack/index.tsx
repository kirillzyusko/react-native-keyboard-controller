import React from "react";

import { ScreenNames } from "../../constants/screenNames";
import ExampleMain from "../../screens/Examples/Main";
import ExamplesStack, { type ExamplesStackParamList } from "../ExamplesStack";
import { Stack } from "../Stack";

export type RootStackParamList = {
  [ScreenNames.EXAMPLES]: undefined;
} & ExamplesStackParamList;

const options = {
  [ScreenNames.EXAMPLES]: { title: "Examples" },
};

const RootStack = () => (
  <Stack.Navigator initialRouteName={ScreenNames.EXAMPLES}>
    <Stack.Screen
      component={ExampleMain}
      name={ScreenNames.EXAMPLES}
      options={options[ScreenNames.EXAMPLES]}
    />
    {ExamplesStack}
  </Stack.Navigator>
);

export default RootStack;
