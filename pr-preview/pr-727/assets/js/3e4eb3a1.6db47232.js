"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5201],{82640:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>a,metadata:()=>t,toc:()=>s});var r=n(74848),d=n(28453);const a={sidebar_position:3,keywords:["react-native-keyboard-controller","KeyboardControllerView","view"]},i="KeyboardControllerView",t={id:"api/keyboard-controller-view",title:"KeyboardControllerView",description:"A plain react-native View with some additional methods and props. Used internally in KeyboardProvider",source:"@site/versioned_docs/version-1.10.0/api/keyboard-controller-view.md",sourceDirName:"api",slug:"/api/keyboard-controller-view",permalink:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.10.0/api/keyboard-controller-view",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.10.0/api/keyboard-controller-view.md",tags:[],version:"1.10.0",sidebarPosition:3,frontMatter:{sidebar_position:3,keywords:["react-native-keyboard-controller","KeyboardControllerView","view"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardProvider",permalink:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.10.0/api/keyboard-provider"},next:{title:"KeyboardGestureArea",permalink:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.10.0/api/keyboard-gesture-area"}},c={},s=[{value:"Props",id:"props",level:2},{value:"<code>onKeyboardMoveStart</code>",id:"onkeyboardmovestart",level:3},{value:"<code>onKeyboardMove</code>",id:"onkeyboardmove",level:3},{value:"<code>onKeyboardMoveInteractive</code>",id:"onkeyboardmoveinteractive",level:3},{value:"<code>onKeyboardMoveEnd</code>",id:"onkeyboardmoveend",level:3},{value:"<code>onFocusedInputLayoutChanged</code>",id:"onfocusedinputlayoutchanged",level:3},{value:"<code>onFocusedInputTextChanged</code>",id:"onfocusedinputtextchanged",level:3},{value:'<code>statusBarTranslucent</code> <div class="label android"></div>',id:"statusbartranslucent-",level:3},{value:'<code>navigationBarTranslucent</code> <div class="label android"></div>',id:"navigationbartranslucent-",level:3},{value:"<code>enabled</code>",id:"enabled",level:3}];function l(e){const o={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",...(0,d.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.h1,{id:"keyboardcontrollerview",children:"KeyboardControllerView"}),"\n",(0,r.jsxs)(o.p,{children:["A plain react-native ",(0,r.jsx)(o.code,{children:"View"})," with some additional methods and props. Used internally in ",(0,r.jsx)(o.a,{href:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.10.0/api/keyboard-provider",children:"KeyboardProvider"})]}),"\n",(0,r.jsx)(o.h2,{id:"props",children:"Props"}),"\n",(0,r.jsx)(o.h3,{id:"onkeyboardmovestart",children:(0,r.jsx)(o.code,{children:"onKeyboardMoveStart"})}),"\n",(0,r.jsx)(o.p,{children:"A callback function which is fired when keyboard starts a transition from one to another state (from closed to open, for example)."}),"\n",(0,r.jsx)(o.h3,{id:"onkeyboardmove",children:(0,r.jsx)(o.code,{children:"onKeyboardMove"})}),"\n",(0,r.jsx)(o.p,{children:"A callback function which is fired every time, when keyboard changes its position on the screen."}),"\n",(0,r.jsx)(o.h3,{id:"onkeyboardmoveinteractive",children:(0,r.jsx)(o.code,{children:"onKeyboardMoveInteractive"})}),"\n",(0,r.jsx)(o.p,{children:"A callback function which is fired every time, when user drags keyboard."}),"\n",(0,r.jsx)(o.h3,{id:"onkeyboardmoveend",children:(0,r.jsx)(o.code,{children:"onKeyboardMoveEnd"})}),"\n",(0,r.jsx)(o.p,{children:"A callback function which is fired when keyboard finished a transition from one to another state (from closed to open, for example)."}),"\n",(0,r.jsx)(o.h3,{id:"onfocusedinputlayoutchanged",children:(0,r.jsx)(o.code,{children:"onFocusedInputLayoutChanged"})}),"\n",(0,r.jsx)(o.p,{children:"A callback function which is fired when layout of focused input gets changed."}),"\n",(0,r.jsx)(o.h3,{id:"onfocusedinputtextchanged",children:(0,r.jsx)(o.code,{children:"onFocusedInputTextChanged"})}),"\n",(0,r.jsx)(o.p,{children:"A callback function which is fired every time when user changes a text (types/deletes symbols)."}),"\n",(0,r.jsxs)(o.h3,{id:"statusbartranslucent-",children:[(0,r.jsx)(o.code,{children:"statusBarTranslucent"})," ",(0,r.jsx)("div",{className:"label android"})]}),"\n",(0,r.jsxs)(o.p,{children:["A boolean prop to indicate whether ",(0,r.jsx)(o.code,{children:"StatusBar"})," should be translucent on ",(0,r.jsx)(o.code,{children:"Android"})," or not."]}),"\n",(0,r.jsxs)(o.h3,{id:"navigationbartranslucent-",children:[(0,r.jsx)(o.code,{children:"navigationBarTranslucent"})," ",(0,r.jsx)("div",{className:"label android"})]}),"\n",(0,r.jsxs)(o.p,{children:["A boolean prop to indicate whether ",(0,r.jsx)(o.a,{href:"https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar",children:"NavigationBar"})," should be translucent on ",(0,r.jsx)(o.code,{children:"Android"})," or not."]}),"\n",(0,r.jsx)(o.h3,{id:"enabled",children:(0,r.jsx)(o.code,{children:"enabled"})}),"\n",(0,r.jsxs)(o.p,{children:["A boolean prop indicating whether the view is active or not. If it's ",(0,r.jsx)(o.code,{children:"true"})," then it moves application to ",(0,r.jsx)(o.a,{href:"https://developer.android.com/training/gestures/edge-to-edge",children:"edge-to-edge"})," mode on Android and setup keyboard callbacks. When ",(0,r.jsx)(o.code,{children:"false"})," - moves app away from ",(0,r.jsx)(o.a,{href:"https://developer.android.com/training/gestures/edge-to-edge",children:"edge-to-edge"})," and removes keyboard listeners."]})]})}function h(e={}){const{wrapper:o}={...(0,d.R)(),...e.components};return o?(0,r.jsx)(o,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},28453:(e,o,n)=>{n.d(o,{R:()=>i,x:()=>t});var r=n(96540);const d={},a=r.createContext(d);function i(e){const o=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function t(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:i(e.components),r.createElement(a.Provider,{value:o},e.children)}}}]);