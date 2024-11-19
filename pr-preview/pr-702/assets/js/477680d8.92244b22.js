"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7939],{29897:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var t=n(74848),o=n(28453);const a={sidebar_position:6,keywords:["react-native-keyboard-controller","events","keyboardWillShow","keyboardWillHide","android","iOS","cross platform"]},i="KeyboardEvents",s={id:"api/keyboard-events",title:"KeyboardEvents",description:"This library exposes 4 events which are available on all platforms:",source:"@site/versioned_docs/version-1.7.0/api/keyboard-events.md",sourceDirName:"api",slug:"/api/keyboard-events",permalink:"/react-native-keyboard-controller/pr-preview/pr-702/docs/1.7.0/api/keyboard-events",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.7.0/api/keyboard-events.md",tags:[],version:"1.7.0",sidebarPosition:6,frontMatter:{sidebar_position:6,keywords:["react-native-keyboard-controller","events","keyboardWillShow","keyboardWillHide","android","iOS","cross platform"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardController",permalink:"/react-native-keyboard-controller/pr-preview/pr-702/docs/1.7.0/api/keyboard-controller"}},l={},d=[{value:"Event structure",id:"event-structure",level:2},{value:"Example",id:"example",level:2}];function c(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.h1,{id:"keyboardevents",children:"KeyboardEvents"}),"\n",(0,t.jsx)(r.p,{children:"This library exposes 4 events which are available on all platforms:"}),"\n",(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsx)(r.li,{children:"keyboardWillShow"}),"\n",(0,t.jsx)(r.li,{children:"keyboardWillHide"}),"\n",(0,t.jsx)(r.li,{children:"keyboardDidShow"}),"\n",(0,t.jsx)(r.li,{children:"keyboardDidHide"}),"\n"]}),"\n",(0,t.jsx)(r.h2,{id:"event-structure",children:"Event structure"}),"\n",(0,t.jsx)(r.p,{children:"All events have following properties:"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-ts",children:"type KeyboardEventData = {\n  height: number; // height of the keyboard\n  duration: number; // duration of the animation\n  timestamp: number; // timestamp of the event from native thread\n  target: number; // tag of the focused TextInput\n};\n"})}),"\n",(0,t.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-ts",children:'import { KeyboardEvents } from "react-native-keyboard-controller";\n\nuseEffect(() => {\n  const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {\n    // place your code here\n  });\n\n  return () => {\n    show.remove();\n  };\n}, []);\n'})}),"\n",(0,t.jsxs)(r.p,{children:["Also have a look on ",(0,t.jsx)(r.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example",children:"example"})," app for more comprehensive usage."]})]})}function p(e={}){const{wrapper:r}={...(0,o.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},28453:(e,r,n)=>{n.d(r,{R:()=>i,x:()=>s});var t=n(96540);const o={},a=t.createContext(o);function i(e){const r=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function s(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),t.createElement(a.Provider,{value:r},e.children)}}}]);