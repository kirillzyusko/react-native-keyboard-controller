import { Modal, Platform, View } from "react-native";

import { RCTOverKeyboardView } from "../../bindings";

const OverKeyboardView = ({ children, visible }) => {
  return (
    <RCTOverKeyboardView visible={visible}>
      {/* Temporary solution - OKV should always have an empty view as a first children */}
      <View>{children}</View>
    </RCTOverKeyboardView>
  );

  /*return (
    <Modal animationType="none" transparent visible={visible}>
      {children}
    </Modal>
  );*/
};

export default OverKeyboardView;
