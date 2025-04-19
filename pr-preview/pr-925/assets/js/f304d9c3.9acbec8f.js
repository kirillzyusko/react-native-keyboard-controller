"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9573],{20686:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>i,toc:()=>d});var o=r(74848),n=r(28453);const a={slug:"use-keyboard-state",title:"Meet new 1.17 release with useKeyboardState hook \ud83d\udc4b",authors:["kirill"],tags:["react-native","keyboard","useKeyboardState"],keywords:["react-native-keyboard-controller","useKeyboardState"]},s=void 0,i={permalink:"/react-native-keyboard-controller/pr-preview/pr-925/blog/use-keyboard-state",editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2025-04-09-release-1-17/index.mdx",source:"@site/blog/2025-04-09-release-1-17/index.mdx",title:"Meet new 1.17 release with useKeyboardState hook \ud83d\udc4b",description:"Say hello to new 1.17.0 release of react-native-keyboard-controller \ud83d\udc4b",date:"2025-04-09T00:00:00.000Z",tags:[{inline:!0,label:"react-native",permalink:"/react-native-keyboard-controller/pr-preview/pr-925/blog/tags/react-native"},{inline:!0,label:"keyboard",permalink:"/react-native-keyboard-controller/pr-preview/pr-925/blog/tags/keyboard"},{inline:!0,label:"useKeyboardState",permalink:"/react-native-keyboard-controller/pr-preview/pr-925/blog/tags/use-keyboard-state"}],readingTime:2.385,hasTruncateMarker:!0,authors:[{name:"Kirill Zyusko",title:"Library author",url:"https://github.com/kirillzyusko",imageURL:"https://github.com/kirillzyusko.png",key:"kirill"}],frontMatter:{slug:"use-keyboard-state",title:"Meet new 1.17 release with useKeyboardState hook \ud83d\udc4b",authors:["kirill"],tags:["react-native","keyboard","useKeyboardState"],keywords:["react-native-keyboard-controller","useKeyboardState"]},unlisted:!1,nextItem:{title:"Interactive keyboard on iOS with offset \ud83d\udd25",permalink:"/react-native-keyboard-controller/pr-preview/pr-925/blog/interactive-keyboard-ios-with-offset"}},l={authorsImageUrls:[void 0]},d=[{value:"\ud83d\udd25 New <code>useKeyboardState</code> hook",id:"-new-usekeyboardstate-hook",level:2},{value:"\ud83e\uddf1 Custom C++ Shadow Nodes",id:"-custom-c-shadow-nodes",level:2},{value:"\u2728 Summary",id:"-summary",level:2},{value:"\ud83d\ude80 What&#39;s next?",id:"-whats-next",level:2}];function c(e){const t={a:"a",blockquote:"blockquote",code:"code",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(t.p,{children:["Say hello to new ",(0,o.jsx)(t.code,{children:"1.17.0"})," release of ",(0,o.jsx)(t.code,{children:"react-native-keyboard-controller"})," \ud83d\udc4b"]}),"\n",(0,o.jsx)(t.p,{children:"This update brings a powerful new hook, custom C++ shadow nodes, and of course, plenty of bug fixes \ud83d\ude0e"}),"\n",(0,o.jsx)(t.p,{children:"Let\u2019s take a closer look at what\u2019s new \ud83d\udc47"}),"\n",(0,o.jsx)("div",{className:"playwright center",children:(0,o.jsx)("img",{className:"svg",src:r(92039).A,alt:"Phone with visible keyboard and arrow to useKeyboardState"})}),"\n",(0,o.jsxs)(t.h2,{id:"-new-usekeyboardstate-hook",children:["\ud83d\udd25 New ",(0,o.jsx)(t.code,{children:"useKeyboardState"})," hook"]}),"\n",(0,o.jsxs)(t.p,{children:["Since the very first version, this library has provided keyboard events via the ",(0,o.jsx)(t.code,{children:"KeyboardEvents"})," module. But many developers ended up writing their own wrappers to sync those events with ",(0,o.jsx)(t.code,{children:"ref"})," or ",(0,o.jsx)(t.code,{children:"state"})," variables."]}),"\n",(0,o.jsxs)(t.p,{children:["In version ",(0,o.jsx)(t.code,{children:"1.15.0"}),", the ",(0,o.jsx)(t.code,{children:"KeyboardController.state()"})," API was introduced to read the keyboard state without needing a listener. However, if you wanted to react to keyboard changes (like conditionally rendering a component) you still had to use ",(0,o.jsx)(t.code,{children:"KeyboardEvents"})," and deal with boilerplate code."]}),"\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.strong,{children:"That\u2019s no longer the case!"})," With this release, you can use the new ",(0,o.jsx)(t.code,{children:"useKeyboardState"})," hook to track the keyboard in a clean, declarative way. \ud83c\udf89"]}),"\n",(0,o.jsxs)(t.p,{children:["Also, ",(0,o.jsx)(t.code,{children:"KeyboardController.state()"})," has been improved \u2014 it now always returns a defined value, so you no longer need optional chaining to safely access the keyboard state."]}),"\n",(0,o.jsx)(t.h2,{id:"-custom-c-shadow-nodes",children:"\ud83e\uddf1 Custom C++ Shadow Nodes"}),"\n",(0,o.jsxs)(t.p,{children:["When ",(0,o.jsx)(t.code,{children:"OverKeyboardView"})," was introduced, there was an issue on Android/Fabric: the view couldn\u2019t stretch to full screen. That\u2019s because layout is now calculated in C++, and resizing your component requires updating state in C++ as well."]}),"\n",(0,o.jsxs)(t.p,{children:["At the time, I released ",(0,o.jsx)(t.code,{children:"OverKeyboardView"})," with this limitation since there were a lot of other moving pieces \u2014 and gradual rollout was the right choice. But now that the new architecture is the default in React Native, it\u2019s time to address the problem."]}),"\n",(0,o.jsxs)(t.p,{children:["Starting with this release, custom (non-auto-generated) C++ shadow nodes are included. This makes ",(0,o.jsx)(t.code,{children:"OverKeyboardView"})," work as expected under the Fabric renderer."]}),"\n",(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsxs)(t.p,{children:["\u26a0\ufe0f ",(0,o.jsxs)(t.strong,{children:["If you hit any build issues, make a ",(0,o.jsx)(t.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/786#issuecomment-2741464142",children:"clean"})," build and try again. Still having problems? Open an ",(0,o.jsx)(t.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?template=bug_report.md",children:"issue"})," and I\u2019ll help you out."]})]}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"-summary",children:"\u2728 Summary"}),"\n",(0,o.jsx)(t.p,{children:"This is a relatively small release focused on tightening up the internals and laying the groundwork for future updates."}),"\n",(0,o.jsx)(t.p,{children:"While it doesn\u2019t introduce any game-changing features, it plays an important role in ensuring that custom C++ shadow nodes can be successfully integrated across projects using the new React Native architecture. Think of it as a bridge release \u2014 stabilizing key parts of the system to unlock bigger things coming soon \ud83d\ude4c"}),"\n",(0,o.jsx)(t.h2,{id:"-whats-next",children:"\ud83d\ude80 What's next?"}),"\n",(0,o.jsx)(t.p,{children:"As always, my top priority is resolving open issues. Beyond that, here\u2019s what\u2019s coming up:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["Support for ",(0,o.jsx)(t.code,{children:"react-native@0.79"}),";"]}),"\n",(0,o.jsxs)(t.li,{children:["A new ",(0,o.jsx)(t.code,{children:"KeyboardExtender"})," component that gets embedded directly into the keyboard;"]}),"\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.code,{children:"KeyboardToolbar.Group"})," component to split multiple inputs into groups, each with its own navigation and state;"]}),"\n",(0,o.jsxs)(t.li,{children:["A complete rewrite of ",(0,o.jsx)(t.code,{children:"KeyboardAwareScrollView"})," that will use cursor position instead of layout-based detection."]}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["Stay tuned and follow me on ",(0,o.jsx)(t.a,{href:"https://twitter.com/ziusko",children:"Twitter"})," and ",(0,o.jsx)(t.a,{href:"https://github.com/kirillzyusko",children:"GitHub"})," for updates. Thank you for your support! \ud83d\ude0a"]})]})}function h(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},92039:(e,t,r)=>{r.d(t,{A:()=>o});const o=r.p+"assets/images/use-keyboard-state-147782c03c92b23356da2e7a8f5b051d.png"},28453:(e,t,r)=>{r.d(t,{R:()=>s,x:()=>i});var o=r(96540);const n={},a=o.createContext(n);function s(e){const t=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:s(e.components),o.createElement(a.Provider,{value:t},e.children)}}}]);