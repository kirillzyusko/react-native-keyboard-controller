import { type LegendListRef, typedForwardRef } from "@legendapp/list";
import {
  AnimatedLegendList,
  type AnimatedLegendListProps,
} from "@legendapp/list/reanimated";
import * as React from "react";
import { type ForwardedRef, useCallback, useEffect, useRef } from "react";
import {
  KeyboardChatScrollView,
  type KeyboardChatScrollViewProps,
} from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

import { useCombinedRef } from "./useCombinedRef";

import type { ScrollViewProps } from "react-native";

type KeyboardChatScrollViewPropsUnique = Omit<
  KeyboardChatScrollViewProps,
  keyof ScrollViewProps | "inverted" | "ScrollViewComponent"
>;

type KeyboardChatLegendListProps<ItemT> = Omit<
  AnimatedLegendListProps<ItemT>,
  "renderScrollComponent"
> &
  KeyboardChatScrollViewPropsUnique & {
    anchorToTopIndex?: number;
  };

export const KeyboardChatLegendList = typedForwardRef(
  function KeyboardChatLegendList<ItemT>(
    props: KeyboardChatLegendListProps<ItemT>,
    forwardedRef: ForwardedRef<LegendListRef>,
  ) {
    const {
      anchorToTopIndex,
      onItemSizeChanged: onItemSizeChangedProp,
      onMetricsChange: onMetricsChangeProp,
      extraContentPadding,
      ...rest
    } = props;

    const refLegendList = useRef<LegendListRef | null>(null);
    const combinedRef = useCombinedRef(forwardedRef, refLegendList);

    const blankSpace = useSharedValue<number>(0);

    const calculateTopItemInset = useCallback(() => {
      if (anchorToTopIndex === undefined || anchorToTopIndex < 0) {
        blankSpace.value = 0;
        refLegendList.current?.reportContentInset(null);

        return;
      }

      const state = refLegendList.current?.getState();

      if (
        !state ||
        anchorToTopIndex >= state.data.length ||
        state.scrollLength <= 0
      ) {
        return;
      }

      let contentBelowTopItem = 0;

      for (let i = anchorToTopIndex; i < state.data.length; i++) {
        const size = state.sizeAtIndex(i);

        if (size !== null && size > 0) {
          contentBelowTopItem += size;
        }
      }

      const calculatedInset = Math.max(
        0,
        state.scrollLength - contentBelowTopItem,
      );

      blankSpace.value = calculatedInset;
      refLegendList.current?.reportContentInset({ bottom: calculatedInset });
    }, [anchorToTopIndex]);

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
        if (anchorToTopIndex !== undefined && info.index >= anchorToTopIndex) {
          calculateTopItemInset();
        }
        onItemSizeChangedProp?.(info);
      },
      [anchorToTopIndex, calculateTopItemInset, onItemSizeChangedProp],
    );

    useEffect(() => {
      calculateTopItemInset();
    }, [anchorToTopIndex, calculateTopItemInset]);

    const memoList = useCallback(
      (scrollProps: ScrollViewProps) => {
        return (
          <KeyboardChatScrollView
            {...scrollProps}
            applyWorkaroundForContentInsetHitTestBug
            blankSpace={blankSpace}
            extraContentPadding={extraContentPadding}
          />
        );
      },
      [blankSpace, extraContentPadding],
    );

    return (
      <AnimatedLegendList
        ref={combinedRef}
        renderScrollComponent={memoList}
        onItemSizeChanged={handleItemSizeChange}
        onMetricsChange={handleMetricsChange}
        {...rest}
      />
    );
  },
);
