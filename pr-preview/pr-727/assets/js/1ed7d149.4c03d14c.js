"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9330],{48220:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>s,contentTitle:()=>a,default:()=>p,frontMatter:()=>t,metadata:()=>d,toc:()=>l});var o=i(74848),r=i(28453);const t={sidebar_position:1},a="Installation",d={id:"installation",title:"Installation",description:"Adding a library to the project",source:"@site/versioned_docs/version-1.0.0/installation.md",sourceDirName:".",slug:"/installation",permalink:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.0.0/installation",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.0.0/installation.md",tags:[],version:"1.0.0",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Guides",permalink:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.0.0/category/guides"}},s={},l=[{value:"Adding a library to the project",id:"adding-a-library-to-the-project",level:2},{value:"Linking",id:"linking",level:3},{value:"Expo",id:"expo",level:3},{value:"Adding provider",id:"adding-provider",level:2},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"Incompatible <code>kotlinVersion</code> and failed Android builds",id:"incompatible-kotlinversion-and-failed-android-builds",level:3},{value:"react-native or expo bare workflow",id:"react-native-or-expo-bare-workflow",level:4},{value:"Expo managed workflow",id:"expo-managed-workflow",level:4},{value:"Swift support",id:"swift-support",level:3}];function c(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"installation",children:"Installation"}),"\n",(0,o.jsx)(n.h2,{id:"adding-a-library-to-the-project",children:"Adding a library to the project"}),"\n",(0,o.jsxs)(n.p,{children:["Install the ",(0,o.jsx)(n.code,{children:"react-native-keyboard-controller"})," package in your React Native project."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"yarn add react-native-keyboard-controller\n# or with npm\n# npm install react-native-keyboard-controller --save\n"})}),"\n",(0,o.jsxs)(n.admonition,{type:"warning",children:[(0,o.jsxs)(n.mdxAdmonitionTitle,{children:["Mandatory ",(0,o.jsx)(n.code,{children:"react-native-reanimated"})," dependency"]}),(0,o.jsxs)(n.p,{children:["This library requires ",(0,o.jsx)(n.code,{children:"react-native-reanimated"})," to work properly. If you don't have it in your project, you need to follow ",(0,o.jsx)(n.a,{href:"https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation",children:"installation guide"})," and install it in your project before using this library."]})]}),"\n",(0,o.jsx)(n.h3,{id:"linking",children:"Linking"}),"\n",(0,o.jsxs)(n.p,{children:["This package supports ",(0,o.jsx)(n.a,{href:"https://github.com/react-native-community/cli/blob/master/docs/autolinking.md",children:"autolinking"}),"."]}),"\n",(0,o.jsx)(n.admonition,{title:"Pods update",type:"tip",children:(0,o.jsxs)(n.p,{children:["Don't forget to re-install ",(0,o.jsx)(n.code,{children:"pods"})," after adding the package and don't forget to re-assemble ",(0,o.jsx)(n.code,{children:"android"})," and ",(0,o.jsx)(n.code,{children:"ios"})," applications, since this library contains native code."]})}),"\n",(0,o.jsx)(n.h3,{id:"expo",children:"Expo"}),"\n",(0,o.jsxs)(n.p,{children:["This library has native code, so it does not work with ",(0,o.jsx)(n.em,{children:"Expo Go"})," but you can easily install it using a ",(0,o.jsx)(n.a,{href:"https://docs.expo.dev/development/getting-started/",children:"custom dev client"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"adding-provider",children:"Adding provider"}),"\n",(0,o.jsxs)(n.p,{children:["In order to use it you'll need to wrap your app with ",(0,o.jsx)(n.code,{children:"KeyboardProvider"})," component."]}),"\n",(0,o.jsx)(n.admonition,{title:"Why it's needed?",type:"info",children:(0,o.jsxs)(n.p,{children:["If you are bothered why it's needed, you can read more about it in ",(0,o.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.0.0/recipes/platform-differences",children:"architecture"})," deep dive to understand all aspects of how this library works."]})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:'import { KeyboardProvider } from "react-native-keyboard-controller";\n\nexport default function App() {\n  return (\n    <KeyboardProvider>\n      {/* your main application code goes here */}\n    </KeyboardProvider>\n  );\n}\n'})}),"\n",(0,o.jsxs)(n.p,{children:["Congratulations! \ud83c\udf89 You've just finished installation process. Go to the ",(0,o.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.0.0/guides/first-animation",children:"next section"})," to get more insights of what you can do using this library. \ud83d\ude0e"]}),"\n",(0,o.jsx)(n.h2,{id:"troubleshooting",children:"Troubleshooting"}),"\n",(0,o.jsxs)(n.h3,{id:"incompatible-kotlinversion-and-failed-android-builds",children:["Incompatible ",(0,o.jsx)(n.code,{children:"kotlinVersion"})," and failed Android builds"]}),"\n",(0,o.jsx)(n.p,{children:"Sometimes you may see failed Android builds complaining that your version of kotlin is lower than expected version."}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.code,{children:"error: module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.6.0, expected version is 1.4.1."})}),"\n",(0,o.jsx)(n.p,{children:"To overcome this issue you will need to set higher version of the kotlin:"}),"\n",(0,o.jsx)(n.h4,{id:"react-native-or-expo-bare-workflow",children:"react-native or expo bare workflow"}),"\n",(0,o.jsxs)(n.p,{children:["You need to modify ",(0,o.jsx)(n.code,{children:"android/build.gradle"})," and specify correct ",(0,o.jsx)(n.code,{children:"kotlinVersion"}),":"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-java",children:'buildscript {\n    ext {\n        kotlinVersion = "1.6.21"\n    }\n}\n'})}),"\n",(0,o.jsxs)(n.p,{children:["For more information please, see how it's configured in ",(0,o.jsx)(n.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/blob/9d0e63712a2f55dab0f6f3f95398567bb9ca1efa/example/android/build.gradle#L9",children:"example"})," project."]}),"\n",(0,o.jsx)(n.h4,{id:"expo-managed-workflow",children:"Expo managed workflow"}),"\n",(0,o.jsxs)(n.p,{children:["If you are using Expo managed workflow you need to install ",(0,o.jsx)(n.code,{children:"expo-build-properties"})]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-sh",children:"npx expo install expo-build-properties\n"})}),"\n",(0,o.jsxs)(n.p,{children:["And add plugin inside of your ",(0,o.jsx)(n.code,{children:"app.json"})," or ",(0,o.jsx)(n.code,{children:"app.config.js"})," with following configuration:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-json",children:'{\n  "expo": {\n    "plugins": [\n      [\n        "expo-build-properties",\n        {\n          "android": {\n            "kotlinVersion": "1.6.21"\n          }\n        }\n      ]\n    ]\n  }\n}\n'})}),"\n",(0,o.jsx)(n.h3,{id:"swift-support",children:"Swift support"}),"\n",(0,o.jsxs)(n.p,{children:["Since part of this library is written using ",(0,o.jsx)(n.code,{children:"swift"})," language - your project needs to support it. For that you can create empty ",(0,o.jsx)(n.code,{children:".swift"})," file with bridging header. See this ",(0,o.jsx)(n.a,{href:"https://stackoverflow.com/a/56176956/9272042",children:"step-by-step"})," guide if you have problems."]})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},28453:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>d});var o=i(96540);const r={},t=o.createContext(r);function a(e){const n=o.useContext(t);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),o.createElement(t.Provider,{value:n},e.children)}}}]);