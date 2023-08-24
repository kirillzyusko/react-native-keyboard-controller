declare const _IS_FABRIC: boolean;
import React, {
  Component,
  RefObject,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { TextInput, findNodeHandle } from 'react-native';
import {
  useWorkletCallback,
  measure as measureREA,
  useSharedValue,
} from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';

type KeyboardAwareContext = {
  handlersRef: {
    current: Record<string, RefObject<Component>>;
  };
  handlers: {
    value: Record<string, RefObject<Component>>;
  };
};

const defaultValue: KeyboardAwareContext = {
  handlersRef: { current: {} },
  handlers: { value: {} },
};

const AwareScrollViewContext = React.createContext(defaultValue);

export const useAwareScrollView = () => {
  const ctx = useContext(AwareScrollViewContext);
  const headerHeight = useHeaderHeight();

  const onRef = (ref: TextInput | null) => {
    const viewTag = findNodeHandle(ref);
    if (viewTag) {
      const viewTagOrShadowNode = _IS_FABRIC
        ? // @ts-expect-error this API doesn't have any types
          ref._internalInstanceHandle.stateNode.node
        : viewTag;
      ctx.handlersRef.current = {
        ...ctx.handlersRef.current,
        [viewTag]: () => {
          'worklet';

          return viewTagOrShadowNode;
        },
      };
      ctx.handlers.value = ctx.handlersRef.current;
    }
  };

  const measure = useWorkletCallback(
    (tag: number) => {
      const ref = ctx.handlers.value[tag];

      if (ref) {
        const layout = measureREA(ref);
        if (layout) {
          return {
            ...layout,
            pageY: _IS_FABRIC ? layout.pageY + headerHeight : layout.pageY,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    [headerHeight]
  );

  return {
    onRef,
    measure,
  };
};

export const AwareScrollViewProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const handlersRef = useRef({});
  const handlers = useSharedValue({});

  const value = useMemo(
    () => ({
      handlersRef,
      handlers,
    }),
    []
  );

  return (
    <AwareScrollViewContext.Provider value={value}>
      {children}
    </AwareScrollViewContext.Provider>
  );
};
