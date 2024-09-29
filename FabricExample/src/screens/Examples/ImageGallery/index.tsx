import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { OverKeyboardView } from "react-native-keyboard-controller";
import Reanimated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const images = [
  [
    "https://images.unsplash.com/photo-1558980664-2cd663cf8dde?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1481575184241-4754ea78a1bf?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  [
    "https://images.unsplash.com/photo-1558980664-2506fca6bfc2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1485908518669-ad17eac8cb57?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  [
    "https://images.unsplash.com/photo-1535049979531-a3c737b8caba?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=3312&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1558980664-28d10ee9bb52?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
];
const IMAGES_PER_ROW = 3;
const INITIAL_SCALE = 1 / IMAGES_PER_ROW;
const ANIMATION_DURATION = 350;
const SPRING_CONFIG = {
  duration: ANIMATION_DURATION,
  easing: Easing.inOut(Easing.ease),
};

const { width, height } = Dimensions.get("window");

type SharedTransitionProps = {
  visible: boolean;
  image: { img: string; coordinates: Coordinates };
  onClose: () => void;
};

const SharedTransition = ({
  visible,
  image,
  onClose,
}: SharedTransitionProps) => {
  const progress = useSharedValue(INITIAL_SCALE);
  const opacity = useSharedValue(0);
  const offset = useSharedValue({ y: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    progress.value = withTiming(visible ? 1 : INITIAL_SCALE, SPRING_CONFIG);
    opacity.value = withTiming(visible ? 1 : 0, SPRING_CONFIG);
  }, [visible]);

  const hide = useCallback(() => {
    progress.value = withTiming(INITIAL_SCALE, SPRING_CONFIG, () => {
      runOnJS(onClose)();
    });
    opacity.value = withTiming(0, SPRING_CONFIG);
  }, [onClose]);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      const y = e.translationY / IMAGES_PER_ROW;

      offset.value = { y };
      opacity.value = 1 - Math.abs(e.translationY / (height / 2));
    })
    .onEnd(() => {
      offset.value = {
        y: withTiming(0, SPRING_CONFIG),
      };
      opacity.value = withTiming(1, SPRING_CONFIG);
    });

  const style = useAnimatedStyle(
    () => ({
      position: "absolute",
      width: image.coordinates.width,
      height: image.coordinates.height,
      marginTop: image.coordinates.pageY,
      marginLeft: image.coordinates.pageX,
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [INITIAL_SCALE, 1],
            [
              0,
              width / 2 - image.coordinates.width / 2 - image.coordinates.pageX,
            ],
          ),
        },
        {
          translateY: interpolate(
            progress.value,
            [INITIAL_SCALE, 1],
            [
              0,
              height / 2 -
                image.coordinates.height / 2 -
                image.coordinates.pageY,
            ],
          ),
        },
        { scale: Math.max(progress.value * IMAGES_PER_ROW, 1) },
        { translateY: offset.value.y },
      ],
    }),
    [image.coordinates],
  );
  const background = useAnimatedStyle(
    () => ({
      flex: 1,
      backgroundColor: "black",
      opacity: opacity.value,
    }),
    [],
  );

  return (
    <OverKeyboardView visible={visible}>
      <GestureHandlerRootView style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.container}
          onPress={hide}
        >
          <Reanimated.View style={background} />
        </TouchableOpacity>

        {!!image.img && (
          <GestureDetector gesture={gesture}>
            <Reanimated.Image fadeDuration={0} src={image.img} style={style} />
          </GestureDetector>
        )}
      </GestureHandlerRootView>
    </OverKeyboardView>
  );
};

type ImagePreviewProps = {
  src: string;
  modal: string;
  isModalVisible: boolean;
  onShowImage: (img: string, coordinates: Coordinates) => void;
};

const ImagePreview = ({
  src,
  modal,
  isModalVisible,
  onShowImage,
}: ImagePreviewProps) => {
  const ref = useRef<Image>(null);
  const [isModalFullyVisible, setModalFullyVisible] = useState(isModalVisible);

  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => setModalFullyVisible(true), ANIMATION_DURATION);
    } else {
      setModalFullyVisible(false);
    }
  }, [isModalVisible]);

  const onPressHandler = useCallback(() => {
    ref.current?.measure((x, y, w, h, pageX, pageY) => {
      onShowImage(src, { x, y, width: w, height: h, pageX, pageY });
    });
  }, [onShowImage, src]);

  return (
    <TouchableOpacity onPress={onPressHandler}>
      {modal === src && isModalFullyVisible ? (
        <View style={styles.image} />
      ) : (
        <Image ref={ref} fadeDuration={0} src={src} style={styles.image} />
      )}
    </TouchableOpacity>
  );
};

type Coordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

function ImageGallery() {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState({
    img: "",
    coordinates: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      pageX: 0,
      pageY: 0,
    },
  });
  const onShowImage = useCallback((img: string, coordinates: Coordinates) => {
    setImage({ img, coordinates });
    setShow(true);
  }, []);
  const onClose = useCallback(() => setShow(false), []);

  return (
    <>
      <View style={styles.container}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#4c4c4c"
          style={styles.search}
        />
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="always"
          style={styles.container}
        >
          {images.map((item, i) => (
            <View key={i} style={styles.row}>
              {item.map((img) => (
                <ImagePreview
                  key={img}
                  isModalVisible={show}
                  modal={image.img}
                  src={img}
                  onShowImage={onShowImage}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
      <SharedTransition image={image} visible={show} onClose={onClose} />
    </>
  );
}

const IMAGE_SIZE = width / IMAGES_PER_ROW;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: "#dcdcdc",
  },
  row: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 5,
  },
});

export default ImageGallery;
