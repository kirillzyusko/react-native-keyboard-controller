import React, { useContext, useMemo } from 'react';
import Reanimated, {
  useEvent,
  useSharedValue,
  useHandler,
  SharedValue,
} from 'react-native-reanimated';
import {
  KeyboardControllerProps,
  KeyboardControllerView,
  NativeEvent,
  useResizeMode,
} from './native';
import { styles } from './styles';

const KeyboardControllerViewReanimated = Reanimated.createAnimatedComponent(
  KeyboardControllerView as unknown as React.ComponentClass
) as unknown as React.FC<KeyboardControllerProps>;

type Context = {
  progress: SharedValue<number>;
  height: SharedValue<number>;
};

const ReanimatedKeyboardContext = React.createContext<Context | undefined>(
  undefined
);

type EventWithName<T> = {
  eventName: string;
} & T;

function useAnimatedKeyboardHandler<TContext extends Record<string, unknown>>(
  handlers: {
    onKeyboardMove?: (e: NativeEvent, context: TContext) => void;
  },
  dependencies?: ReadonlyArray<unknown>
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

  return useEvent(
    (event: EventWithName<NativeEvent>) => {
      'worklet';
      const { onKeyboardMove } = handlers;

      if (onKeyboardMove && event.eventName.endsWith('onKeyboardMove')) {
        onKeyboardMove(event, context);
      }
    },
    ['onKeyboardMove'],
    doDependenciesDiffer
  );
}
export const KeyboardReanimatedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  const context = useMemo(() => ({ progress, height }), []);

  const handler = useAnimatedKeyboardHandler(
    {
      onKeyboardMove: (event: NativeEvent) => {
        'worklet';
        progress.value = event.progress;
        height.value = event.height;
      },
    },
    []
  );

  return (
    <ReanimatedKeyboardContext.Provider value={context}>
      <KeyboardControllerViewReanimated
        onKeyboardMove={handler}
        style={styles.container}
      >
        {children}
      </KeyboardControllerViewReanimated>
    </ReanimatedKeyboardContext.Provider>
  );
};

export const useReanimatedKeyboardAnimation = () => {
  useResizeMode();
  const context = useContext(ReanimatedKeyboardContext) as Context;

  return context;
};
