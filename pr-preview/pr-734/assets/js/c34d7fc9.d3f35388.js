"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4542],{81900:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>d,metadata:()=>o,toc:()=>a});var i=r(74848),t=r(28453);const d={sidebar_position:1,keywords:["react-native-keyboard-controller","architecture","design principles"]},s="Architecture",o={id:"recipes/architecture",title:"Architecture",description:"This library requires to wrap an app with KeyboardProvider component. It's needed because it stores animated values in context.",source:"@site/versioned_docs/version-1.14.0/recipes/architecture.mdx",sourceDirName:"recipes",slug:"/recipes/architecture",permalink:"/react-native-keyboard-controller/pr-preview/pr-734/docs/1.14.0/recipes/architecture",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.14.0/recipes/architecture.mdx",tags:[],version:"1.14.0",sidebarPosition:1,frontMatter:{sidebar_position:1,keywords:["react-native-keyboard-controller","architecture","design principles"]},sidebar:"tutorialSidebar",previous:{title:"Recipes",permalink:"/react-native-keyboard-controller/pr-preview/pr-734/docs/1.14.0/category/recipes"},next:{title:"Platforms capabilities and limitations",permalink:"/react-native-keyboard-controller/pr-preview/pr-734/docs/1.14.0/recipes/platform-differences"}},c={},a=[{value:"Process overview",id:"process-overview",level:2},{value:"Design principles",id:"design-principles",level:2},{value:"Why custom <code>KeyboardControllerView</code> is needed?",id:"why-custom-keyboardcontrollerview-is-needed",level:2},{value:"What is the difference between <code>useAnimatedKeyboard</code> from <code>react-native-reanimated</code> and this library?",id:"what-is-the-difference-between-useanimatedkeyboard-from-react-native-reanimated-and-this-library",level:2}];function l(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"architecture",children:"Architecture"}),"\n",(0,i.jsxs)(n.p,{children:["This library requires to wrap an app with ",(0,i.jsx)(n.code,{children:"KeyboardProvider"})," component. It's needed because it stores animated values in ",(0,i.jsx)(n.code,{children:"context"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"process-overview",children:"Process overview"}),"\n",(0,i.jsxs)(n.p,{children:["Library exposes ",(0,i.jsx)(n.code,{children:"KeyboardControllerView"})," with ",(0,i.jsx)(n.code,{children:"onKeyboardMove"})," method. This method is fired when keyboard frame is changed. ",(0,i.jsx)(n.code,{children:"KeyboardProvider"})," automatically maps these events to ",(0,i.jsx)(n.code,{children:"Animated.Value"})," and ",(0,i.jsx)(n.code,{children:"Reanimated.SharedValue"})," and stores it in ",(0,i.jsx)(n.code,{children:"context"}),"."]}),"\n",(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["Under the hood ",(0,i.jsx)(n.code,{children:"KeyboardControllerView"})," is a simple ",(0,i.jsx)(n.code,{children:"View"})," with one additional ",(0,i.jsx)(n.code,{children:"onKeyboardMove"})," callback method, so it inherits all props from plain ",(0,i.jsx)(n.code,{children:"View"}),", such as ",(0,i.jsx)(n.code,{children:"style"}),", etc."]})}),"\n",(0,i.jsxs)(n.p,{children:["Thus we have a single source of truth about keyboard position. Since values are stored in ",(0,i.jsx)(n.code,{children:"context"})," we can use it in any component where we need them. Moreover, we can consume ",(0,i.jsx)(n.code,{children:"context"})," values in class components as well as in hooks."]}),"\n",(0,i.jsx)(n.h2,{id:"design-principles",children:"Design principles"}),"\n",(0,i.jsxs)(n.p,{children:["The library was designed to use a ",(0,i.jsx)(n.code,{children:"context"})," as a global store for animated values and have a single ",(0,i.jsx)(n.code,{children:"Provider"})," across the app. As of now it may be not very obvious, why it was needed to have a single source of data flow, but in future it may significantly simplify the process of the integration new features."]}),"\n",(0,i.jsxs)(n.h2,{id:"why-custom-keyboardcontrollerview-is-needed",children:["Why custom ",(0,i.jsx)(n.code,{children:"KeyboardControllerView"})," is needed?"]}),"\n",(0,i.jsxs)(n.p,{children:["Initially I had a choice which approach to use in order to send events about keyboard frames: ",(0,i.jsx)(n.code,{children:"EventEmitters"})," vs ",(0,i.jsx)(n.code,{children:"View"})," with callbacks. I decided to use ",(0,i.jsx)(n.code,{children:"View"})," with callbacks because of several reasons:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"react-native"})," core team uses similar approach for ",(0,i.jsx)(n.code,{children:"onScroll"})," event from ",(0,i.jsx)(n.code,{children:"ScrollView"})," component (also I knew, that it's possible to map events from such callbacks to ",(0,i.jsx)(n.code,{children:"Animated.Value"})," and thus reduce bridge usage);"]}),"\n",(0,i.jsxs)(n.li,{children:["to track keyboard frames on Android we need to enter to ",(0,i.jsx)(n.a,{href:"https://developer.android.com/training/gestures/edge-to-edge",children:"edge-to-edge"})," mode and it changes view paddings. Since it's managed through ",(0,i.jsx)(n.code,{children:"View"})," it's easier to change padding of this view."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"reanimated"})," allows to intercept ",(0,i.jsx)(n.code,{children:"view"})," events using theirs ",(0,i.jsx)(n.code,{children:"useEvent"})," hook and move the event handling into worklet runtime. Thus sending events via ",(0,i.jsx)(n.code,{children:"view"})," allows to make an integration with ",(0,i.jsx)(n.code,{children:"reanimated"})," package and handle events/animate everything directly on the UI thread."]}),"\n"]}),"\n",(0,i.jsxs)(n.h2,{id:"what-is-the-difference-between-useanimatedkeyboard-from-react-native-reanimated-and-this-library",children:["What is the difference between ",(0,i.jsx)(n.code,{children:"useAnimatedKeyboard"})," from ",(0,i.jsx)(n.code,{children:"react-native-reanimated"})," and this library?"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"react-native-keyboard-controller"})," uses its own implementation for keyboard handling and leverages ",(0,i.jsx)(n.code,{children:"react-native-reanimated"})," solely for performing UI thread updates using ",(0,i.jsx)(n.code,{children:"SharedValue"})," (the library doesn't simply re-export ",(0,i.jsx)(n.code,{children:"useAnimatedKeyboard"})," hook in any kind of form)."]}),"\n",(0,i.jsxs)(n.p,{children:["While both ",(0,i.jsx)(n.code,{children:"useAnimatedKeyboard"})," from ",(0,i.jsx)(n.code,{children:"react-native-reanimated"})," and this library aims to provide the same functionality, there are some differences between them. Below you can find a comparison of the two libraries:"]}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{}),(0,i.jsx)(n.th,{children:(0,i.jsx)(n.code,{children:"react-native-keyboard-controller"})}),(0,i.jsx)(n.th,{children:(0,i.jsx)(n.code,{children:"react-native-reanimated"})})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"Map keyboard movement to animated value"}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u2705"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"Synchronously update keyboard position on UI thread"}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u2705"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["Dynamically switch ",(0,i.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-734/docs/1.14.0/api/keyboard-controller#setinputmode-",children:(0,i.jsx)(n.code,{children:"softInputMode"})})]}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u274c"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"An ability to turn functionality on demand"}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsxs)(n.td,{children:["\ud83d\udfe0 ",(0,i.jsx)("sup",{children:(0,i.jsx)("small",{children:"1"})})]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"Android interactive keyboard support"}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u274c"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"iOS interactive keyboard support"}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u2705"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"Has pre-built components"}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u274c"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["Works in ",(0,i.jsx)(n.code,{children:"Modal"})," on Android"]}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsxs)(n.td,{children:["\ud83d\udfe0 ",(0,i.jsx)("sup",{children:(0,i.jsx)("small",{children:"2"})})]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["Is ready-to-use library for keyboard avoidance",(0,i.jsx)("sup",{children:(0,i.jsx)("small",{children:"3"})})]}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u274c"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"KeyboardToolbar"})," component"]}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u274c"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"OverKeyboardView"})," component"]}),(0,i.jsx)(n.td,{children:"\u2705"}),(0,i.jsx)(n.td,{children:"\u274c"})]})]})]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)("sup",{children:"1"})," You need to unmount all components that use ",(0,i.jsx)(n.code,{children:"useAnimatedKeyboard"}),"\nto disable module functionality, which can be hard to achieve if you are using\ndeep Stack-navigators."]}),"\n"]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)("sup",{children:"2"})," Planned to be added in the future"]}),"\n"]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)("sup",{children:"3"})," The ",(0,i.jsx)(n.code,{children:"react-native-keyboard-controller"})," tracks focused input changes\n(apart of keyboard tracking) and thus brings advanced concepts for keyboard avoidance."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"To sum it up:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["if you are using ",(0,i.jsx)(n.code,{children:"useAnimatedKeyboard"})," and you are satisfied with it, then there is no sense to switch to ",(0,i.jsx)(n.code,{children:"react-native-keyboard-controller"}),";"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["if you are planning to add advanced keyboard handling into large existing project, then ",(0,i.jsx)(n.code,{children:"react-native-keyboard-controller"})," can be a better choice, since it has drop-in replacement components (",(0,i.jsx)(n.code,{children:"KeyboardAvoidingView"}),", ",(0,i.jsx)(n.code,{children:"KeyboardAwareScrollView"}),", etc.), you can toggle the functionality dynamically on per screen basic, you can dynamically change ",(0,i.jsx)(n.code,{children:"softInputMode"})," which should simplify the integration process."]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},28453:(e,n,r)=>{r.d(n,{R:()=>s,x:()=>o});var i=r(96540);const t={},d=i.createContext(t);function s(e){const n=i.useContext(d);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),i.createElement(d.Provider,{value:n},e.children)}}}]);