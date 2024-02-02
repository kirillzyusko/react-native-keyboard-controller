"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8740],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>v});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=o.createContext({}),c=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=c(e.components);return o.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},u=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,s=d(e,["components","mdxType","originalType","parentName"]),u=c(n),v=r,b=u["".concat(l,".").concat(v)]||u[v]||p[v]||a;return n?o.createElement(b,i(i({ref:t},s),{},{components:n})):o.createElement(b,i({ref:t},s))}));function v(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=u;var d={};for(var l in t)hasOwnProperty.call(t,l)&&(d[l]=t[l]);d.originalType=e,d.mdxType="string"==typeof e?e:r,i[1]=d;for(var c=2;c<a;c++)i[c]=n[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5732:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>d,toc:()=>c});var o=n(7462),r=(n(7294),n(3905));const a={sidebar_position:3,keywords:["react-native-keyboard-controller","KeyboardControllerView","view"]},i="KeyboardControllerView",d={unversionedId:"api/keyboard-controller-view",id:"version-1.10.0/api/keyboard-controller-view",title:"KeyboardControllerView",description:"A plain react-native View with some additional methods and props. Used internally in KeyboardProvider",source:"@site/versioned_docs/version-1.10.0/api/keyboard-controller-view.md",sourceDirName:"api",slug:"/api/keyboard-controller-view",permalink:"/react-native-keyboard-controller/docs/api/keyboard-controller-view",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.10.0/api/keyboard-controller-view.md",tags:[],version:"1.10.0",sidebarPosition:3,frontMatter:{sidebar_position:3,keywords:["react-native-keyboard-controller","KeyboardControllerView","view"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardProvider",permalink:"/react-native-keyboard-controller/docs/api/keyboard-provider"},next:{title:"KeyboardGestureArea",permalink:"/react-native-keyboard-controller/docs/api/keyboard-gesture-area"}},l={},c=[{value:"Props",id:"props",level:2},{value:"<code>onKeyboardMoveStart</code>",id:"onkeyboardmovestart",level:3},{value:"<code>onKeyboardMove</code>",id:"onkeyboardmove",level:3},{value:"<code>onKeyboardMoveInteractive</code>",id:"onkeyboardmoveinteractive",level:3},{value:"<code>onKeyboardMoveEnd</code>",id:"onkeyboardmoveend",level:3},{value:"<code>onFocusedInputLayoutChanged</code>",id:"onfocusedinputlayoutchanged",level:3},{value:"<code>onFocusedInputTextChanged</code>",id:"onfocusedinputtextchanged",level:3},{value:"<code>statusBarTranslucent</code>",id:"statusbartranslucent",level:3},{value:"<code>navigationBarTranslucent</code>",id:"navigationbartranslucent",level:3},{value:"<code>enabled</code>",id:"enabled",level:3}],s={toc:c};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"keyboardcontrollerview"},"KeyboardControllerView"),(0,r.kt)("p",null,"A plain react-native ",(0,r.kt)("inlineCode",{parentName:"p"},"View")," with some additional methods and props. Used internally in ",(0,r.kt)("a",{parentName:"p",href:"/react-native-keyboard-controller/docs/api/keyboard-provider"},"KeyboardProvider")),(0,r.kt)("h2",{id:"props"},"Props"),(0,r.kt)("h3",{id:"onkeyboardmovestart"},(0,r.kt)("inlineCode",{parentName:"h3"},"onKeyboardMoveStart")),(0,r.kt)("p",null,"A callback function which is fired when keyboard starts a transition from one to another state (from closed to open, for example)."),(0,r.kt)("h3",{id:"onkeyboardmove"},(0,r.kt)("inlineCode",{parentName:"h3"},"onKeyboardMove")),(0,r.kt)("p",null,"A callback function which is fired every time, when keyboard changes its position on the screen."),(0,r.kt)("h3",{id:"onkeyboardmoveinteractive"},(0,r.kt)("inlineCode",{parentName:"h3"},"onKeyboardMoveInteractive")),(0,r.kt)("p",null,"A callback function which is fired every time, when user drags keyboard."),(0,r.kt)("h3",{id:"onkeyboardmoveend"},(0,r.kt)("inlineCode",{parentName:"h3"},"onKeyboardMoveEnd")),(0,r.kt)("p",null,"A callback function which is fired when keyboard finished a transition from one to another state (from closed to open, for example)."),(0,r.kt)("h3",{id:"onfocusedinputlayoutchanged"},(0,r.kt)("inlineCode",{parentName:"h3"},"onFocusedInputLayoutChanged")),(0,r.kt)("p",null,"A callback function which is fired when layout of focused input gets changed."),(0,r.kt)("h3",{id:"onfocusedinputtextchanged"},(0,r.kt)("inlineCode",{parentName:"h3"},"onFocusedInputTextChanged")),(0,r.kt)("p",null,"A callback function which is fired every time when user changes a text (types/deletes symbols)."),(0,r.kt)("h3",{id:"statusbartranslucent"},(0,r.kt)("inlineCode",{parentName:"h3"},"statusBarTranslucent")),(0,r.kt)("p",null,"A boolean prop to indicate whether ",(0,r.kt)("inlineCode",{parentName:"p"},"StatusBar")," should be translucent on ",(0,r.kt)("inlineCode",{parentName:"p"},"Android")," or not."),(0,r.kt)("h3",{id:"navigationbartranslucent"},(0,r.kt)("inlineCode",{parentName:"h3"},"navigationBarTranslucent")),(0,r.kt)("p",null,"A boolean prop to indicate whether ",(0,r.kt)("a",{parentName:"p",href:"https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar"},"NavigationBar")," should be translucent on ",(0,r.kt)("inlineCode",{parentName:"p"},"Android")," or not."),(0,r.kt)("h3",{id:"enabled"},(0,r.kt)("inlineCode",{parentName:"h3"},"enabled")),(0,r.kt)("p",null,"A boolean prop indicating whether the view is active or not. If it's ",(0,r.kt)("inlineCode",{parentName:"p"},"true")," then it moves application to ",(0,r.kt)("a",{parentName:"p",href:"https://developer.android.com/training/gestures/edge-to-edge"},"edge-to-edge")," mode on Android and setup keyboard callbacks. When ",(0,r.kt)("inlineCode",{parentName:"p"},"false")," - moves app away from ",(0,r.kt)("a",{parentName:"p",href:"https://developer.android.com/training/gestures/edge-to-edge"},"edge-to-edge")," and removes keyboard listeners."))}p.isMDXComponent=!0}}]);