import { history } from "../../../components/Message/data";

export const messages = [
  ...history,
  // continue dialog further
  { text: "Do you any other questions?", sender: true },
  { text: "Yes, I have a question about teleport library" },
  { text: "Do you know anything about it?", sender: true },
  {
    text: "I have seen some techno demos, but haven't tried it uet",
    sender: true,
  },
  { text: "Yes, I already tried it in my project" },
  {
    text: "It's pretty cool. We were able to built gallery with share element transitions without any flickering or any other issues",
    sender: true,
  },
  { text: "So far it looks cool!", sender: true },
  { text: "And seems to be pretty stable", sender: true },
  {
    text: "This is a literally missing 'move' operation in react/react-native. Before we could only create/delete elements, but now you get power of zero-overhead 'move' operation and it can bring your app performance on the next level and also significantly boost your app UI cause it unlocks the power that we didn't have before",
  },
  { text: "Wow! That's awesome!" },
  { text: "Yes! Totally agree!", sender: true },
];
