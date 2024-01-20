"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3110],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>v});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=d(e,["components","mdxType","originalType","parentName"]),u=c(r),v=o,b=u["".concat(l,".").concat(v)]||u[v]||s[v]||a;return r?n.createElement(b,i(i({ref:t},p),{},{components:r})):n.createElement(b,i({ref:t},p))}));function v(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=u;var d={};for(var l in t)hasOwnProperty.call(t,l)&&(d[l]=t[l]);d.originalType=e,d.mdxType="string"==typeof e?e:o,i[1]=d;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},7566:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>s,frontMatter:()=>a,metadata:()=>d,toc:()=>c});var n=r(7462),o=(r(7294),r(3905));const a={sidebar_position:3,keywords:["react-native-keyboard-controller","KeyboardControllerView","view"]},i="KeyboardControllerView",d={unversionedId:"api/keyboard-controller-view",id:"api/keyboard-controller-view",title:"KeyboardControllerView",description:"A plain react-native View with some additional methods and props. Used internally in KeyboardProvider",source:"@site/docs/api/keyboard-controller-view.md",sourceDirName:"api",slug:"/api/keyboard-controller-view",permalink:"/react-native-keyboard-controller/pr-preview/pr-341/docs/next/api/keyboard-controller-view",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/docs/api/keyboard-controller-view.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,keywords:["react-native-keyboard-controller","KeyboardControllerView","view"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardProvider",permalink:"/react-native-keyboard-controller/pr-preview/pr-341/docs/next/api/keyboard-provider"},next:{title:"KeyboardGestureArea",permalink:"/react-native-keyboard-controller/pr-preview/pr-341/docs/next/api/keyboard-gesture-area"}},l={},c=[{value:"Props",id:"props",level:2},{value:"<code>onKeyboardMoveStart</code>",id:"onkeyboardmovestart",level:3},{value:"<code>onKeyboardMove</code>",id:"onkeyboardmove",level:3},{value:"<code>onKeyboardMoveInteractive</code>",id:"onkeyboardmoveinteractive",level:3},{value:"<code>onKeyboardMoveEnd</code>",id:"onkeyboardmoveend",level:3},{value:"<code>onFocusedInputLayoutChanged</code>",id:"onfocusedinputlayoutchanged",level:3},{value:"<code>onFocusedInputTextChanged</code>",id:"onfocusedinputtextchanged",level:3},{value:"<code>statusBarTranslucent</code>",id:"statusbartranslucent",level:3},{value:"<code>navigationBarTranslucent</code>",id:"navigationbartranslucent",level:3},{value:"<code>enabled</code>",id:"enabled",level:3}],p={toc:c};function s(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"keyboardcontrollerview"},"KeyboardControllerView"),(0,o.kt)("p",null,"A plain react-native ",(0,o.kt)("inlineCode",{parentName:"p"},"View")," with some additional methods and props. Used internally in ",(0,o.kt)("a",{parentName:"p",href:"/react-native-keyboard-controller/pr-preview/pr-341/docs/next/api/keyboard-provider"},"KeyboardProvider")),(0,o.kt)("h2",{id:"props"},"Props"),(0,o.kt)("h3",{id:"onkeyboardmovestart"},(0,o.kt)("inlineCode",{parentName:"h3"},"onKeyboardMoveStart")),(0,o.kt)("p",null,"A callback function which is fired when keyboard starts a transition from one to another state (from closed to open, for example)."),(0,o.kt)("h3",{id:"onkeyboardmove"},(0,o.kt)("inlineCode",{parentName:"h3"},"onKeyboardMove")),(0,o.kt)("p",null,"A callback function which is fired every time, when keyboard changes its position on the screen."),(0,o.kt)("h3",{id:"onkeyboardmoveinteractive"},(0,o.kt)("inlineCode",{parentName:"h3"},"onKeyboardMoveInteractive")),(0,o.kt)("p",null,"A callback function which is fired every time, when user drags keyboard."),(0,o.kt)("h3",{id:"onkeyboardmoveend"},(0,o.kt)("inlineCode",{parentName:"h3"},"onKeyboardMoveEnd")),(0,o.kt)("p",null,"A callback function which is fired when keyboard finished a transition from one to another state (from closed to open, for example)."),(0,o.kt)("h3",{id:"onfocusedinputlayoutchanged"},(0,o.kt)("inlineCode",{parentName:"h3"},"onFocusedInputLayoutChanged")),(0,o.kt)("p",null,"A callback function which is fired when layout of focused input gets changed."),(0,o.kt)("h3",{id:"onfocusedinputtextchanged"},(0,o.kt)("inlineCode",{parentName:"h3"},"onFocusedInputTextChanged")),(0,o.kt)("p",null,"A callback function which is fired every time when user changes a text (types/deletes symbols)."),(0,o.kt)("h3",{id:"statusbartranslucent"},(0,o.kt)("inlineCode",{parentName:"h3"},"statusBarTranslucent")),(0,o.kt)("p",null,"A boolean prop to indicate whether ",(0,o.kt)("inlineCode",{parentName:"p"},"StatusBar")," should be translucent on ",(0,o.kt)("inlineCode",{parentName:"p"},"Android")," or not."),(0,o.kt)("h3",{id:"navigationbartranslucent"},(0,o.kt)("inlineCode",{parentName:"h3"},"navigationBarTranslucent")),(0,o.kt)("p",null,"A boolean prop to indicate whether ",(0,o.kt)("a",{parentName:"p",href:"https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar"},"NavigationBar")," should be translucent on ",(0,o.kt)("inlineCode",{parentName:"p"},"Android")," or not."),(0,o.kt)("h3",{id:"enabled"},(0,o.kt)("inlineCode",{parentName:"h3"},"enabled")),(0,o.kt)("p",null,"A boolean prop indicating whether the view is active or not. If it's ",(0,o.kt)("inlineCode",{parentName:"p"},"true")," then it moves application to ",(0,o.kt)("a",{parentName:"p",href:"https://developer.android.com/training/gestures/edge-to-edge"},"edge-to-edge")," mode on Android and setup keyboard callbacks. When ",(0,o.kt)("inlineCode",{parentName:"p"},"false")," - moves app away from ",(0,o.kt)("a",{parentName:"p",href:"https://developer.android.com/training/gestures/edge-to-edge"},"edge-to-edge")," and removes keyboard listeners."))}s.isMDXComponent=!0}}]);