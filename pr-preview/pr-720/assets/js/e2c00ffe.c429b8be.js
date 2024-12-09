"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2186],{78897:(e,o,i)=>{i.r(o),i.d(o,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>c});var n=i(74848),r=i(28453);const t={sidebar_position:5,description:"Troubleshooting guide",keywords:["react-native-keyboard-controller","troubleshooting"]},s="Troubleshooting",a={id:"troubleshooting",title:"Troubleshooting",description:"Troubleshooting guide",source:"@site/versioned_docs/version-1.14.0/troubleshooting.md",sourceDirName:".",slug:"/troubleshooting",permalink:"/react-native-keyboard-controller/pr-preview/pr-720/docs/troubleshooting",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.14.0/troubleshooting.md",tags:[],version:"1.14.0",sidebarPosition:5,frontMatter:{sidebar_position:5,description:"Troubleshooting guide",keywords:["react-native-keyboard-controller","troubleshooting"]},sidebar:"tutorialSidebar",previous:{title:"OverKeyboardView",permalink:"/react-native-keyboard-controller/pr-preview/pr-720/docs/api/over-keyboard-view/"},next:{title:"FAQ",permalink:"/react-native-keyboard-controller/pr-preview/pr-720/docs/faq"}},l={},c=[{value:"Incompatible <code>kotlinVersion</code> and failed Android builds",id:"incompatible-kotlinversion-and-failed-android-builds",level:2},{value:"<code>react-native</code> or <code>expo</code> bare workflow",id:"react-native-or-expo-bare-workflow",level:3},{value:"<code>Expo</code> managed workflow",id:"expo-managed-workflow",level:3},{value:"Swift support",id:"swift-support",level:2},{value:"Animations frame drops",id:"animations-frame-drops",level:2},{value:"<code>MutexLockWithTimeout</code> C++ exception",id:"mutexlockwithtimeout-c-exception",level:2}];function d(e){const o={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.h1,{id:"troubleshooting",children:"Troubleshooting"}),"\n",(0,n.jsxs)(o.p,{children:["This section attempts to outline issues that users frequently encounter when first getting accustomed to using ",(0,n.jsx)(o.code,{children:"react-native-keyboard-controller"}),". These issues may or may not be related to ",(0,n.jsx)(o.code,{children:"react-native-keyboard-controller"}),"."]}),"\n",(0,n.jsxs)(o.h2,{id:"incompatible-kotlinversion-and-failed-android-builds",children:["Incompatible ",(0,n.jsx)(o.code,{children:"kotlinVersion"})," and failed Android builds"]}),"\n",(0,n.jsx)(o.p,{children:"Sometimes you may see failed Android builds complaining that your version of kotlin is lower than expected version."}),"\n",(0,n.jsx)(o.p,{children:(0,n.jsx)(o.code,{children:"error: module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.6.0, expected version is 1.4.1."})}),"\n",(0,n.jsx)(o.p,{children:"To overcome this issue you will need to set higher version of the kotlin:"}),"\n",(0,n.jsxs)(o.h3,{id:"react-native-or-expo-bare-workflow",children:[(0,n.jsx)(o.code,{children:"react-native"})," or ",(0,n.jsx)(o.code,{children:"expo"})," bare workflow"]}),"\n",(0,n.jsxs)(o.p,{children:["You need to modify ",(0,n.jsx)(o.code,{children:"android/build.gradle"})," and specify correct ",(0,n.jsx)(o.code,{children:"kotlinVersion"}),":"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-java",children:'buildscript {\n    ext {\n        kotlinVersion = "1.6.21"\n    }\n}\n'})}),"\n",(0,n.jsxs)(o.p,{children:["For more information please, see how it's configured in ",(0,n.jsx)(o.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/blob/9d0e63712a2f55dab0f6f3f95398567bb9ca1efa/example/android/build.gradle#L9",children:"example"})," project."]}),"\n",(0,n.jsxs)(o.h3,{id:"expo-managed-workflow",children:[(0,n.jsx)(o.code,{children:"Expo"})," managed workflow"]}),"\n",(0,n.jsxs)(o.p,{children:["If you are using Expo managed workflow you need to install ",(0,n.jsx)(o.code,{children:"expo-build-properties"})]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-sh",children:"npx expo install expo-build-properties\n"})}),"\n",(0,n.jsxs)(o.p,{children:["And add plugin inside of your ",(0,n.jsx)(o.code,{children:"app.json"})," or ",(0,n.jsx)(o.code,{children:"app.config.js"})," with following configuration:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-json",children:'{\n  "expo": {\n    "plugins": [\n      [\n        "expo-build-properties",\n        {\n          "android": {\n            "kotlinVersion": "1.6.21"\n          }\n        }\n      ]\n    ]\n  }\n}\n'})}),"\n",(0,n.jsx)(o.h2,{id:"swift-support",children:"Swift support"}),"\n",(0,n.jsxs)(o.p,{children:["Since part of this library is written using ",(0,n.jsx)(o.code,{children:"swift"})," language - your project needs to support it. For that you can create empty ",(0,n.jsx)(o.code,{children:".swift"})," file with bridging header. See this ",(0,n.jsx)(o.a,{href:"https://stackoverflow.com/a/56176956/9272042",children:"step-by-step"})," guide if you have problems."]}),"\n",(0,n.jsx)(o.h2,{id:"animations-frame-drops",children:"Animations frame drops"}),"\n",(0,n.jsxs)(o.p,{children:["Sometimes you may see that animation performance is poor. If you are using ",(0,n.jsx)(o.code,{children:"sentry@5"})," make sure ",(0,n.jsx)(o.code,{children:"enableStallTracking"})," is disabled (i. e. ",(0,n.jsx)(o.code,{children:"enableStallTracking: false"}),") or upgrade to ",(0,n.jsx)(o.code,{children:"sentry@6"}),","]}),"\n",(0,n.jsxs)(o.p,{children:["See ",(0,n.jsx)(o.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/641",children:"this issue"})," for more details."]}),"\n",(0,n.jsxs)(o.h2,{id:"mutexlockwithtimeout-c-exception",children:[(0,n.jsx)(o.code,{children:"MutexLockWithTimeout"})," C++ exception"]}),"\n",(0,n.jsxs)(o.p,{children:["This exception is thrown when you are trying to use ",(0,n.jsx)(o.code,{children:"KeyboardProvider"})," or ",(0,n.jsx)(o.code,{children:"KeyboardAwareScrollView"})," on Android with the new architecture enabled. A top of stacktrace will look like this:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-bash",children:"NonPI::MutexLockWithTimeout at line 384 within libc\noffset 726000) (std::__ndk1::mutex::lock at line 12 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::Binding::schedulerDidFinishTransaction at line 84 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::Scheduler::uiManagerDidFinishTransaction at line 68 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::UIManager::shadowTreeDidFinishTransaction const at line 64 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::ShadowTree::mount const at line 348 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::ShadowTree::tryCommit const at line 2612 within split_config.arm64_v8a.apk\n"})}),"\n",(0,n.jsx)(o.p,{children:"You have two ways to fix this problem:"}),"\n",(0,n.jsxs)(o.ul,{children:["\n",(0,n.jsxs)(o.li,{children:["enable ",(0,n.jsx)(o.code,{children:"allowRecursiveCommitsWithSynchronousMountOnAndroid"})," feature flag (see ",(0,n.jsx)(o.a,{href:"https://github.com/software-mansion/react-native-reanimated/issues/6418#issuecomment-2296107100",children:"react-native-reanimated#6418"})," and ",(0,n.jsx)(o.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/687",children:"react-native-keyboard-controller"}),")"]}),"\n",(0,n.jsxs)(o.li,{children:["upgrade to ",(0,n.jsx)(o.code,{children:"react-native@0.77+"})," (starting from this version this flag is enabled by default)."]}),"\n"]})]})}function h(e={}){const{wrapper:o}={...(0,r.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},28453:(e,o,i)=>{i.d(o,{R:()=>s,x:()=>a});var n=i(96540);const r={},t=n.createContext(r);function s(e){const o=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function a(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),n.createElement(t.Provider,{value:o},e.children)}}}]);