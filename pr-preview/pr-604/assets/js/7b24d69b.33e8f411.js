"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5501],{21900:(e,r,o)=>{o.r(r),o.d(r,{assets:()=>s,contentTitle:()=>d,default:()=>p,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var t=o(74848),n=o(28453);const a={},d="KeyboardProvider",i={id:"api/keyboard-provider",title:"KeyboardProvider",description:"KeyboardProvider should wrap your app. Under the hood it works with KeyboardControllerView to receive events during keyboard movements, maps these events to Animated/Reanimated values and store them in context.",source:"@site/versioned_docs/version-1.0.0/api/keyboard-provider.md",sourceDirName:"api",slug:"/api/keyboard-provider",permalink:"/react-native-keyboard-controller/pr-preview/pr-604/docs/1.0.0/api/keyboard-provider",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.0.0/api/keyboard-provider.md",tags:[],version:"1.0.0",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"KeyboardEvents",permalink:"/react-native-keyboard-controller/pr-preview/pr-604/docs/1.0.0/api/keyboard-events"}},s={},l=[{value:"Props",id:"props",level:2},{value:'<code>statusBarTranslucent</code> <div class="label android"></div>',id:"statusbartranslucent-",level:3},{value:"Example",id:"example",level:2}];function c(e){const r={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.h1,{id:"keyboardprovider",children:"KeyboardProvider"}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.code,{children:"KeyboardProvider"})," should wrap your app. Under the hood it works with ",(0,t.jsx)(r.code,{children:"KeyboardControllerView"})," to receive events during keyboard movements, maps these events to ",(0,t.jsx)(r.code,{children:"Animated"}),"/",(0,t.jsx)(r.code,{children:"Reanimated"})," values and store them in ",(0,t.jsx)(r.code,{children:"context"}),"."]}),"\n",(0,t.jsx)(r.h2,{id:"props",children:"Props"}),"\n",(0,t.jsxs)(r.h3,{id:"statusbartranslucent-",children:[(0,t.jsx)(r.code,{children:"statusBarTranslucent"})," ",(0,t.jsx)("div",{className:"label android"})]}),"\n",(0,t.jsxs)(r.p,{children:["A boolean prop to indicate whether ",(0,t.jsx)(r.code,{children:"StatusBar"})," should be translucent on ",(0,t.jsx)(r.code,{children:"Android"})," or not."]}),"\n",(0,t.jsx)(r.admonition,{title:"Important defaults",type:"caution",children:(0,t.jsxs)(r.p,{children:["By default this library stretches to full screen (",(0,t.jsx)(r.code,{children:"edge-to-edge"})," mode) and status bar becomes translucent. But the library tries to use standard RN app behavior and automatically applies padding from top to look like a standard RN app. If you use ",(0,t.jsx)(r.code,{children:"translucent"})," prop for ",(0,t.jsx)(r.code,{children:"StatusBar"})," component - it will not work anymore. You'll need to specify it on provider level. For more info ",(0,t.jsx)(r.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30",children:"see"})," this PR."]})}),"\n",(0,t.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-tsx",children:'import { KeyboardProvider } from "react-native-keyboard-controller";\n\nconst App = () => {\n  return (\n    <KeyboardProvider>\n      {/* The other components in your tree */}\n    </KeyboardProvider>\n  );\n};\n'})})]})}function p(e={}){const{wrapper:r}={...(0,n.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},28453:(e,r,o)=>{o.d(r,{R:()=>d,x:()=>i});var t=o(96540);const n={},a=t.createContext(n);function d(e){const r=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function i(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:d(e.components),t.createElement(a.Provider,{value:r},e.children)}}}]);