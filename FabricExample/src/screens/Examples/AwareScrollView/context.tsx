import React, { useContext, useMemo, useRef } from 'react';
import { findNodeHandle } from 'react-native';
import {
  useWorkletCallback,
  measure as measureREA,
  useSharedValue,
} from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';

const defaultValue = {
  handlersRef: { current: {} },
  handlers: { value: {} },
};

const AwareScrollViewContext = React.createContext(defaultValue);

export const useAwareScrollView = () => {
  const ctx = useContext(AwareScrollViewContext);
  const headerHeight = useHeaderHeight();

  const onRef = (ref: React.Component) => {
    const viewTag = findNodeHandle(ref);
    if (viewTag) {
      const viewTagOrShadowNode = global._IS_FABRIC
        ? ref._internalInstanceHandle.stateNode.node
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
        return {
          ...layout,
          pageY: _IS_FABRIC ? layout?.pageY + headerHeight : layout?.pageY,
        };
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

export const AwareScrollViewProvider = ({ children }) => {
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
