"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4836],{48260:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>a,contentTitle:()=>s,default:()=>h,frontMatter:()=>t,metadata:()=>l,toc:()=>d});var i=o(74848),r=o(28453);const t={sidebar_position:5,description:"Troubleshooting guide",keywords:["react-native-keyboard-controller","troubleshooting"]},s="Troubleshooting",l={id:"troubleshooting",title:"Troubleshooting",description:"Troubleshooting guide",source:"@site/versioned_docs/version-1.17.0/troubleshooting.md",sourceDirName:".",slug:"/troubleshooting",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/docs/troubleshooting",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.17.0/troubleshooting.md",tags:[],version:"1.17.0",sidebarPosition:5,frontMatter:{sidebar_position:5,description:"Troubleshooting guide",keywords:["react-native-keyboard-controller","troubleshooting"]},sidebar:"tutorialSidebar",previous:{title:"OverKeyboardView",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/docs/api/over-keyboard-view/"},next:{title:"FAQ",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/docs/faq"}},a={},d=[{value:"Incompatible <code>kotlinVersion</code> and failed Android builds",id:"incompatible-kotlinversion-and-failed-android-builds",level:2},{value:"<code>react-native</code> or <code>expo</code> bare workflow",id:"react-native-or-expo-bare-workflow",level:3},{value:"<code>Expo</code> managed workflow",id:"expo-managed-workflow",level:3},{value:"Swift support",id:"swift-support",level:2},{value:"Animations frame drops",id:"animations-frame-drops",level:2},{value:"<code>MutexLockWithTimeout</code> C++ exception",id:"mutexlockwithtimeout-c-exception",level:2},{value:"Filename longer than 260 characters",id:"filename-longer-than-260-characters",level:2}];function c(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"troubleshooting",children:"Troubleshooting"}),"\n",(0,i.jsxs)(n.p,{children:["This section attempts to outline issues that users frequently encounter when first getting accustomed to using ",(0,i.jsx)(n.code,{children:"react-native-keyboard-controller"}),". These issues may or may not be related to ",(0,i.jsx)(n.code,{children:"react-native-keyboard-controller"}),"."]}),"\n",(0,i.jsxs)(n.h2,{id:"incompatible-kotlinversion-and-failed-android-builds",children:["Incompatible ",(0,i.jsx)(n.code,{children:"kotlinVersion"})," and failed Android builds"]}),"\n",(0,i.jsx)(n.p,{children:"Sometimes you may see failed Android builds complaining that your version of kotlin is lower than expected version."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.code,{children:"error: module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.6.0, expected version is 1.4.1."})}),"\n",(0,i.jsx)(n.p,{children:"To overcome this issue you will need to set higher version of the kotlin:"}),"\n",(0,i.jsxs)(n.h3,{id:"react-native-or-expo-bare-workflow",children:[(0,i.jsx)(n.code,{children:"react-native"})," or ",(0,i.jsx)(n.code,{children:"expo"})," bare workflow"]}),"\n",(0,i.jsxs)(n.p,{children:["You need to modify ",(0,i.jsx)(n.code,{children:"android/build.gradle"})," and specify correct ",(0,i.jsx)(n.code,{children:"kotlinVersion"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-java",children:'buildscript {\n    ext {\n        kotlinVersion = "1.6.21"\n    }\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["For more information please, see how it's configured in ",(0,i.jsx)(n.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/blob/9d0e63712a2f55dab0f6f3f95398567bb9ca1efa/example/android/build.gradle#L9",children:"example"})," project."]}),"\n",(0,i.jsxs)(n.h3,{id:"expo-managed-workflow",children:[(0,i.jsx)(n.code,{children:"Expo"})," managed workflow"]}),"\n",(0,i.jsxs)(n.p,{children:["If you are using Expo managed workflow you need to install ",(0,i.jsx)(n.code,{children:"expo-build-properties"})]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"npx expo install expo-build-properties\n"})}),"\n",(0,i.jsxs)(n.p,{children:["And add plugin inside of your ",(0,i.jsx)(n.code,{children:"app.json"})," or ",(0,i.jsx)(n.code,{children:"app.config.js"})," with following configuration:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "expo": {\n    "plugins": [\n      [\n        "expo-build-properties",\n        {\n          "android": {\n            "kotlinVersion": "1.6.21"\n          }\n        }\n      ]\n    ]\n  }\n}\n'})}),"\n",(0,i.jsx)(n.h2,{id:"swift-support",children:"Swift support"}),"\n",(0,i.jsxs)(n.p,{children:["Since part of this library is written using ",(0,i.jsx)(n.code,{children:"swift"})," language - your project needs to support it. For that you can create empty ",(0,i.jsx)(n.code,{children:".swift"})," file with bridging header. See this ",(0,i.jsx)(n.a,{href:"https://stackoverflow.com/a/56176956/9272042",children:"step-by-step"})," guide if you have problems."]}),"\n",(0,i.jsx)(n.h2,{id:"animations-frame-drops",children:"Animations frame drops"}),"\n",(0,i.jsxs)(n.p,{children:["Sometimes you may see that animation performance is poor. If you are using ",(0,i.jsx)(n.code,{children:"sentry@5"})," make sure ",(0,i.jsx)(n.code,{children:"enableStallTracking"})," is disabled (i. e. ",(0,i.jsx)(n.code,{children:"enableStallTracking: false"}),") or upgrade to ",(0,i.jsx)(n.code,{children:"sentry@6"}),","]}),"\n",(0,i.jsxs)(n.p,{children:["See ",(0,i.jsx)(n.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/641",children:"this issue"})," for more details."]}),"\n",(0,i.jsxs)(n.h2,{id:"mutexlockwithtimeout-c-exception",children:[(0,i.jsx)(n.code,{children:"MutexLockWithTimeout"})," C++ exception"]}),"\n",(0,i.jsxs)(n.p,{children:["This exception is thrown when you are trying to use ",(0,i.jsx)(n.code,{children:"KeyboardProvider"})," or ",(0,i.jsx)(n.code,{children:"KeyboardAwareScrollView"})," on Android with the new architecture enabled. A top of stacktrace will look like this:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"NonPI::MutexLockWithTimeout at line 384 within libc\noffset 726000) (std::__ndk1::mutex::lock at line 12 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::Binding::schedulerDidFinishTransaction at line 84 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::Scheduler::uiManagerDidFinishTransaction at line 68 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::UIManager::shadowTreeDidFinishTransaction const at line 64 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::ShadowTree::mount const at line 348 within split_config.arm64_v8a.apk\noffset c01000) (facebook::react::ShadowTree::tryCommit const at line 2612 within split_config.arm64_v8a.apk\n"})}),"\n",(0,i.jsx)(n.p,{children:"You have two ways to fix this problem:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["enable ",(0,i.jsx)(n.code,{children:"allowRecursiveCommitsWithSynchronousMountOnAndroid"})," feature flag (see ",(0,i.jsx)(n.a,{href:"https://github.com/software-mansion/react-native-reanimated/issues/6418#issuecomment-2296107100",children:"react-native-reanimated#6418"})," and ",(0,i.jsx)(n.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/687",children:"react-native-keyboard-controller"}),")"]}),"\n",(0,i.jsxs)(n.li,{children:["upgrade to ",(0,i.jsx)(n.code,{children:"react-native@0.77+"})," (starting from this version this flag is enabled by default)."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"filename-longer-than-260-characters",children:"Filename longer than 260 characters"}),"\n",(0,i.jsx)(n.p,{children:"If you experience this error on Windows you need to perform next steps:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Download the Latest Version of Ninja"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Download the latest Ninja release from the ",(0,i.jsx)(n.a,{href:"https://github.com/ninja-build/ninja/releases",children:"official repository"})]}),"\n",(0,i.jsxs)(n.li,{children:["Replace the existing ",(0,i.jsx)(n.code,{children:"ninja.exe"})," in ",(0,i.jsx)(n.code,{children:"$SDK_PATH$\\cmake\\$CMAKE_VERSION$\\bin"})," with the newly downloaded version"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Update the build.gradle File"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Open ",(0,i.jsx)(n.code,{children:"android/app/build.gradle"})]}),"\n",(0,i.jsxs)(n.li,{children:["Inside the ",(0,i.jsx)(n.code,{children:"android.defaultConfig"})," block, add the following code:"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'externalNativeBuild {\n    cmake {\n        arguments "-DCMAKE_MAKE_PROGRAM=$YOUR_CMAKE_NINJA_PATH$", "-DCMAKE_OBJECT_PATH_MAX=1024"\n    }\n}\n'})}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["Make sure to update ",(0,i.jsx)(n.code,{children:"$YOUR_CMAKE_NINJA_PATH$"})," with the correct path to your ",(0,i.jsx)(n.code,{children:"ninja.exe"})," file. For example, it might look something like ",(0,i.jsx)(n.code,{children:"E:\\\\SDK\\\\cmake\\\\3.22.2\\\\bin\\\\ninja.exe"})," on Windows."]})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Enable Long Path Support in Windows"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Run the following ",(0,i.jsx)(n.code,{children:"PowerShell"})," command to enable long path support in Windows:"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'New-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force\n'})}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},28453:(e,n,o)=>{o.d(n,{R:()=>s,x:()=>l});var i=o(96540);const r={},t=i.createContext(r);function s(e){const n=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),i.createElement(t.Provider,{value:n},e.children)}}}]);