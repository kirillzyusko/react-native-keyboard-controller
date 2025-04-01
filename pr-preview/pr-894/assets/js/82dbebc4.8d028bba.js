"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1279],{11791:(e,i,r)=>{r.r(i),r.d(i,{assets:()=>d,contentTitle:()=>t,default:()=>h,frontMatter:()=>s,metadata:()=>c,toc:()=>a});var o=r(74848),n=r(28453);const s={sidebar_position:1},t="Architecture",c={id:"recipes/architecture",title:"Architecture",description:"This library requires to wrap an app with KeyboardProvider component. It's needed because it stores animated values in context.",source:"@site/versioned_docs/version-1.0.0/recipes/architecture.md",sourceDirName:"recipes",slug:"/recipes/architecture",permalink:"/react-native-keyboard-controller/pr-preview/pr-894/docs/1.0.0/recipes/architecture",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.0.0/recipes/architecture.md",tags:[],version:"1.0.0",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Recipes",permalink:"/react-native-keyboard-controller/pr-preview/pr-894/docs/1.0.0/category/recipes"},next:{title:"Platforms capabilities and limitations",permalink:"/react-native-keyboard-controller/pr-preview/pr-894/docs/1.0.0/recipes/platform-differences"}},d={},a=[{value:"Process overview",id:"process-overview",level:2},{value:"Design principles",id:"design-principles",level:2},{value:"Why custom <code>KeyboardControllerView</code> is needed?",id:"why-custom-keyboardcontrollerview-is-needed",level:2}];function l(e){const i={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i.h1,{id:"architecture",children:"Architecture"}),"\n",(0,o.jsxs)(i.p,{children:["This library requires to wrap an app with ",(0,o.jsx)(i.code,{children:"KeyboardProvider"})," component. It's needed because it stores animated values in ",(0,o.jsx)(i.code,{children:"context"}),"."]}),"\n",(0,o.jsx)(i.h2,{id:"process-overview",children:"Process overview"}),"\n",(0,o.jsxs)(i.p,{children:["Library exposes ",(0,o.jsx)(i.code,{children:"KeyboardControllerView"})," with ",(0,o.jsx)(i.code,{children:"onKeyboardMove"})," method. This method is fired when keyboard frame is changed. ",(0,o.jsx)(i.code,{children:"KeyboardProvider"})," automatically maps these events to ",(0,o.jsx)(i.code,{children:"Animated.Value"})," and ",(0,o.jsx)(i.code,{children:"Reanimated.SharedValue"})," and stores it in ",(0,o.jsx)(i.code,{children:"context"}),"."]}),"\n",(0,o.jsx)(i.admonition,{type:"info",children:(0,o.jsxs)(i.p,{children:["Under the hood ",(0,o.jsx)(i.code,{children:"KeyboardControllerView"})," is a simple ",(0,o.jsx)(i.code,{children:"View"})," with one additional ",(0,o.jsx)(i.code,{children:"onKeyboardMove"})," callback method, so it inherits all props from plain ",(0,o.jsx)(i.code,{children:"View"}),", such as ",(0,o.jsx)(i.code,{children:"style"}),", etc."]})}),"\n",(0,o.jsxs)(i.p,{children:["Thus we have a single source of truth about keyboard position. Since values are stored in ",(0,o.jsx)(i.code,{children:"context"})," we can use it in any component where we need them. Moreover, we can consume ",(0,o.jsx)(i.code,{children:"context"})," values in class components as well as in hooks."]}),"\n",(0,o.jsx)(i.h2,{id:"design-principles",children:"Design principles"}),"\n",(0,o.jsxs)(i.p,{children:["The library was designed to use a ",(0,o.jsx)(i.code,{children:"context"})," as a global store for animated values and have a single ",(0,o.jsx)(i.code,{children:"Provider"})," across the app. As of now it may be not very obvious, why it was needed to have a single source of data flow, but in future it may significantly simplify the process of the integration new features."]}),"\n",(0,o.jsxs)(i.h2,{id:"why-custom-keyboardcontrollerview-is-needed",children:["Why custom ",(0,o.jsx)(i.code,{children:"KeyboardControllerView"})," is needed?"]}),"\n",(0,o.jsxs)(i.p,{children:["Initially I had a choice which approach to use in order to send events about keyboard frames: ",(0,o.jsx)(i.code,{children:"EventEmitters"})," vs ",(0,o.jsx)(i.code,{children:"View"})," with callbacks. I decided to use ",(0,o.jsx)(i.code,{children:"View"})," with callbacks because of several reasons:"]}),"\n",(0,o.jsxs)(i.ul,{children:["\n",(0,o.jsxs)(i.li,{children:[(0,o.jsx)(i.code,{children:"react-native"})," core team uses similar approach for ",(0,o.jsx)(i.code,{children:"onScroll"})," event from ",(0,o.jsx)(i.code,{children:"ScrollView"})," component (also I knew, that it's possible to map events from such callbacks to ",(0,o.jsx)(i.code,{children:"Animated.Value"})," and thus reduce bridge usage);"]}),"\n",(0,o.jsxs)(i.li,{children:["to track keyboard frames on Android we need to enter to ",(0,o.jsx)(i.a,{href:"https://developer.android.com/training/gestures/edge-to-edge",children:"edge-to-edge"})," mode and it changes view paddings. Since it's managed through ",(0,o.jsx)(i.code,{children:"View"})," it's easier to change padding of this view."]}),"\n",(0,o.jsxs)(i.li,{children:["in future it may be needed to send ",(0,o.jsx)(i.code,{children:"Animated.Value"})," from JS to native thread (interactive keyboard dismissing on ",(0,o.jsx)(i.code,{children:"Android"}),"). And in community there a lot of libraries which are accepting props as ",(0,o.jsx)(i.code,{children:"Animated.Value"})," (for example ",(0,o.jsx)(i.code,{children:"lottie"})," and its ",(0,o.jsx)(i.code,{children:"progress"})," prop)."]}),"\n"]})]})}function h(e={}){const{wrapper:i}={...(0,n.R)(),...e.components};return i?(0,o.jsx)(i,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},28453:(e,i,r)=>{r.d(i,{R:()=>t,x:()=>c});var o=r(96540);const n={},s=o.createContext(n);function t(e){const i=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function c(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:t(e.components),o.createElement(s.Provider,{value:i},e.children)}}}]);