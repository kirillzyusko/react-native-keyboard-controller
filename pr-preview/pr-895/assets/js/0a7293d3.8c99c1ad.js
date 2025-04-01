"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8854],{1298:(e,i,r)=>{r.r(i),r.d(i,{assets:()=>l,contentTitle:()=>a,default:()=>p,frontMatter:()=>s,metadata:()=>d,toc:()=>c});var o=r(74848),n=r(28453),t=r(69026);const s={slug:"interactive-keyboard-ios-with-offset",title:"Interactive keyboard on iOS with offset \ud83d\udd25",authors:["kirill"],tags:["react-native","keyboard","interactive","ios","offset","selection"],keywords:["react-native-keyboard-controller","interactive keyboard","offset","keyboard gesture area","selection"]},a=void 0,d={permalink:"/react-native-keyboard-controller/pr-preview/pr-895/blog/interactive-keyboard-ios-with-offset",editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2025-01-27-release-1-16/index.mdx",source:"@site/blog/2025-01-27-release-1-16/index.mdx",title:"Interactive keyboard on iOS with offset \ud83d\udd25",description:"Say hello to the first release of the year for react-native-keyboard-controller version 1.16.0! \ud83c\udf89",date:"2025-01-27T00:00:00.000Z",tags:[{inline:!0,label:"react-native",permalink:"/react-native-keyboard-controller/pr-preview/pr-895/blog/tags/react-native"},{inline:!0,label:"keyboard",permalink:"/react-native-keyboard-controller/pr-preview/pr-895/blog/tags/keyboard"},{inline:!0,label:"interactive",permalink:"/react-native-keyboard-controller/pr-preview/pr-895/blog/tags/interactive"},{inline:!0,label:"ios",permalink:"/react-native-keyboard-controller/pr-preview/pr-895/blog/tags/ios"},{inline:!0,label:"offset",permalink:"/react-native-keyboard-controller/pr-preview/pr-895/blog/tags/offset"},{inline:!0,label:"selection",permalink:"/react-native-keyboard-controller/pr-preview/pr-895/blog/tags/selection"}],readingTime:2.69,hasTruncateMarker:!0,authors:[{name:"Kirill Zyusko",title:"Library author",url:"https://github.com/kirillzyusko",imageURL:"https://github.com/kirillzyusko.png",key:"kirill"}],frontMatter:{slug:"interactive-keyboard-ios-with-offset",title:"Interactive keyboard on iOS with offset \ud83d\udd25",authors:["kirill"],tags:["react-native","keyboard","interactive","ios","offset","selection"],keywords:["react-native-keyboard-controller","interactive keyboard","offset","keyboard gesture area","selection"]},unlisted:!1,nextItem:{title:"Mastering keyboard management \ud83e\udd77\ud83c\udffc",permalink:"/react-native-keyboard-controller/pr-preview/pr-895/blog/mastering-keyboard-management"}},l={authorsImageUrls:[void 0]},c=[{value:"<code>KeyboardGestureArea</code> with <code>offset</code> on iOS \ud83d\udd25",id:"keyboardgesturearea-with-offset-on-ios-",level:2},{value:"<code>useFocusedInput</code> improvements",id:"usefocusedinput-improvements",level:2},{value:"More Accurate Selection Events",id:"more-accurate-selection-events",level:3},{value:"Improved precision",id:"improved-precision",level:4},{value:"Fully compatible with iOS &lt; 13",id:"fully-compatible-with-ios--13",level:4},{value:"Works Seamlessly with Stripe Inputs on Android",id:"works-seamlessly-with-stripe-inputs-on-android",level:3},{value:"No crashes on iOS",id:"no-crashes-on-ios",level:3},{value:"More Robust Focus Detection (Even When the Keyboard Is Hidden)",id:"more-robust-focus-detection-even-when-the-keyboard-is-hidden",level:3},{value:"New <code>preserveEdgeToEdge</code> prop for <code>KeyboardProvider</code>",id:"new-preserveedgetoedge-prop-for-keyboardprovider",level:2},{value:"Improved animation performance",id:"improved-animation-performance",level:2},{value:"What&#39;s next?",id:"whats-next",level:2}];function h(e){const i={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(i.p,{children:["Say hello to the first release of the year for ",(0,o.jsx)(i.code,{children:"react-native-keyboard-controller"})," version ",(0,o.jsx)(i.code,{children:"1.16.0"}),"! \ud83c\udf89"]}),"\n",(0,o.jsx)(i.p,{children:"This update is packed with new features, critical bug fixes, crash resolutions, and performance optimizations. Let\u2019s dive in and explore what\u2019s new! \ud83d\udc47"}),"\n","\n",(0,o.jsx)(t.A,{src:"/video/ios-offset-demo.mp4",width:30}),"\n",(0,o.jsxs)(i.h2,{id:"keyboardgesturearea-with-offset-on-ios-",children:[(0,o.jsx)(i.code,{children:"KeyboardGestureArea"})," with ",(0,o.jsx)(i.code,{children:"offset"})," on iOS \ud83d\udd25"]}),"\n",(0,o.jsxs)(i.p,{children:["The cherry on the cake of this release is making ",(0,o.jsx)(i.code,{children:"KeyboardGestureArea"})," available on iOS \ud83c\udf52"]}),"\n",(0,o.jsxs)(i.p,{children:["Previously, react-native developers relied on ",(0,o.jsx)(i.code,{children:"InputAccessoryView"})," to extend the keyboard area, but it had several limitations:"]}),"\n",(0,o.jsxs)(i.ul,{children:["\n",(0,o.jsxs)(i.li,{children:["Multiline ",(0,o.jsx)(i.code,{children:"TextInput"})," fields couldn't ",(0,o.jsx)(i.a,{href:"https://github.com/facebook/react-native/issues/18997",children:"expand dynamically"}),";"]}),"\n",(0,o.jsxs)(i.li,{children:["Conditional positioning and padding weren't ",(0,o.jsx)(i.a,{href:"https://github.com/facebook/react-native/issues/20157",children:"fully customizable"}),";"]}),"\n",(0,o.jsxs)(i.li,{children:["Weird animations when screen gets ",(0,o.jsx)(i.a,{href:"https://stackoverflow.com/a/29110384/9272042",children:"mounted"}),"."]}),"\n"]}),"\n",(0,o.jsxs)(i.p,{children:["These issues made ",(0,o.jsx)(i.code,{children:"InputAccessoryView"})," challenging to use in real-world apps. \ud83d\ude2d"]}),"\n",(0,o.jsxs)(i.p,{children:["Starting with this release, ",(0,o.jsx)(i.code,{children:"KeyboardGestureArea"})," is now available on iOS! Currently, it supports the ",(0,o.jsx)(i.code,{children:"offset"})," property, but I plan to add more features soon. \ud83d\ude0e"]}),"\n",(0,o.jsxs)(i.h2,{id:"usefocusedinput-improvements",children:[(0,o.jsx)(i.code,{children:"useFocusedInput"})," improvements"]}),"\n",(0,o.jsx)(i.h3,{id:"more-accurate-selection-events",children:"More Accurate Selection Events"}),"\n",(0,o.jsx)(i.h4,{id:"improved-precision",children:"Improved precision"}),"\n",(0,o.jsxs)(i.p,{children:["Previously, ",(0,o.jsx)(i.code,{children:"onSelectionChange"}),"events could produce imprecise coordinates, especially when using different ",(0,o.jsx)(i.code,{children:"paddingTop"}),"/",(0,o.jsx)(i.code,{children:"paddingBottom"})," values or the ",(0,o.jsx)(i.code,{children:"textAlignVertical"})," property."]}),"\n",(0,o.jsx)(i.p,{children:"This update fixes those inaccuracies, ensuring more precise coordinates and eliminating the need for workarounds to align positioning between Android and iOS."}),"\n",(0,o.jsx)(i.h4,{id:"fully-compatible-with-ios--13",children:"Fully compatible with iOS < 13"}),"\n",(0,o.jsxs)(i.p,{children:[(0,o.jsx)(i.code,{children:"onSelectionChange"})," didn\u2019t work for single-line ",(0,o.jsx)(i.code,{children:"TextInput"}),"s on iOS versions below 13. This issue has now been resolved, ensuring compatibility across all iOS versions."]}),"\n",(0,o.jsx)(i.h3,{id:"works-seamlessly-with-stripe-inputs-on-android",children:"Works Seamlessly with Stripe Inputs on Android"}),"\n",(0,o.jsxs)(i.p,{children:["Previously, some third-party SDKs, like ",(0,o.jsx)(i.strong,{children:"Stripe"}),", used custom ",(0,o.jsx)(i.code,{children:"EditText"})," subclasses that caused issues when casting to ",(0,o.jsx)(i.code,{children:"ReactEditText"}),", preventing the library from recognizing focused inputs."]}),"\n",(0,o.jsxs)(i.p,{children:["I\u2019ve reworked the code to interact directly with ",(0,o.jsx)(i.code,{children:"EditText"})," whenever possible, ensuring full compatibility with ",(0,o.jsx)(i.strong,{children:"Stripe"})," and other third-party SDKs."]}),"\n",(0,o.jsx)(i.h3,{id:"no-crashes-on-ios",children:"No crashes on iOS"}),"\n",(0,o.jsx)(i.p,{children:"While rare, some users experienced crashes due to incorrect Key-Value Observing (KVO) removal when attempting to remove KVO from a view that doesn\u2019t have it."}),"\n",(0,o.jsx)(i.p,{children:"This release introduces a block-based KVO handling approach, eliminating those crashes."}),"\n",(0,o.jsx)(i.h3,{id:"more-robust-focus-detection-even-when-the-keyboard-is-hidden",children:"More Robust Focus Detection (Even When the Keyboard Is Hidden)"}),"\n",(0,o.jsxs)(i.p,{children:["Previously, the library relied on the ",(0,o.jsx)(i.code,{children:"keyboardWillShow"})," event as an indicator that an input field was focused. However, this event doesn\u2019t always trigger\u2014such as when using a physical keyboard or setting ",(0,o.jsx)(i.code,{children:"showSoftInputOnFocus={false}"}),"."]}),"\n",(0,o.jsx)(i.p,{children:"Now, focus detection has been improved to work reliably even without keyboard events."}),"\n",(0,o.jsxs)(i.h2,{id:"new-preserveedgetoedge-prop-for-keyboardprovider",children:["New ",(0,o.jsx)(i.code,{children:"preserveEdgeToEdge"})," prop for ",(0,o.jsx)(i.code,{children:"KeyboardProvider"})]}),"\n",(0,o.jsxs)(i.p,{children:["Thanks to ",(0,o.jsx)(i.a,{href:"https://github.com/zoontek",children:"Mathieu Acthernoene"}),", ",(0,o.jsx)(i.code,{children:"preserveEdgeToEdge"})," has been introduced! This property lets you control whether ",(0,o.jsx)(i.code,{children:"edge-to-edge"})," mode is disabled when calling ",(0,o.jsx)(i.code,{children:"setEnabled(false)"}),", or if you want to keep it enabled."]}),"\n",(0,o.jsxs)(i.p,{children:["With ",(0,o.jsx)(i.code,{children:"edge-to-edge"})," mode becoming the standard, this option helps prevent conflicts with other libraries."]}),"\n",(0,o.jsx)(i.h2,{id:"improved-animation-performance",children:"Improved animation performance"}),"\n",(0,o.jsxs)(i.p,{children:["While most users won\u2019t notice a difference (since before animations were already computed in under ",(0,o.jsx)(i.code,{children:"1ms"}),"), I\u2019ve made further optimizations to improve performance."]}),"\n",(0,o.jsxs)(i.p,{children:["Even small performance gains are valuable, as they free up CPU resources for other intensive tasks \u2014 such as ",(0,o.jsx)(i.code,{children:"ShadowTree"})," traversal in ",(0,o.jsx)(i.code,{children:"react-native-reanimated"}),"."]}),"\n",(0,o.jsx)(i.h2,{id:"whats-next",children:"What's next?"}),"\n",(0,o.jsx)(i.p,{children:"As always, my immediate priority is addressing open issues. Additionally, I have plans for upcoming updates:"}),"\n",(0,o.jsxs)(i.ul,{children:["\n",(0,o.jsxs)(i.li,{children:["Adding support for ",(0,o.jsx)(i.code,{children:"react-native@0.77"}),";"]}),"\n",(0,o.jsxs)(i.li,{children:["A major rewrite of ",(0,o.jsx)(i.code,{children:"KeyboardAwareScrollView"})," to consider cursor positioning (this release lays the groundwork by improving event precision to minimize breaking changes in the future)."]}),"\n"]}),"\n",(0,o.jsxs)(i.p,{children:["Stay tuned and follow me on ",(0,o.jsx)(i.a,{href:"https://twitter.com/ziusko",children:"Twitter"})," and ",(0,o.jsx)(i.a,{href:"https://github.com/kirillzyusko",children:"GitHub"})," for updates. Thank you for your support! \ud83d\ude0a"]})]})}function p(e={}){const{wrapper:i}={...(0,n.R)(),...e.components};return i?(0,o.jsx)(i,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},69026:(e,i,r)=>{r.d(i,{A:()=>t});var o=r(86025),n=(r(96540),r(74848));function t(e){let{src:i,width:r=100,...t}=e;const s=(0,o.Ay)(i);return(0,n.jsx)("div",{className:"center video",children:(0,n.jsx)("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,height:"100%",src:s,width:`${r}%`,...t})})}},28453:(e,i,r)=>{r.d(i,{R:()=>s,x:()=>a});var o=r(96540);const n={},t=o.createContext(n);function s(e){const i=o.useContext(t);return o.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function a(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:s(e.components),o.createElement(t.Provider,{value:i},e.children)}}}]);