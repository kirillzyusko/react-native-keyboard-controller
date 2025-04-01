"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5670],{88787:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>d,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>l});var n=t(74848),o=t(28453);const a={sidebar_position:6,keywords:["react-native-keyboard-controller","events","keyboardWillShow","keyboardWillHide","android","iOS","cross platform"]},i="KeyboardEvents",s={id:"api/keyboard-events",title:"KeyboardEvents",description:"This library exposes 4 events which are available on all platforms:",source:"@site/versioned_docs/version-1.16.0/api/keyboard-events.md",sourceDirName:"api",slug:"/api/keyboard-events",permalink:"/react-native-keyboard-controller/pr-preview/pr-894/docs/api/keyboard-events",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.16.0/api/keyboard-events.md",tags:[],version:"1.16.0",sidebarPosition:6,frontMatter:{sidebar_position:6,keywords:["react-native-keyboard-controller","events","keyboardWillShow","keyboardWillHide","android","iOS","cross platform"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardController",permalink:"/react-native-keyboard-controller/pr-preview/pr-894/docs/api/keyboard-controller"},next:{title:"OverKeyboardView",permalink:"/react-native-keyboard-controller/pr-preview/pr-894/docs/api/over-keyboard-view/"}},d={},l=[{value:"Event structure",id:"event-structure",level:2},{value:"Example",id:"example",level:2}];function c(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:"keyboardevents",children:"KeyboardEvents"}),"\n",(0,n.jsx)(r.p,{children:"This library exposes 4 events which are available on all platforms:"}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:"keyboardWillShow"})," - emitted when the keyboard is about to appear."]}),"\n",(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:"keyboardWillHide"})," - emitted when the keyboard is about to disappear."]}),"\n",(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:"keyboardDidShow"})," - emitted when the keyboard has completed its animation and is fully visible on the screen."]}),"\n",(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:"keyboardDidHide"})," - emitted when the keyboard has completed its animation and is fully hidden."]}),"\n"]}),"\n",(0,n.jsx)(r.h2,{id:"event-structure",children:"Event structure"}),"\n",(0,n.jsx)(r.p,{children:"All events have following properties:"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"type KeyboardEventData = {\n  height: number; // height of the keyboard\n  duration: number; // duration of the animation\n  timestamp: number; // timestamp of the event from native thread\n  target: number; // tag of the focused TextInput\n  type: string; // `keyboardType` property from focused `TextInput`\n  appearance: string; // `keyboardAppearance` property from focused `TextInput`\n};\n"})}),"\n",(0,n.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:'import { KeyboardEvents } from "react-native-keyboard-controller";\n\nuseEffect(() => {\n  const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {\n    // place your code here\n  });\n\n  return () => {\n    show.remove();\n  };\n}, []);\n'})}),"\n",(0,n.jsxs)(r.p,{children:["Also have a look on ",(0,n.jsx)(r.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example",children:"example"})," app for more comprehensive usage."]})]})}function p(e={}){const{wrapper:r}={...(0,o.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},28453:(e,r,t)=>{t.d(r,{R:()=>i,x:()=>s});var n=t(96540);const o={},a=n.createContext(o);function i(e){const r=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function s(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),n.createElement(a.Provider,{value:r},e.children)}}}]);