import * as React from "react";
import { type ForwardedRef, useCallback, useEffect, useRef } from "react";
import { type ScrollViewProps } from "react-native";
import {
  KeyboardChatScrollView,
  type KeyboardChatScrollViewProps,
} from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

import {
  type LegendListRef,
  typedForwardRef,
} from "@legendapp/list/react-native";
import {
  AnimatedLegendList,
  type AnimatedLegendListProps,
} from "@legendapp/list/reanimated";

import { useCombinedRef } from "./useCombinedRef";

type KeyboardChatScrollViewPropsUnique = Omit<
  KeyboardChatScrollViewProps,
  keyof ScrollViewProps | "inverted" | "ScrollViewComponent"
>;

type KeyboardChatLegendListProps<ItemT> = Omit<
  AnimatedLegendListProps<ItemT>,
  "renderScrollComponent"
> &
  KeyboardChatScrollViewPropsUnique & {
    extraContentPaddingIndex?: number;
  };

export const KeyboardChatLegendList = typedForwardRef(
  function KeyboardChatLegendList<ItemT>(
    props: KeyboardChatLegendListProps<ItemT>,
    forwardedRef: ForwardedRef<LegendListRef>,
  ) {
    const {
      freeze: freezeProp,
      extraContentPaddingIndex,
      onItemSizeChanged: onItemSizeChangedProp,
      onMetricsChange: onMetricsChangeProp,
      ...rest
    } = props;

    const refLegendList = useRef<LegendListRef | null>(null);
    const combinedRef = useCombinedRef(forwardedRef, refLegendList);

    const extraContentPadding = useSharedValue<number>(0);

    const calculateTopItemInset = useCallback(() => {
      if (
        extraContentPaddingIndex === undefined ||
        extraContentPaddingIndex < 0
      ) {
        extraContentPadding.value = 0;
        refLegendList.current?.reportContentInset(null);
        return;
      }

      const state = refLegendList.current?.getState();
      if (
        !state ||
        extraContentPaddingIndex >= state.data.length ||
        state.scrollLength <= 0
      ) {
        return;
      }

      let contentBelowTopItem = 0;
      for (let i = extraContentPaddingIndex; i < state.data.length; i++) {
        const size = state.sizeAtIndex(i);
        if (size != null && size > 0) {
          contentBelowTopItem += size;
        }
      }

      const calculatedInset = Math.max(
        0,
        state.scrollLength - contentBelowTopItem,
      );

      extraContentPadding.value = calculatedInset;
      refLegendList.current?.reportContentInset({ bottom: calculatedInset });
    }, [extraContentPaddingIndex]);

    const handleMetricsChange = useCallback(
      (
        metrics: Parameters<
          NonNullable<AnimatedLegendListProps<ItemT>["onMetricsChange"]>
        >[0],
      ) => {
        calculateTopItemInset();
        onMetricsChangeProp?.(metrics);
      },
      [calculateTopItemInset, onMetricsChangeProp],
    );

    const handleItemSizeChange = useCallback(
      (info: {
        size: number;
        previous: number;
        index: number;
        itemKey: string;
        itemData: ItemT;
      }) => {
        if (
          extraContentPaddingIndex !== undefined &&
          info.index >= extraContentPaddingIndex
        ) {
          calculateTopItemInset();
        }
        onItemSizeChangedProp?.(info);
      },
      [extraContentPaddingIndex, calculateTopItemInset, onItemSizeChangedProp],
    );

    useEffect(() => {
      calculateTopItemInset();
    }, [extraContentPaddingIndex, calculateTopItemInset]);

    const memoList = useCallback(
      (scrollProps: ScrollViewProps) => {
        return (
          <KeyboardChatScrollView
            {...scrollProps}
            extraContentPadding={extraContentPadding}
          />
        );
      },
      [extraContentPadding],
    );

    return (
      <AnimatedLegendList
        onItemSizeChanged={handleItemSizeChange}
        onMetricsChange={handleMetricsChange}
        ref={combinedRef}
        renderScrollComponent={memoList}
        {...rest}
      />
    );
  },
);
