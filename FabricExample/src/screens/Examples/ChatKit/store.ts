import { create } from "zustand";

import { messages as initialMessages } from "./data";

import type { MessageProps } from "../../../components/Message/types";

type ListMode = "scroll" | "flat" | "flash" | "legend";

interface ChatConfigStore {
  inverted: boolean;
  setInverted: (inverted: boolean) => void;
  beginning: boolean;
  setBeginning: (beginning: boolean) => void;
  messages: MessageProps[];
  reversedMessages: MessageProps[];
  setMessages: (messages: MessageProps[]) => void;
  addMessage: (message: MessageProps) => void;
  mode: ListMode;
  setMode: (mode: ListMode) => void;
  resetMessages: () => void;
}

export const useChatConfigStore = create<ChatConfigStore>((set, get) => ({
  inverted: false,
  setInverted: (inverted) => set({ inverted }),
  beginning: false,
  setBeginning: (beginning) => {
    set(() => {
      const newMessages = beginning ? [initialMessages[0]] : initialMessages;

      return { beginning, messages: newMessages };
    });
  },
  messages: initialMessages,
  get reversedMessages() {
    return [...get().messages].reverse();
  },
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  mode: "scroll",
  setMode: (mode) => set({ mode }),
  resetMessages: () => set({ messages: initialMessages }),
}));
