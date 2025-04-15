"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8854],{1298:(e,r,i)=>{i.r(r),i.d(r,{assets:()=>l,contentTitle:()=>a,default:()=>p,frontMatter:()=>s,metadata:()=>d,toc:()=>c});var o=i(74848),t=i(28453),n=i(69026);const s={slug:"interactive-keyboard-ios-with-offset",title:"Interactive keyboard on iOS with offset \ud83d\udd25",authors:["kirill"],tags:["react-native","keyboard","interactive","ios","offset","selection"],keywords:["react-native-keyboard-controller","interactive keyboard","offset","keyboard gesture area","selection"]},a=void 0,d={permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/interactive-keyboard-ios-with-offset",editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2025-01-27-release-1-16/index.mdx",source:"@site/blog/2025-01-27-release-1-16/index.mdx",title:"Interactive keyboard on iOS with offset \ud83d\udd25",description:"Say hello to the first release of the year for react-native-keyboard-controller version 1.16.0! \ud83c\udf89",date:"2025-01-27T00:00:00.000Z",tags:[{inline:!0,label:"react-native",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/tags/react-native"},{inline:!0,label:"keyboard",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/tags/keyboard"},{inline:!0,label:"interactive",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/tags/interactive"},{inline:!0,label:"ios",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/tags/ios"},{inline:!0,label:"offset",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/tags/offset"},{inline:!0,label:"selection",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/tags/selection"}],readingTime:2.69,hasTruncateMarker:!0,authors:[{name:"Kirill Zyusko",title:"Library author",url:"https://github.com/kirillzyusko",imageURL:"https://github.com/kirillzyusko.png",key:"kirill"}],frontMatter:{slug:"interactive-keyboard-ios-with-offset",title:"Interactive keyboard on iOS with offset \ud83d\udd25",authors:["kirill"],tags:["react-native","keyboard","interactive","ios","offset","selection"],keywords:["react-native-keyboard-controller","interactive keyboard","offset","keyboard gesture area","selection"]},unlisted:!1,prevItem:{title:"Meet new 1.17 release with useKeyboardState hook \ud83d\udc4b",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/use-keyboard-state"},nextItem:{title:"Mastering keyboard management \ud83e\udd77\ud83c\udffc",permalink:"/react-native-keyboard-controller/pr-preview/pr-920/blog/mastering-keyboard-management"}},l={authorsImageUrls:[void 0]},c=[{value:"<code>KeyboardGestureArea</code> with <code>offset</code> on iOS \ud83d\udd25",id:"keyboardgesturearea-with-offset-on-ios-",level:2},{value:"<code>useFocusedInput</code> improvements",id:"usefocusedinput-improvements",level:2},{value:"More Accurate Selection Events",id:"more-accurate-selection-events",level:3},{value:"Improved precision",id:"improved-precision",level:4},{value:"Fully compatible with iOS &lt; 13",id:"fully-compatible-with-ios--13",level:4},{value:"Works Seamlessly with Stripe Inputs on Android",id:"works-seamlessly-with-stripe-inputs-on-android",level:3},{value:"No crashes on iOS",id:"no-crashes-on-ios",level:3},{value:"More Robust Focus Detection (Even When the Keyboard Is Hidden)",id:"more-robust-focus-detection-even-when-the-keyboard-is-hidden",level:3},{value:"New <code>preserveEdgeToEdge</code> prop for <code>KeyboardProvider</code>",id:"new-preserveedgetoedge-prop-for-keyboardprovider",level:2},{value:"Improved animation performance",id:"improved-animation-performance",level:2},{value:"What&#39;s next?",id:"whats-next",level:2}];function h(e){const r={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(r.p,{children:["Say hello to the first release of the year for ",(0,o.jsx)(r.code,{children:"react-native-keyboard-controller"})," version ",(0,o.jsx)(r.code,{children:"1.16.0"}),"! \ud83c\udf89"]}),"\n",(0,o.jsx)(r.p,{children:"This update is packed with new features, critical bug fixes, crash resolutions, and performance optimizations. Let\u2019s dive in and explore what\u2019s new! \ud83d\udc47"}),"\n","\n",(0,o.jsx)(n.A,{src:"/video/ios-offset-demo.mp4",width:30}),"\n",(0,o.jsxs)(r.h2,{id:"keyboardgesturearea-with-offset-on-ios-",children:[(0,o.jsx)(r.code,{children:"KeyboardGestureArea"})," with ",(0,o.jsx)(r.code,{children:"offset"})," on iOS \ud83d\udd25"]}),"\n",(0,o.jsxs)(r.p,{children:["The cherry on the cake of this release is making ",(0,o.jsx)(r.code,{children:"KeyboardGestureArea"})," available on iOS \ud83c\udf52"]}),"\n",(0,o.jsxs)(r.p,{children:["Previously, react-native developers relied on ",(0,o.jsx)(r.code,{children:"InputAccessoryView"})," to extend the keyboard area, but it had several limitations:"]}),"\n",(0,o.jsxs)(r.ul,{children:["\n",(0,o.jsxs)(r.li,{children:["Multiline ",(0,o.jsx)(r.code,{children:"TextInput"})," fields couldn't ",(0,o.jsx)(r.a,{href:"https://github.com/facebook/react-native/issues/18997",children:"expand dynamically"}),";"]}),"\n",(0,o.jsxs)(r.li,{children:["Conditional positioning and padding weren't ",(0,o.jsx)(r.a,{href:"https://github.com/facebook/react-native/issues/20157",children:"fully customizable"}),";"]}),"\n",(0,o.jsxs)(r.li,{children:["Weird animations when screen gets ",(0,o.jsx)(r.a,{href:"https://stackoverflow.com/a/29110384/9272042",children:"mounted"}),"."]}),"\n"]}),"\n",(0,o.jsxs)(r.p,{children:["These issues made ",(0,o.jsx)(r.code,{children:"InputAccessoryView"})," challenging to use in real-world apps. \ud83d\ude2d"]}),"\n",(0,o.jsxs)(r.p,{children:["Starting with this release, ",(0,o.jsx)(r.code,{children:"KeyboardGestureArea"})," is now available on iOS! Currently, it supports the ",(0,o.jsx)(r.code,{children:"offset"})," property, but I plan to add more features soon. \ud83d\ude0e"]}),"\n",(0,o.jsxs)(r.h2,{id:"usefocusedinput-improvements",children:[(0,o.jsx)(r.code,{children:"useFocusedInput"})," improvements"]}),"\n",(0,o.jsx)(r.h3,{id:"more-accurate-selection-events",children:"More Accurate Selection Events"}),"\n",(0,o.jsx)(r.h4,{id:"improved-precision",children:"Improved precision"}),"\n",(0,o.jsxs)(r.p,{children:["Previously, ",(0,o.jsx)(r.code,{children:"onSelectionChange"}),"events could produce imprecise coordinates, especially when using different ",(0,o.jsx)(r.code,{children:"paddingTop"}),"/",(0,o.jsx)(r.code,{children:"paddingBottom"})," values or the ",(0,o.jsx)(r.code,{children:"textAlignVertical"})," property."]}),"\n",(0,o.jsx)(r.p,{children:"This update fixes those inaccuracies, ensuring more precise coordinates and eliminating the need for workarounds to align positioning between Android and iOS."}),"\n",(0,o.jsx)(r.h4,{id:"fully-compatible-with-ios--13",children:"Fully compatible with iOS < 13"}),"\n",(0,o.jsxs)(r.p,{children:[(0,o.jsx)(r.code,{children:"onSelectionChange"})," didn\u2019t work for single-line ",(0,o.jsx)(r.code,{children:"TextInput"}),"s on iOS versions below 13. This issue has now been resolved, ensuring compatibility across all iOS versions."]}),"\n",(0,o.jsx)(r.h3,{id:"works-seamlessly-with-stripe-inputs-on-android",children:"Works Seamlessly with Stripe Inputs on Android"}),"\n",(0,o.jsxs)(r.p,{children:["Previously, some third-party SDKs, like ",(0,o.jsx)(r.strong,{children:"Stripe"}),", used custom ",(0,o.jsx)(r.code,{children:"EditText"})," subclasses that caused issues when casting to ",(0,o.jsx)(r.code,{children:"ReactEditText"}),", preventing the library from recognizing focused inputs."]}),"\n",(0,o.jsxs)(r.p,{children:["I\u2019ve reworked the code to interact directly with ",(0,o.jsx)(r.code,{children:"EditText"})," whenever possible, ensuring full compatibility with ",(0,o.jsx)(r.strong,{children:"Stripe"})," and other third-party SDKs."]}),"\n",(0,o.jsx)(r.h3,{id:"no-crashes-on-ios",children:"No crashes on iOS"}),"\n",(0,o.jsx)(r.p,{children:"While rare, some users experienced crashes due to incorrect Key-Value Observing (KVO) removal when attempting to remove KVO from a view that doesn\u2019t have it."}),"\n",(0,o.jsx)(r.p,{children:"This release introduces a block-based KVO handling approach, eliminating those crashes."}),"\n",(0,o.jsx)(r.h3,{id:"more-robust-focus-detection-even-when-the-keyboard-is-hidden",children:"More Robust Focus Detection (Even When the Keyboard Is Hidden)"}),"\n",(0,o.jsxs)(r.p,{children:["Previously, the library relied on the ",(0,o.jsx)(r.code,{children:"keyboardWillShow"})," event as an indicator that an input field was focused. However, this event doesn\u2019t always trigger\u2014such as when using a physical keyboard or setting ",(0,o.jsx)(r.code,{children:"showSoftInputOnFocus={false}"}),"."]}),"\n",(0,o.jsx)(r.p,{children:"Now, focus detection has been improved to work reliably even without keyboard events."}),"\n",(0,o.jsxs)(r.h2,{id:"new-preserveedgetoedge-prop-for-keyboardprovider",children:["New ",(0,o.jsx)(r.code,{children:"preserveEdgeToEdge"})," prop for ",(0,o.jsx)(r.code,{children:"KeyboardProvider"})]}),"\n",(0,o.jsxs)(r.p,{children:["Thanks to ",(0,o.jsx)(r.a,{href:"https://github.com/zoontek",children:"Mathieu Acthernoene"}),", ",(0,o.jsx)(r.code,{children:"preserveEdgeToEdge"})," has been introduced! This property lets you control whether ",(0,o.jsx)(r.code,{children:"edge-to-edge"})," mode is disabled when calling ",(0,o.jsx)(r.code,{children:"setEnabled(false)"}),", or if you want to keep it enabled."]}),"\n",(0,o.jsxs)(r.p,{children:["With ",(0,o.jsx)(r.code,{children:"edge-to-edge"})," mode becoming the standard, this option helps prevent conflicts with other libraries."]}),"\n",(0,o.jsx)(r.h2,{id:"improved-animation-performance",children:"Improved animation performance"}),"\n",(0,o.jsxs)(r.p,{children:["While most users won\u2019t notice a difference (since before animations were already computed in under ",(0,o.jsx)(r.code,{children:"1ms"}),"), I\u2019ve made further optimizations to improve performance."]}),"\n",(0,o.jsxs)(r.p,{children:["Even small performance gains are valuable, as they free up CPU resources for other intensive tasks \u2014 such as ",(0,o.jsx)(r.code,{children:"ShadowTree"})," traversal in ",(0,o.jsx)(r.code,{children:"react-native-reanimated"}),"."]}),"\n",(0,o.jsx)(r.h2,{id:"whats-next",children:"What's next?"}),"\n",(0,o.jsx)(r.p,{children:"As always, my immediate priority is addressing open issues. Additionally, I have plans for upcoming updates:"}),"\n",(0,o.jsxs)(r.ul,{children:["\n",(0,o.jsxs)(r.li,{children:["Adding support for ",(0,o.jsx)(r.code,{children:"react-native@0.77"}),";"]}),"\n",(0,o.jsxs)(r.li,{children:["A major rewrite of ",(0,o.jsx)(r.code,{children:"KeyboardAwareScrollView"})," to consider cursor positioning (this release lays the groundwork by improving event precision to minimize breaking changes in the future)."]}),"\n"]}),"\n",(0,o.jsxs)(r.p,{children:["Stay tuned and follow me on ",(0,o.jsx)(r.a,{href:"https://twitter.com/ziusko",children:"Twitter"})," and ",(0,o.jsx)(r.a,{href:"https://github.com/kirillzyusko",children:"GitHub"})," for updates. Thank you for your support! \ud83d\ude0a"]})]})}function p(e={}){const{wrapper:r}={...(0,t.R)(),...e.components};return r?(0,o.jsx)(r,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},69026:(e,r,i)=>{i.d(r,{A:()=>n});var o=i(86025),t=(i(96540),i(74848));function n(e){let{src:r,width:i=100,...n}=e;const s=(0,o.Ay)(r);return(0,t.jsx)("div",{className:"center video",children:(0,t.jsx)("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,height:"100%",src:s,width:`${i}%`,...n})})}},28453:(e,r,i)=>{i.d(r,{R:()=>s,x:()=>a});var o=i(96540);const t={},n=o.createContext(t);function s(e){const r=o.useContext(n);return o.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),o.createElement(n.Provider,{value:r},e.children)}}}]);