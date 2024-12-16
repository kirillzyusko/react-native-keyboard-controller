"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2740],{68738:(e,r,o)=>{o.r(r),o.d(r,{assets:()=>d,contentTitle:()=>n,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var s=o(74848),t=o(28453);const i={slug:"mastering-keyboard-management",title:"Mastering keyboard management \ud83e\udd77\ud83c\udffc",authors:["kirill"],tags:["react-native","keyboard","dismiss","keepFocus","state","isVisible","type","appearance"],keywords:["react-native-keyboard-controller","keyboard","dismiss","keepFocus","state","isVisible","type","appearance"]},n=void 0,a={permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/mastering-keyboard-management",editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2024-12-12-release-1-15/index.mdx",source:"@site/blog/2024-12-12-release-1-15/index.mdx",title:"Mastering keyboard management \ud83e\udd77\ud83c\udffc",description:"Today I'm glad to announce a new 1.15.0 version of react-native-keyboard-controller \ud83c\udf89",date:"2024-12-12T00:00:00.000Z",tags:[{inline:!0,label:"react-native",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/tags/react-native"},{inline:!0,label:"keyboard",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/tags/keyboard"},{inline:!0,label:"dismiss",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/tags/dismiss"},{inline:!0,label:"keepFocus",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/tags/keep-focus"},{inline:!0,label:"state",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/tags/state"},{inline:!0,label:"isVisible",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/tags/is-visible"},{inline:!0,label:"type",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/tags/type"},{inline:!0,label:"appearance",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/tags/appearance"}],readingTime:4.155,hasTruncateMarker:!0,authors:[{name:"Kirill Zyusko",title:"Library author",url:"https://github.com/kirillzyusko",imageURL:"https://github.com/kirillzyusko.png",key:"kirill"}],frontMatter:{slug:"mastering-keyboard-management",title:"Mastering keyboard management \ud83e\udd77\ud83c\udffc",authors:["kirill"],tags:["react-native","keyboard","dismiss","keepFocus","state","isVisible","type","appearance"],keywords:["react-native-keyboard-controller","keyboard","dismiss","keepFocus","state","isVisible","type","appearance"]},unlisted:!1,nextItem:{title:"New OverKeyboardView component",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/blog/over-keyboard-view"}},d={authorsImageUrls:[void 0]},c=[{value:"Changes to <code>dismiss</code> method",id:"changes-to-dismiss-method",level:2},{value:"<code>dismiss</code> method now returns a promise",id:"dismiss-method-now-returns-a-promise",level:3},{value:"<code>dismiss</code> now blurs input by default",id:"dismiss-now-blurs-input-by-default",level:3},{value:"<code>dismiss</code> now accepts a <code>keepFocus</code> parameter",id:"dismiss-now-accepts-a-keepfocus-parameter",level:3},{value:"New <code>KeyboardController</code> API methods",id:"new-keyboardcontroller-api-methods",level:2},{value:"New <code>isVisible</code> method",id:"new-isvisible-method",level:3},{value:"New <code>.state()</code> method",id:"new-state-method",level:3},{value:"Better <code>KeyboardStickyView</code> and <code>KeyboardToolbar</code> interoperability",id:"better-keyboardstickyview-and-keyboardtoolbar-interoperability",level:2},{value:"<code>KeyboardToolbar</code> now accepts <code>KeyboardStickyView</code> props",id:"keyboardtoolbar-now-accepts-keyboardstickyview-props",level:3},{value:"<code>KeyboardStickyView</code> got new <code>enabled</code> prop",id:"keyboardstickyview-got-new-enabled-prop",level:3},{value:"<code>KeyboardEvents</code> metadata enhancements",id:"keyboardevents-metadata-enhancements",level:2},{value:"New <code>type</code> property",id:"new-type-property",level:3},{value:"New <code>appearance</code> property",id:"new-appearance-property",level:3},{value:"What&#39;s next?",id:"whats-next",level:2}];function l(e){const r={a:"a",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(r.p,{children:["Today I'm glad to announce a new ",(0,s.jsx)(r.code,{children:"1.15.0"})," version of ",(0,s.jsx)(r.code,{children:"react-native-keyboard-controller"})," \ud83c\udf89"]}),"\n",(0,s.jsx)(r.p,{children:"This release mainly focuses on managing keyboard state, improving keyboard dismissal interactions and API enhancements, so let's go and see which new features this release brings \ud83d\udc47"}),"\n",(0,s.jsxs)(r.h2,{id:"changes-to-dismiss-method",children:["Changes to ",(0,s.jsx)(r.code,{children:"dismiss"})," method"]}),"\n",(0,s.jsxs)(r.h3,{id:"dismiss-method-now-returns-a-promise",children:[(0,s.jsx)(r.code,{children:"dismiss"})," method now returns a promise"]}),"\n",(0,s.jsxs)(r.p,{children:["Previously, the ",(0,s.jsx)(r.code,{children:"dismiss"})," method was synchronous, which meant that you couldn't determine the moment when keyboard is fully hidden. Typically many developers were using one time listener that was resolving a promise or executing the code that had to be executed after keyboard dismissal. The code could look like this:"]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-tsx",children:'import {\n  KeyboardController,\n  KeyboardEvents,\n} from "react-native-keyboard-controller";\n\nconst subscription = KeyboardEvents.addListener("keyboardDidHide", () => {\n  setVisible(true);\n  subscription.remove();\n});\n\nKeyboardController.dismiss();\n'})}),"\n",(0,s.jsxs)(r.p,{children:["Now, ",(0,s.jsx)(r.code,{children:"dismiss"})," returns a promise, so you can use it in ",(0,s.jsx)(r.code,{children:"async"})," way:"]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-ts",children:'import { KeyboardController } from "react-native-keyboard-controller";\n\nawait KeyboardController.dismiss();\nsetVisible(true);\n'})}),"\n",(0,s.jsx)(r.p,{children:"Much cleaner and more readable code! \ud83d\udcaa"}),"\n",(0,s.jsxs)(r.h3,{id:"dismiss-now-blurs-input-by-default",children:[(0,s.jsx)(r.code,{children:"dismiss"})," now blurs input by default"]}),"\n",(0,s.jsxs)(r.p,{children:["The previous behavior of ",(0,s.jsx)(r.code,{children:"dismiss"})," was keeping the focus on the input on Android and blurring the input on iOS. This behavior was not very intuitive and such inconsistency could causing a lot of issues. Now, the default behavior is to blur the input on both platforms \ud83d\ude0e"]}),"\n",(0,s.jsxs)(r.p,{children:["Though a rhetorical question might be raised - ",(0,s.jsx)(r.strong,{children:'"I liked the old behavior, when input still hold the focus \ud83e\udd37\u200d\u2642\ufe0f. How to restore a previous behavior?"'})," We hear you! \ud83d\udc47"]}),"\n",(0,s.jsxs)(r.h3,{id:"dismiss-now-accepts-a-keepfocus-parameter",children:[(0,s.jsx)(r.code,{children:"dismiss"})," now accepts a ",(0,s.jsx)(r.code,{children:"keepFocus"})," parameter"]}),"\n",(0,s.jsxs)(r.p,{children:["Sometimes you might want to keep the focus on the input, even after keyboard is dismissed. This way users can understand which field was focused the last. If you want to achieve this behavior, you can pass ",(0,s.jsx)(r.code,{children:"keepFocus"})," parameter to ",(0,s.jsx)(r.code,{children:"dismiss"})," method:"]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-ts",children:"KeyboardController.dismiss({ keepFocus: true });\n"})}),"\n",(0,s.jsxs)(r.h2,{id:"new-keyboardcontroller-api-methods",children:["New ",(0,s.jsx)(r.code,{children:"KeyboardController"})," API methods"]}),"\n",(0,s.jsxs)(r.p,{children:["We finished with dismissal part. But the counter part of dismissal is the checking current keyboard state. This release is packed with 2 new methods that aims to simplify the keyboard state checks and achieve a parity with ",(0,s.jsx)(r.code,{children:"react-native"})," API \ud83d\ude0a"]}),"\n",(0,s.jsxs)(r.h3,{id:"new-isvisible-method",children:["New ",(0,s.jsx)(r.code,{children:"isVisible"})," method"]}),"\n",(0,s.jsxs)(r.p,{children:["This method acts as a ",(0,s.jsx)(r.code,{children:"Keyboard.isVisible()"})," method from ",(0,s.jsx)(r.code,{children:"react-native"})," and returns ",(0,s.jsx)(r.code,{children:"true"})," if keyboard is currently visible and ",(0,s.jsx)(r.code,{children:"false"})," otherwise."]}),"\n",(0,s.jsx)(r.p,{children:"You can use it to check keyboard visibility on demand without a need to create listeners."}),"\n",(0,s.jsxs)(r.h3,{id:"new-state-method",children:["New ",(0,s.jsx)(r.code,{children:".state()"})," method"]}),"\n",(0,s.jsxs)(r.p,{children:["The new method returns the last keyboard state. It returns ",(0,s.jsx)(r.code,{children:"null"})," if keyboard was not shown in the app yet."]}),"\n",(0,s.jsxs)(r.p,{children:["This method acts similar to ",(0,s.jsx)(r.code,{children:"Keyboard.metrics()"})," from ",(0,s.jsx)(r.code,{children:"react-native"})," and returns the current keyboard state. The reason why it is named ",(0,s.jsx)(r.code,{children:"state"})," instead of ",(0,s.jsx)(r.code,{children:"metrics"})," is because it returns a different data structure and it's not a drop-in replacement for ",(0,s.jsx)(r.code,{children:"Keyboard.metrics()"}),". However you can achieve the same results using ",(0,s.jsx)(r.code,{children:"KeyboardController.state()"})," (because it gives an access to ",(0,s.jsx)(r.code,{children:"height"})," value) and even more - you can use other properties, such as ",(0,s.jsx)(r.code,{children:"type"}),", ",(0,s.jsx)(r.code,{children:"appearance"}),", ",(0,s.jsx)(r.code,{children:"target"}),", ",(0,s.jsx)(r.code,{children:"timestamp"})," etc. to get more information about the keyboard."]}),"\n",(0,s.jsxs)(r.h2,{id:"better-keyboardstickyview-and-keyboardtoolbar-interoperability",children:["Better ",(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," and ",(0,s.jsx)(r.code,{children:"KeyboardToolbar"})," interoperability"]}),"\n",(0,s.jsxs)(r.p,{children:[(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," and ",(0,s.jsx)(r.code,{children:"KeyboardToolbar"})," also got some useful improvements \ud83d\ude0a"]}),"\n",(0,s.jsxs)(r.h3,{id:"keyboardtoolbar-now-accepts-keyboardstickyview-props",children:[(0,s.jsx)(r.code,{children:"KeyboardToolbar"})," now accepts ",(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," props"]}),"\n",(0,s.jsxs)(r.p,{children:["The ",(0,s.jsx)(r.code,{children:"KeyboardToolbar"})," is based on ",(0,s.jsx)(r.code,{children:"KeyboardStickyView"}),". However before it wasn't exposing some of ",(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," properties."]}),"\n",(0,s.jsxs)(r.p,{children:["I fixed that problem and ",(0,s.jsx)(r.code,{children:"KeyboardToolbar"})," now accepts the same properties that ",(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," has, thus making a better interoperability between these two components."]}),"\n",(0,s.jsxs)(r.h3,{id:"keyboardstickyview-got-new-enabled-prop",children:[(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," got new ",(0,s.jsx)(r.code,{children:"enabled"})," prop"]}),"\n",(0,s.jsxs)(r.p,{children:["Before ",(0,s.jsx)(r.code,{children:"KeyboardAwareScrollView"})," and ",(0,s.jsx)(r.code,{children:"KeyboardAvoidingView"})," had ",(0,s.jsx)(r.code,{children:"enabled"})," property, but somehow I forgot to add that property to ",(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," \ud83d\ude2c. The ",(0,s.jsx)(r.code,{children:"1.15.0"})," release fixes this problem and now ",(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," also has ",(0,s.jsx)(r.code,{children:"enabled"})," property."]}),"\n",(0,s.jsxs)(r.p,{children:["When this property is turned on, then ",(0,s.jsx)(r.code,{children:"KeyboardStickyView"})," follows the keyboard. When property disabled, then it just moves the component into a position as keyboard wasn't shown yet."]}),"\n",(0,s.jsxs)(r.h2,{id:"keyboardevents-metadata-enhancements",children:[(0,s.jsx)(r.code,{children:"KeyboardEvents"})," metadata enhancements"]}),"\n",(0,s.jsxs)(r.p,{children:["This release enhances ",(0,s.jsx)(r.code,{children:"KeyboardEventData"})," with new properties."]}),"\n",(0,s.jsxs)(r.h3,{id:"new-type-property",children:["New ",(0,s.jsx)(r.code,{children:"type"})," property"]}),"\n",(0,s.jsxs)(r.p,{children:["In this release I added new ",(0,s.jsx)(r.code,{children:"type"})," property which reflects ",(0,s.jsx)(r.a,{href:"https://reactnative.dev/docs/textinput#keyboardtype",children:"keyboardType"})," value. Using this property you can understand more about which keyboard type is shown at the moment."]}),"\n",(0,s.jsxs)(r.h3,{id:"new-appearance-property",children:["New ",(0,s.jsx)(r.code,{children:"appearance"})," property"]}),"\n",(0,s.jsxs)(r.p,{children:["This release adds a new ",(0,s.jsx)(r.code,{children:"appearance"})," property which reflects keyboard appearance and can be one of ",(0,s.jsx)(r.code,{children:"light"}),"/",(0,s.jsx)(r.code,{children:"dark"}),"/",(0,s.jsx)(r.code,{children:"default"})," values. This property is available on iOS and Android."]}),"\n",(0,s.jsx)(r.h2,{id:"whats-next",children:"What's next?"}),"\n",(0,s.jsxs)(r.p,{children:["The main goal of this release was making ",(0,s.jsx)(r.code,{children:"KeyboardGestureArea"})," available on iOS. I implemented necessary changes in ",(0,s.jsx)(r.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/pull/727",children:"this PR"})," (which would allow to use ",(0,s.jsx)(r.code,{children:"offset"})," property for interactive dismissal). But when I decided to test Fabric I discovered many issues, which basically makes this component unusable on iOS. Since I already merged many PRs that extend library functionality I decided not to pause release process for months and prepare ",(0,s.jsx)(r.code,{children:"1.15.0"})," now. I'm not abandoning the idea of adding ",(0,s.jsx)(r.code,{children:"offset"})," to interactive keyboard dismissal. I just think it's not a right time for the release of this feature."]}),"\n",(0,s.jsx)(r.p,{children:"As support timeline for this release I'm planning to resolve some old known issues in the library to be sure this library is bug-free and can be used in various complex applications!"}),"\n",(0,s.jsxs)(r.p,{children:["Stay tuned and follow me on ",(0,s.jsx)(r.a,{href:"https://twitter.com/ziusko",children:"Twitter"})," and ",(0,s.jsx)(r.a,{href:"https://github.com/kirillzyusko",children:"GitHub"})," for updates. Thank you for your support! \ud83d\ude0a"]})]})}function h(e={}){const{wrapper:r}={...(0,t.R)(),...e.components};return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},28453:(e,r,o)=>{o.d(r,{R:()=>n,x:()=>a});var s=o(96540);const t={},i=s.createContext(t);function n(e){const r=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:n(e.components),s.createElement(i.Provider,{value:r},e.children)}}}]);