import React, { useCallback, useEffect, useRef } from "react";

import HoverableKeyboardSVG from "./HoverableKeyboardSVG";

const alphabet = "zxcvbnmasdfghjklqwertyuiop_";
const storyToTell = "Hello, World!".toLowerCase().replace(/ /g, "_");

function HoverableKeyboard() {
  const timerRef = useRef(null);
  const currentLetterRef = useRef("");

  const cleanCurrentlyAnimatedLetter = useCallback(() => {
    document
      .getElementById(currentLetterRef.current)
      ?.classList.remove("hover");
  }, []);
  const onStopAnimation = useCallback(() => {
    clearInterval(timerRef.current);
    cleanCurrentlyAnimatedLetter();
  }, [cleanCurrentlyAnimatedLetter]);
  const onStartAnimation = useCallback(() => {
    let i = 0;

    timerRef.current = setInterval(() => {
      if (i >= storyToTell.length) {
        i = 0;

        return;
      }

      setTimeout(cleanCurrentlyAnimatedLetter, 200);
      currentLetterRef.current = storyToTell[i++];

      if (!alphabet.includes(currentLetterRef.current)) {
        return;
      }

      document.getElementById(currentLetterRef.current)?.classList.add("hover");
    }, 350);
  }, [cleanCurrentlyAnimatedLetter]);

  useEffect(() => {
    onStartAnimation();

    return onStopAnimation;
  }, [onStartAnimation, onStopAnimation]);

  return (
    <HoverableKeyboardSVG
      onHoverBlur={onStartAnimation}
      onHoverFocus={onStopAnimation}
    />
  );
}

export default HoverableKeyboard;
