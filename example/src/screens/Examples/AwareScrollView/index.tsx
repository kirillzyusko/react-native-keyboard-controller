import React, { useEffect } from 'react';
import { TextInput, View, Dimensions } from 'react-native';
import { KeyboardEvents } from 'react-native-keyboard-controller';
import Reanimated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

function randomColor() {
  return '#' + Math.random().toString(16).slice(-6);
}

const screenHeight = Dimensions.get('window').height;

export default function BottomTabs() {
  const aref = useAnimatedRef<Reanimated.ScrollView>();
  const scrollPosition = useSharedValue(0);
  const click = useSharedValue(0);
  const position = useSharedValue(0);
  const fakeViewHeight = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      position.value = e.contentOffset.y;
    },
  });

  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      fakeViewHeight.value = e.height;
    });
    const hide = KeyboardEvents.addListener('keyboardWillHide', () => {
      fakeViewHeight.value = 0;
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const view = useAnimatedStyle(() => ({
    height: fakeViewHeight.value,
    width: '100%',
  }));

  return (
    <View
      style={{ flex: 1 }}
      onTouchStart={(e) => {
        click.value = e.nativeEvent.pageY;
        scrollPosition.value = position.value;

        console.log('touchMove', e.nativeEvent.pageY);
      }}
    >
      <Reanimated.ScrollView
        ref={aref}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {new Array(10).fill(0).map((_, i) => (
          <TextInput
            key={i}
            placeholder={`${i}`}
            placeholderTextColor="black"
            style={{
              width: '100%',
              height: 50,
              backgroundColor: randomColor(),
              marginTop: 50,
            }}
          />
        ))}
        <Reanimated.View
          onLayout={(e) => {
            if (e.nativeEvent.layout.height !== 0) {
              const visibleRect = screenHeight - fakeViewHeight.value;

              if (click.value > visibleRect) {
                const target = click.value - visibleRect;

                aref.current?.scrollTo({
                  x: 0,
                  y: target + scrollPosition.value + 50,
                  animated: true,
                });
              }
            }
          }}
          style={view}
        />
      </Reanimated.ScrollView>
    </View>
  );
}
