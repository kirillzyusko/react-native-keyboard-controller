"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9683],{68599:(e,o,i)=>{i.r(o),i.d(o,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>n,metadata:()=>s,toc:()=>l});var r=i(74848),t=i(28453);const n={sidebar_position:2,keywords:["react-native-keyboard-controller","limitations","important defaults"]},a="Platforms capabilities and limitations",s={id:"recipes/platform-differences",title:"Platforms capabilities and limitations",description:"This library relies on WindowInsetsCompat API on Android and keyboard listeners (NotificationCenter) on iOS.",source:"@site/docs/recipes/platform-differences.md",sourceDirName:"recipes",slug:"/recipes/platform-differences",permalink:"/react-native-keyboard-controller/pr-preview/pr-746/docs/next/recipes/platform-differences",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/docs/recipes/platform-differences.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,keywords:["react-native-keyboard-controller","limitations","important defaults"]},sidebar:"tutorialSidebar",previous:{title:"Architecture",permalink:"/react-native-keyboard-controller/pr-preview/pr-746/docs/next/recipes/architecture"},next:{title:"Jest testing guide",permalink:"/react-native-keyboard-controller/pr-preview/pr-746/docs/next/recipes/jest-testing-guide"}},d={},l=[{value:"Android",id:"android",level:2},{value:"iOS",id:"ios",level:2}];function c(e){const o={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.h1,{id:"platforms-capabilities-and-limitations",children:"Platforms capabilities and limitations"}),"\n",(0,r.jsxs)(o.p,{children:["This library relies on ",(0,r.jsx)(o.code,{children:"WindowInsetsCompat"})," API on ",(0,r.jsx)(o.code,{children:"Android"})," and keyboard listeners (",(0,r.jsx)(o.code,{children:"NotificationCenter"}),") on iOS."]}),"\n",(0,r.jsx)(o.p,{children:"Since two platforms are totally different (see below for more details) the purpose of this API is to provide a common API for both platforms, which will work in the same way on both platforms, but at the same time give an access to all power of the platform features."}),"\n",(0,r.jsx)(o.h2,{id:"android",children:"Android"}),"\n",(0,r.jsx)(o.p,{children:"To track each keyboard frame in Android you need to perform 3 steps:"}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:["enter ",(0,r.jsx)(o.a,{href:"https://developer.android.com/training/gestures/edge-to-edge",children:"edge-to-edge"})," mode (",(0,r.jsx)(o.code,{children:"KeyboardControllerView"})," already does it for you, and ",(0,r.jsx)(o.code,{children:"KeyboardProvider"})," uses ",(0,r.jsx)(o.code,{children:"KeyboardControllerView"}),", so once you've wrapped your app in ",(0,r.jsx)(o.code,{children:"KeyboardProvider"})," - you've completed this step \ud83c\udf89)."]}),"\n",(0,r.jsxs)(o.li,{children:["change ",(0,r.jsx)(o.code,{children:"android:windowSoftInputMode"})," to ",(0,r.jsx)(o.code,{children:"adjustResize"})," (this library exposes ",(0,r.jsx)(o.a,{href:"/react-native-keyboard-controller/pr-preview/pr-746/docs/next/api/keyboard-controller",children:"KeyboardController"})," and you can change it in runtime - default hooks changes soft input mode on mount and restore default behavior on unmount, but you can control it as you ",(0,r.jsx)(o.a,{href:"/react-native-keyboard-controller/pr-preview/pr-746/docs/next/guides/building-own-hook",children:"wish"})," (change mode on focus/unfocus screen etc.)) - this is needed to deliver the best ",(0,r.jsx)(o.a,{href:"https://developer.android.com/develop/ui/views/layout/sw-keyboard#check-visibility",children:"backward"})," compatibility and ",(0,r.jsx)(o.em,{children:(0,r.jsx)(o.strong,{children:"prevent"})})," automatic window resizing (",(0,r.jsx)(o.code,{children:"adjustResize"})," + ",(0,r.jsx)(o.code,{children:"edge-to-edge"})," makes window not automatically resizable anymore);"]}),"\n",(0,r.jsxs)(o.li,{children:["setup ",(0,r.jsx)(o.code,{children:"WindowInsetsAnimationCallback"})," and track keyboard frames. ",(0,r.jsx)(o.code,{children:"KeyboardControllerView"})," maps events from this callback and forward them in ",(0,r.jsx)(o.code,{children:"onKeyboardMove"})," callback on JS side (",(0,r.jsx)(o.code,{children:"KeyboardProvider"})," handles it and maps these events to ",(0,r.jsx)(o.code,{children:"Animated"})," values + stores it in ",(0,r.jsx)(o.code,{children:"context"}),")."]}),"\n"]}),"\n",(0,r.jsx)(o.h2,{id:"ios",children:"iOS"}),"\n",(0,r.jsx)(o.p,{children:"iOS doesn't give an API to track each keyboard frame. But it gives an information when keyboard will appear and when it appeared (i.e. the start and the end of the keyboard movement) and also it schedules layout animation."}),"\n",(0,r.jsxs)(o.admonition,{title:"Non discrete values",type:"caution",children:[(0,r.jsxs)(o.p,{children:["Unlike Android, ",(0,r.jsx)(o.code,{children:"progress"})," value on iOS will have only two values (",(0,r.jsx)(o.code,{children:"0"})," or ",(0,r.jsx)(o.code,{children:"1"}),") - i.e. it will not have an intermediate values, like 0.07, 0.12, 0.27 etc (same is applied to ",(0,r.jsx)(o.code,{children:"height"})," property - it doesn't have an intermediate values). It's not a big problem, but some interpolations (which are relying on intermediate values) may not work properly."]}),(0,r.jsxs)(o.p,{children:["If you are animating non UI props (such as ",(0,r.jsx)(o.code,{children:"width"}),", ",(0,r.jsx)(o.code,{children:"height"}),", etc.) and you need to have intermediate values - consider to use ",(0,r.jsx)(o.a,{href:"../api/hooks/keyboard/use-keyboard-handler",children:"useKeyboardHandler"})," hook."]})]})]})}function h(e={}){const{wrapper:o}={...(0,t.R)(),...e.components};return o?(0,r.jsx)(o,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},28453:(e,o,i)=>{i.d(o,{R:()=>a,x:()=>s});var r=i(96540);const t={},n=r.createContext(t);function a(e){const o=r.useContext(n);return r.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function s(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),r.createElement(n.Provider,{value:o},e.children)}}}]);