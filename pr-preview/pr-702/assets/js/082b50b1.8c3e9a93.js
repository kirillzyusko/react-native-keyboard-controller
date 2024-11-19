"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5519],{58380:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var o=n(74848),t=n(28453);const a={},i="KeyboardEvents",s={id:"api/keyboard-events",title:"KeyboardEvents",description:"This library exposes 4 events which are available on all platforms:",source:"@site/versioned_docs/version-1.4.0/api/keyboard-events.md",sourceDirName:"api",slug:"/api/keyboard-events",permalink:"/react-native-keyboard-controller/pr-preview/pr-702/docs/1.4.0/api/keyboard-events",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.4.0/api/keyboard-events.md",tags:[],version:"1.4.0",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"KeyboardController",permalink:"/react-native-keyboard-controller/pr-preview/pr-702/docs/1.4.0/api/keyboard-controller"},next:{title:"KeyboardProvider",permalink:"/react-native-keyboard-controller/pr-preview/pr-702/docs/1.4.0/api/keyboard-provider"}},l={},d=[{value:"Example",id:"example",level:2}];function c(e){const r={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.h1,{id:"keyboardevents",children:"KeyboardEvents"}),"\n",(0,o.jsx)(r.p,{children:"This library exposes 4 events which are available on all platforms:"}),"\n",(0,o.jsxs)(r.ul,{children:["\n",(0,o.jsx)(r.li,{children:"keyboardWillShow"}),"\n",(0,o.jsx)(r.li,{children:"keyboardWillHide"}),"\n",(0,o.jsx)(r.li,{children:"keyboardDidShow"}),"\n",(0,o.jsx)(r.li,{children:"keyboardDidHide"}),"\n"]}),"\n",(0,o.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-ts",children:'import { KeyboardEvents } from "react-native-keyboard-controller";\n\nuseEffect(() => {\n  const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {\n    // place your code here\n  });\n\n  return () => {\n    show.remove();\n  };\n}, []);\n'})}),"\n",(0,o.jsxs)(r.p,{children:["Also have a look on ",(0,o.jsx)(r.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example",children:"example"})," app for more comprehensive usage."]})]})}function p(e={}){const{wrapper:r}={...(0,t.R)(),...e.components};return r?(0,o.jsx)(r,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},28453:(e,r,n)=>{n.d(r,{R:()=>i,x:()=>s});var o=n(96540);const t={},a=o.createContext(t);function i(e){const r=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function s(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),o.createElement(a.Provider,{value:r},e.children)}}}]);