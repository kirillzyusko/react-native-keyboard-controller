"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8599],{17189:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>d});var t=n(74848),r=n(28453);const a={keywords:["react-native-keyboard-controller","useKeyboardController","enabled","disabled","setEnabled"]},s="useKeyboardController",i={id:"api/hooks/module/use-keyboard-controller",title:"useKeyboardController",description:"useKeyboardController is a hook which gives an access to the state of the react-native-keyboard-controller library. It return two values:",source:"@site/versioned_docs/version-1.13.0/api/hooks/module/use-keyboard-controller.md",sourceDirName:"api/hooks/module",slug:"/api/hooks/module/use-keyboard-controller",permalink:"/react-native-keyboard-controller/pr-preview/pr-646/docs/1.13.0/api/hooks/module/use-keyboard-controller",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.13.0/api/hooks/module/use-keyboard-controller.md",tags:[],version:"1.13.0",frontMatter:{keywords:["react-native-keyboard-controller","useKeyboardController","enabled","disabled","setEnabled"]},sidebar:"tutorialSidebar",previous:{title:"useReanimatedFocusedInput",permalink:"/react-native-keyboard-controller/pr-preview/pr-646/docs/1.13.0/api/hooks/input/use-reanimated-focused-input"},next:{title:"KeyboardAvoidingView",permalink:"/react-native-keyboard-controller/pr-preview/pr-646/docs/1.13.0/api/components/keyboard-avoiding-view"}},l={},d=[{value:"Example",id:"example",level:2},{value:"Using with class component",id:"using-with-class-component",level:2}];function c(e){const o={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.h1,{id:"usekeyboardcontroller",children:"useKeyboardController"}),"\n",(0,t.jsxs)(o.p,{children:[(0,t.jsx)(o.code,{children:"useKeyboardController"})," is a hook which gives an access to the state of the ",(0,t.jsx)(o.code,{children:"react-native-keyboard-controller"})," library. It return two values:"]}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsxs)(o.li,{children:[(0,t.jsx)(o.code,{children:"enabled"})," - boolean value which indicates whether the library is enabled in app;"]}),"\n",(0,t.jsxs)(o.li,{children:[(0,t.jsx)(o.code,{children:"setEnabled"})," - function that changes state of ",(0,t.jsx)(o.code,{children:"enabled"})," property."]}),"\n"]}),"\n",(0,t.jsxs)(o.p,{children:["This hook can be handy in situations when your app is relying on default window resizing behavior (",(0,t.jsx)(o.code,{children:"adjustResize"}),", for example) on Android. Once the module is enabled - it moves the app in ",(0,t.jsx)(o.a,{href:"https://developer.android.com/training/gestures/edge-to-edge",children:"edge-to-edge"})," and with ",(0,t.jsx)(o.code,{children:"adjustResize"})," mode it prevents a window from being resized (works as iOS). However if you need default Android ",(0,t.jsx)(o.code,{children:"adjustResize"})," behavior - you can disable this module where needed and make a gradual integration of this library into your application."]}),"\n",(0,t.jsxs)(o.admonition,{title:"Use it only when you really need it",type:"caution",children:[(0,t.jsx)(o.p,{children:"Nonetheless that you can fallback to default Android behavior I still strongly recommend you not to go with this approach just because you'll loose all attractiveness of smooth animated keyboard transitions and your app will not look as great as it possibly can."}),(0,t.jsxs)(o.p,{children:["Consider to use ",(0,t.jsx)(o.a,{href:"/react-native-keyboard-controller/pr-preview/pr-646/docs/1.13.0/api/components/keyboard-avoiding-view",children:"KeyboardAvoidingView"})," which also resize the window, but does it with beautiful animated transitions that makes your interactions with app smooth and pleasant."]})]}),"\n",(0,t.jsx)(o.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-tsx",children:'import { useKeyboardController } from "react-native-keyboard-controller";\n\nconst { enabled, setEnabled } = useKeyboardController();\n\nsetEnabled(false);\n'})}),"\n",(0,t.jsxs)(o.p,{children:["Also have a look on ",(0,t.jsx)(o.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example",children:"example"})," app for more comprehensive usage."]}),"\n",(0,t.jsx)(o.h2,{id:"using-with-class-component",children:"Using with class component"}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-tsx",children:'import {\n  KeyboardController,\n  KeyboardContext,\n  AndroidSoftInputModes,\n} from "react-native-keyboard-controller";\n\nclass KeyboardAnimation extends React.PureComponent {\n  // 1. use context value\n  static contextType = KeyboardContext;\n\n  componentDidMount() {\n    // 2. get an access to `enabled` and `setEnabled` props\n    const { enabled, setEnabled } = this.context;\n\n    // 3. disable a module on demand in your app\n    setEnabled(false);\n  }\n}\n'})})]})}function u(e={}){const{wrapper:o}={...(0,r.R)(),...e.components};return o?(0,t.jsx)(o,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},28453:(e,o,n)=>{n.d(o,{R:()=>s,x:()=>i});var t=n(96540);const r={},a=t.createContext(r);function s(e){const o=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function i(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),t.createElement(a.Provider,{value:o},e.children)}}}]);