import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { NativeEventEmitter, Platform } from 'react-native';

import type {
  KeyboardControllerModule,
  KeyboardControllerProps,
  KeyboardEventsModule,
  KeyboardGestureAreaProps,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-keyboard-controller' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RCTKeyboardController =
  require('./specs/NativeKeyboardController').default;
export const KeyboardController = (
  RCTKeyboardController
    ? RCTKeyboardController
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        }
      )
) as KeyboardControllerModule;

const eventEmitter = new NativeEventEmitter(KeyboardController);

export const KeyboardEvents: KeyboardEventsModule = {
  addListener: (name, cb) =>
    eventEmitter.addListener('KeyboardController::' + name, cb),
};
const a = require('./specs/KeyboardControllerViewNativeComponent');
export const KeyboardControllerView: React.FC<KeyboardControllerProps> =
  a.default;
export const KeyboardGestureArea: React.FC<KeyboardGestureAreaProps> =
  Platform.OS === 'android' && Platform.Version >= 30
    ? require('./specs/KeyboardGestureAreaNativeComponent').default
    : ({ children }: KeyboardGestureAreaProps) => children;
export const KeyboardControllerViewCommands = a.Commands;

/*export function MyComponent(props) {
  const ref = useRef();

  const _captureRef = (_ref) => {
    ref.current = _ref;
  };

  useEffect(() => {
    KeyboardControllerViewCommands.syncUpFocusedInput(ref.current);
  }, []);

  return <KeyboardControllerView ref={_captureRef} {...props} />;
}*/

/*export class MyComponent extends React.Component<Props> {
  private _ref;

  private _captureRef = (ref) => {
    this._ref = ref;
  };

  componentDidMount() {
    this._moveToRegion();
  }

  _moveToRegion = () => {
    if (this._ref != null) {
      KeyboardControllerViewCommands.syncUpFocusedInput(this._ref);
    }
  };

  render() {
    return <KeyboardControllerView ref={this._captureRef} {...this.props} />;
  }
}*/

/*export const KeyboardControllerView = React.forwardRef(
  function KeyboardControllerView(props, ref) {
    useImperativeHandle(
      ref,
      () => {
        return {
          syncUpFocusedInput: () => {},
        };
      },
      []
    );

    return <RCTKeyboardControllerView {...props} />;
  }
);*/
