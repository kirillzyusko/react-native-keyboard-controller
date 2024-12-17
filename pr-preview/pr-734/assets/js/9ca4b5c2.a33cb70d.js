"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1924],{59176:(e,r,o)=>{o.r(r),o.d(r,{assets:()=>l,contentTitle:()=>s,default:()=>p,frontMatter:()=>t,metadata:()=>a,toc:()=>d});var i=o(74848),n=o(28453);const t={sidebar_position:4,title:"KeyboardGestureArea",keywords:["react-native-keyboard-controller","KeyboardGestureArea","interactive keyboard","view"]},s="KeyboardGestureArea ",a={id:"api/keyboard-gesture-area",title:"KeyboardGestureArea",description:"KeyboardGestureArea allows you to define a region on the screen, where gestures will control the keyboard position.",source:"@site/versioned_docs/version-1.6.0/api/keyboard-gesture-area.md",sourceDirName:"api",slug:"/api/keyboard-gesture-area",permalink:"/react-native-keyboard-controller/pr-preview/pr-734/docs/1.6.0/api/keyboard-gesture-area",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.6.0/api/keyboard-gesture-area.md",tags:[],version:"1.6.0",sidebarPosition:4,frontMatter:{sidebar_position:4,title:"KeyboardGestureArea",keywords:["react-native-keyboard-controller","KeyboardGestureArea","interactive keyboard","view"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardControllerView",permalink:"/react-native-keyboard-controller/pr-preview/pr-734/docs/1.6.0/api/keyboard-controller-view"},next:{title:"KeyboardController",permalink:"/react-native-keyboard-controller/pr-preview/pr-734/docs/1.6.0/api/keyboard-controller"}},l={},d=[{value:"Props",id:"props",level:2},{value:"<code>interpolator</code>",id:"interpolator",level:3},{value:"<code>showOnSwipeUp</code>",id:"showonswipeup",level:3},{value:"<code>enableSwipeToDismiss</code>",id:"enableswipetodismiss",level:3},{value:"Example",id:"example",level:2}];function c(e){const r={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(r.h1,{id:"keyboardgesturearea-",children:["KeyboardGestureArea ",(0,i.jsx)("div",{className:"label android"})]}),"\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.code,{children:"KeyboardGestureArea"})," allows you to define a region on the screen, where gestures will control the keyboard position."]}),"\n",(0,i.jsx)(r.admonition,{title:"Platform availability",type:"info",children:(0,i.jsxs)(r.p,{children:["This component is available only for Android >= 11. For iOS and Android < 11 it will render ",(0,i.jsx)(r.code,{children:"React.Fragment"}),"."]})}),"\n",(0,i.jsx)(r.h2,{id:"props",children:"Props"}),"\n",(0,i.jsx)(r.h3,{id:"interpolator",children:(0,i.jsx)(r.code,{children:"interpolator"})}),"\n",(0,i.jsxs)(r.p,{children:["String with possible values ",(0,i.jsx)(r.code,{children:"linear"})," and ",(0,i.jsx)(r.code,{children:"ios"}),":"]}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.strong,{children:"ios"})," - interactive keyboard dismissing will work as in iOS: swipes in non-keyboard area will not affect keyboard positioning, but if your swipe touches keyboard - keyboard will follow finger position."]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.strong,{children:"linear"})," - gestures inside the component will linearly affect the position of the keyboard, i.e. if the user swipes down by 20 pixels, then the keyboard will also be moved down by 20 pixels, even if the gesture was not made over the keyboard area."]}),"\n"]}),"\n",(0,i.jsx)(r.h3,{id:"showonswipeup",children:(0,i.jsx)(r.code,{children:"showOnSwipeUp"})}),"\n",(0,i.jsxs)(r.p,{children:["A boolean prop which allows to customize interactive keyboard behavior. If set to ",(0,i.jsx)(r.code,{children:"true"})," then it allows to show keyboard (if it's already closed) by swipe up gesture. ",(0,i.jsx)(r.code,{children:"false"})," by default."]}),"\n",(0,i.jsx)(r.h3,{id:"enableswipetodismiss",children:(0,i.jsx)(r.code,{children:"enableSwipeToDismiss"})}),"\n",(0,i.jsxs)(r.p,{children:["A boolean prop which allows to customize interactive keyboard behavior. If set to ",(0,i.jsx)(r.code,{children:"false"}),", then any gesture will not affect keyboard position if the keyboard is shown. ",(0,i.jsx)(r.code,{children:"true"})," by default."]}),"\n",(0,i.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,i.jsx)(r.pre,{children:(0,i.jsx)(r.code,{className:"language-tsx",children:'<KeyboardGestureArea interpolator="ios">\n  <ScrollView>\n    {/* The other UI components of application in your tree */}\n  </ScrollView>\n</KeyboardGestureArea>\n'})})]})}function p(e={}){const{wrapper:r}={...(0,n.R)(),...e.components};return r?(0,i.jsx)(r,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},28453:(e,r,o)=>{o.d(r,{R:()=>s,x:()=>a});var i=o(96540);const n={},t=i.createContext(n);function s(e){const r=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:s(e.components),i.createElement(t.Provider,{value:r},e.children)}}}]);