"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9819],{54912:(e,o,r)=>{r.r(o),r.d(o,{assets:()=>s,contentTitle:()=>a,default:()=>p,frontMatter:()=>d,metadata:()=>i,toc:()=>l});var n=r(74848),t=r(28453);const d={sidebar_position:2,keywords:["react-native-keyboard-controller","KeyboardProvider"]},a="KeyboardProvider",i={id:"api/keyboard-provider",title:"KeyboardProvider",description:"KeyboardProvider should wrap your app. Under the hood it works with KeyboardControllerView to receive events during keyboard movements, maps these events to Animated/Reanimated values and store them in context.",source:"@site/versioned_docs/version-1.17.0/api/keyboard-provider.md",sourceDirName:"api",slug:"/api/keyboard-provider",permalink:"/react-native-keyboard-controller/pr-preview/pr-908/docs/api/keyboard-provider",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.17.0/api/keyboard-provider.md",tags:[],version:"1.17.0",sidebarPosition:2,frontMatter:{sidebar_position:2,keywords:["react-native-keyboard-controller","KeyboardProvider"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardToolbar",permalink:"/react-native-keyboard-controller/pr-preview/pr-908/docs/api/components/keyboard-toolbar/"},next:{title:"KeyboardControllerView",permalink:"/react-native-keyboard-controller/pr-preview/pr-908/docs/api/keyboard-controller-view"}},s={},l=[{value:"Props",id:"props",level:2},{value:'<code>statusBarTranslucent</code> <div class="label android"></div>',id:"statusbartranslucent-",level:3},{value:'<code>navigationBarTranslucent</code> <div class="label android"></div>',id:"navigationbartranslucent-",level:3},{value:'<code>preserveEdgeToEdge</code> <div class="label android"></div>',id:"preserveedgetoedge-",level:3},{value:"<code>enabled</code>",id:"enabled",level:3},{value:"Example",id:"example",level:2}];function c(e){const o={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.h1,{id:"keyboardprovider",children:"KeyboardProvider"}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsx)(o.code,{children:"KeyboardProvider"})," should wrap your app. Under the hood it works with ",(0,n.jsx)(o.code,{children:"KeyboardControllerView"})," to receive events during keyboard movements, maps these events to ",(0,n.jsx)(o.code,{children:"Animated"}),"/",(0,n.jsx)(o.code,{children:"Reanimated"})," values and store them in ",(0,n.jsx)(o.code,{children:"context"}),"."]}),"\n",(0,n.jsx)(o.h2,{id:"props",children:"Props"}),"\n",(0,n.jsxs)(o.h3,{id:"statusbartranslucent-",children:[(0,n.jsx)(o.code,{children:"statusBarTranslucent"})," ",(0,n.jsx)("div",{className:"label android"})]}),"\n",(0,n.jsxs)(o.p,{children:["A boolean prop to indicate whether ",(0,n.jsx)(o.code,{children:"StatusBar"})," should be translucent on ",(0,n.jsx)(o.code,{children:"Android"})," or not."]}),"\n",(0,n.jsx)(o.admonition,{title:"Important defaults",type:"caution",children:(0,n.jsxs)(o.p,{children:["By default this library stretches to full screen (",(0,n.jsx)(o.code,{children:"edge-to-edge"})," mode) and status bar becomes translucent. But the library tries to use standard RN app behavior and automatically applies padding from top to look like a standard RN app. If you use ",(0,n.jsx)(o.code,{children:"translucent"})," prop for ",(0,n.jsx)(o.code,{children:"StatusBar"})," component - it will not work anymore. You'll need to specify it on provider level. For more info ",(0,n.jsx)(o.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30",children:"see"})," this PR."]})}),"\n",(0,n.jsxs)(o.h3,{id:"navigationbartranslucent-",children:[(0,n.jsx)(o.code,{children:"navigationBarTranslucent"})," ",(0,n.jsx)("div",{className:"label android"})]}),"\n",(0,n.jsxs)(o.p,{children:["A boolean prop to indicate whether ",(0,n.jsx)(o.a,{href:"https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar",children:"NavigationBar"})," should be translucent on ",(0,n.jsx)(o.code,{children:"Android"})," or not."]}),"\n",(0,n.jsxs)(o.h3,{id:"preserveedgetoedge-",children:[(0,n.jsx)(o.code,{children:"preserveEdgeToEdge"})," ",(0,n.jsx)("div",{className:"label android"})]}),"\n",(0,n.jsxs)(o.p,{children:["A boolean property indicating whether to keep ",(0,n.jsx)(o.a,{href:"https://developer.android.com/develop/ui/views/layout/edge-to-edge",children:"edge-to-edge"})," mode always enabled (even when you disable the module). This is useful if you are using an external library to enable it and don't want this library to disable it."]}),"\n",(0,n.jsx)(o.admonition,{title:"Good to know",type:"info",children:(0,n.jsxs)(o.p,{children:["If you use ",(0,n.jsx)(o.a,{href:"https://github.com/zoontek/react-native-edge-to-edge",children:"react-native-edge-to-edge"}),", then ",(0,n.jsx)(o.code,{children:"statusBarTranslucent"}),", ",(0,n.jsx)(o.code,{children:"navigationBarTranslucent"})," and ",(0,n.jsx)(o.code,{children:"preserveEdgeToEdge"})," are automatically set to ",(0,n.jsx)(o.code,{children:"true"}),", so you don't need to worry about them."]})}),"\n",(0,n.jsx)(o.h3,{id:"enabled",children:(0,n.jsx)(o.code,{children:"enabled"})}),"\n",(0,n.jsxs)(o.p,{children:["A boolean prop indicating whether the module is enabled. It indicate only initial state, i. e. if you try to change this prop after component mount it will not have any effect. To change the property in runtime use ",(0,n.jsx)(o.a,{href:"/react-native-keyboard-controller/pr-preview/pr-908/docs/api/hooks/module/use-keyboard-controller",children:"useKeyboardController"})," hook and ",(0,n.jsx)(o.code,{children:"setEnabled"})," method. Defaults to ",(0,n.jsx)(o.code,{children:"true"}),"."]}),"\n",(0,n.jsxs)(o.p,{children:["Could be useful to set it to ",(0,n.jsx)(o.code,{children:"false"})," if you want to activate the module only on specific screens."]}),"\n",(0,n.jsx)(o.h2,{id:"example",children:"Example"}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-tsx",children:'import { KeyboardProvider } from "react-native-keyboard-controller";\n\nconst App = () => {\n  return (\n    <KeyboardProvider>\n      {/* The other components in your tree */}\n    </KeyboardProvider>\n  );\n};\n'})})]})}function p(e={}){const{wrapper:o}={...(0,t.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},28453:(e,o,r)=>{r.d(o,{R:()=>a,x:()=>i});var n=r(96540);const t={},d=n.createContext(t);function a(e){const o=n.useContext(d);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function i(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),n.createElement(d.Provider,{value:o},e.children)}}}]);