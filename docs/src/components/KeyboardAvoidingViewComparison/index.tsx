import React, { CSSProperties } from 'react';
import Lottie from 'lottie-react';

import before from './kav.lottie.json';
import after from './kav-animated.lottie.json';

const withoutBorders = { border: 'none' };
const lottieView = { paddingLeft: '20%', paddingRight: '20%' };
const label: CSSProperties = {
  ...withoutBorders,
  maxWidth: 400,
  textAlign: 'center',
};
const labels = {
  ...withoutBorders,
  backgroundColor: '#00000000',
};

export default function KeyboardAvoidingViewComparison(): JSX.Element {
  return (
    <table>
      <tbody>
        <tr style={withoutBorders}>
          <td style={withoutBorders}>
            <Lottie animationData={before} style={lottieView} loop />
          </td>
          <td style={withoutBorders}>
            <Lottie animationData={after} style={lottieView} loop />
          </td>
        </tr>
        <tr style={labels}>
          <td style={label}>
            <i>
              Default <code>react-native</code> implementation on Android
            </i>
          </td>
          <td style={label}>
            <i>
              Implementation from <code>react-native-keyboard-controller</code>{' '}
              with better animations
            </i>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
