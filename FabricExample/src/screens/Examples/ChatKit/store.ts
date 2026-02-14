import { create } from "zustand";

import { messages as initialMessages } from "./data";

import type { MessageProps } from "../../../components/Message/types";

type ListMode = "scroll" | "flat" | "flash" | "legend";

interface ChatConfigStore {
  inverted: boolean;
  setInverted: (inverted: boolean) => void;
  beginning: boolean;
  setBeginning: (beginning: boolean) => void;
  freeze: boolean;
  setFreeze: (freeze: boolean) => void;
  messages: MessageProps[];
  reversedMessages: MessageProps[];
  setMessages: (messages: MessageProps[]) => void;
  addMessage: (message: MessageProps) => void;
  mode: ListMode;
  setMode: (mode: ListMode) => void;
  resetMessages: () => void;
}

export const useChatConfigStore = create<ChatConfigStore>((set) => ({
  inverted: false,
  setInverted: (inverted) => set({ inverted }),
  freeze: false,
  setFreeze: (freeze) => set({ freeze }),
  beginning: false,
  setBeginning: (beginning) => {
    set(() => {
      const newMessages = beginning ? [initialMessages[0]] : initialMessages;

      return {
        beginning,
        messages: newMessages,
        reversedMessages: [...newMessages].reverse(),
      };
    });
  },
  messages: initialMessages,
  reversedMessages: [...initialMessages].reverse(),
  setMessages: (messages) =>
    set({ messages, reversedMessages: [...messages].reverse() }),
  addMessage: (message) =>
    set((state) => {
      const newMessages = [...state.messages, message];

      return {
        messages: newMessages,
        reversedMessages: [...newMessages].reverse(),
      };
    }),
  mode: "scroll",
  setMode: (mode) => set({ mode }),
  resetMessages: () =>
    set({
      messages: initialMessages,
      reversedMessages: [...initialMessages].reverse(),
    }),
}));
