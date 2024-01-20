"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2116],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=s(n),m=a,h=d["".concat(u,".").concat(m)]||d[m]||p[m]||o;return n?r.createElement(h,i(i({ref:t},c),{},{components:n})):r.createElement(h,i({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7250:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>s});var r=n(7462),a=(n(7294),n(3905));const o={keywords:["react-native","react native","react-native-keyboard-controller","useFocusedInputHandler","onTextChanged","onChangeText","input interceptor","react-native-reanimated","worklet","react hook"]},i="useFocusedInputHandler",l={unversionedId:"api/hooks/input/use-focused-input-handler",id:"api/hooks/input/use-focused-input-handler",title:"useFocusedInputHandler",description:"useFocusedInputHandler is a hook that allows to intercept events from a focused TextInput.",source:"@site/docs/api/hooks/input/use-focused-input-handler.md",sourceDirName:"api/hooks/input",slug:"/api/hooks/input/use-focused-input-handler",permalink:"/react-native-keyboard-controller/pr-preview/pr-341/docs/next/api/hooks/input/use-focused-input-handler",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/docs/api/hooks/input/use-focused-input-handler.md",tags:[],version:"current",frontMatter:{keywords:["react-native","react native","react-native-keyboard-controller","useFocusedInputHandler","onTextChanged","onChangeText","input interceptor","react-native-reanimated","worklet","react hook"]},sidebar:"tutorialSidebar",previous:{title:"useReanimatedKeyboardAnimation",permalink:"/react-native-keyboard-controller/pr-preview/pr-341/docs/next/api/hooks/keyboard/use-reanimated-keyboard-animation"},next:{title:"useReanimatedFocusedInput",permalink:"/react-native-keyboard-controller/pr-preview/pr-341/docs/next/api/hooks/input/use-reanimated-focused-input"}},u={},s=[{value:"Example",id:"example",level:2},{value:"Handlers",id:"handlers",level:2},{value:"<code>onChangeText</code>",id:"onchangetext",level:3},{value:"Known issues",id:"known-issues",level:2}],c={toc:s};function p(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"usefocusedinputhandler"},"useFocusedInputHandler"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"useFocusedInputHandler")," is a hook that allows to intercept events from a focused ",(0,a.kt)("inlineCode",{parentName:"p"},"TextInput"),"."),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'useFocusedInputHandler(\n  {\n    onChangeText: ({ text }) => {\n      "worklet";\n    },\n  },\n  [],\n);\n')),(0,a.kt)("h2",{id:"handlers"},"Handlers"),(0,a.kt)("h3",{id:"onchangetext"},(0,a.kt)("inlineCode",{parentName:"h3"},"onChangeText")),(0,a.kt)("p",null,"Fires an event whenever user changes text in focused ",(0,a.kt)("inlineCode",{parentName:"p"},"TextInput")," (i. e. adds or deletes symbols). Event has following structure:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"type FocusedInputTextChangedEvent = {\n  text: string;\n};\n")),(0,a.kt)("p",null,"This handler can be handy when you need to have an access to what user typed on a global level (i. e. when you don't have a direct access to your ",(0,a.kt)("inlineCode",{parentName:"p"},"TextInput"),"), for example:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"you develop a generic component for any kind of avoidance focused inputs (i. e. ",(0,a.kt)("inlineCode",{parentName:"li"},"AwareScrollView"),") that doesn't have an access to child ",(0,a.kt)("inlineCode",{parentName:"li"},"TextInputs")," by design;"),(0,a.kt)("li",{parentName:"ul"},"you track user activity on the screen and if there is no activity for certain period of time then you do a certain action (logout for example). If you want to reset timer when user interacts with a keyboard - usage of this hook can be a good choice.")),(0,a.kt)("h2",{id:"known-issues"},"Known issues"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/react-native-text-input-mask/react-native-text-input-mask/pull/305"},"react-native-text-input-mask#305"),": ",(0,a.kt)("inlineCode",{parentName:"li"},"onChangeText")," handler ignores an input from ",(0,a.kt)("inlineCode",{parentName:"li"},"react-native-text-input-mask")," on ",(0,a.kt)("inlineCode",{parentName:"li"},"iOS"))))}p.isMDXComponent=!0}}]);