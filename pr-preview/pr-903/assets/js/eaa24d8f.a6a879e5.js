"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7298],{5673:(e,o,r)=>{r.r(o),r.d(o,{assets:()=>l,contentTitle:()=>s,default:()=>p,frontMatter:()=>t,metadata:()=>a,toc:()=>d});var i=r(74848),n=r(28453);const t={sidebar_position:4,title:"KeyboardGestureArea",keywords:["react-native-keyboard-controller","KeyboardGestureArea","interactive keyboard","view"]},s=void 0,a={id:"api/keyboard-gesture-area",title:"KeyboardGestureArea",description:"KeyboardGestureArea allows you to define a region on the screen, where gestures will control the keyboard position.",source:"@site/docs/api/keyboard-gesture-area.md",sourceDirName:"api",slug:"/api/keyboard-gesture-area",permalink:"/react-native-keyboard-controller/pr-preview/pr-903/docs/next/api/keyboard-gesture-area",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/docs/api/keyboard-gesture-area.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4,title:"KeyboardGestureArea",keywords:["react-native-keyboard-controller","KeyboardGestureArea","interactive keyboard","view"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardControllerView",permalink:"/react-native-keyboard-controller/pr-preview/pr-903/docs/next/api/keyboard-controller-view"},next:{title:"KeyboardController",permalink:"/react-native-keyboard-controller/pr-preview/pr-903/docs/next/api/keyboard-controller"}},l={},d=[{value:"Props",id:"props",level:2},{value:"<code>offset</code>",id:"offset",level:3},{value:'<code>interpolator</code> <div class="label android"></div>',id:"interpolator-",level:3},{value:'<code>showOnSwipeUp</code> <div class="label android"></div>',id:"showonswipeup-",level:3},{value:'<code>enableSwipeToDismiss</code> <div class="label android"></div>',id:"enableswipetodismiss-",level:3},{value:'<code>textInputNativeID</code> <div class="label ios"></div>',id:"textinputnativeid-",level:3},{value:"Example",id:"example",level:2}];function c(e){const o={admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(o.p,{children:[(0,i.jsx)(o.code,{children:"KeyboardGestureArea"})," allows you to define a region on the screen, where gestures will control the keyboard position."]}),"\n",(0,i.jsx)(o.admonition,{title:"Platform availability",type:"info",children:(0,i.jsxs)(o.p,{children:["This component is available only for Android >= 11. For iOS and Android < 11 it will render ",(0,i.jsx)(o.code,{children:"React.Fragment"}),"."]})}),"\n",(0,i.jsx)(o.h2,{id:"props",children:"Props"}),"\n",(0,i.jsx)(o.h3,{id:"offset",children:(0,i.jsx)(o.code,{children:"offset"})}),"\n",(0,i.jsxs)(o.p,{children:["Extra distance to the keyboard. Default is ",(0,i.jsx)(o.code,{children:"0"}),"."]}),"\n",(0,i.jsxs)(o.h3,{id:"interpolator-",children:[(0,i.jsx)(o.code,{children:"interpolator"})," ",(0,i.jsx)("div",{className:"label android"})]}),"\n",(0,i.jsxs)(o.p,{children:["String with possible values ",(0,i.jsx)(o.code,{children:"linear"})," and ",(0,i.jsx)(o.code,{children:"ios"}),":"]}),"\n",(0,i.jsxs)(o.ul,{children:["\n",(0,i.jsxs)(o.li,{children:[(0,i.jsx)(o.strong,{children:"ios"})," - interactive keyboard dismissing will work as in iOS: swipes in non-keyboard area will not affect keyboard positioning, but if your swipe touches keyboard - keyboard will follow finger position."]}),"\n",(0,i.jsxs)(o.li,{children:[(0,i.jsx)(o.strong,{children:"linear"})," - gestures inside the component will linearly affect the position of the keyboard, i.e. if the user swipes down by 20 pixels, then the keyboard will also be moved down by 20 pixels, even if the gesture was not made over the keyboard area."]}),"\n"]}),"\n",(0,i.jsxs)(o.h3,{id:"showonswipeup-",children:[(0,i.jsx)(o.code,{children:"showOnSwipeUp"})," ",(0,i.jsx)("div",{className:"label android"})]}),"\n",(0,i.jsxs)(o.p,{children:["A boolean prop which allows to customize interactive keyboard behavior. If set to ",(0,i.jsx)(o.code,{children:"true"})," then it allows to show keyboard (if it's already closed) by swipe up gesture. ",(0,i.jsx)(o.code,{children:"false"})," by default."]}),"\n",(0,i.jsxs)(o.h3,{id:"enableswipetodismiss-",children:[(0,i.jsx)(o.code,{children:"enableSwipeToDismiss"})," ",(0,i.jsx)("div",{className:"label android"})]}),"\n",(0,i.jsxs)(o.p,{children:["A boolean prop which allows to customize interactive keyboard behavior. If set to ",(0,i.jsx)(o.code,{children:"false"}),", then any gesture will not affect keyboard position if the keyboard is shown. ",(0,i.jsx)(o.code,{children:"true"})," by default."]}),"\n",(0,i.jsxs)(o.h3,{id:"textinputnativeid-",children:[(0,i.jsx)(o.code,{children:"textInputNativeID"})," ",(0,i.jsx)("div",{className:"label ios"})]}),"\n",(0,i.jsxs)(o.p,{children:["A corresponding ",(0,i.jsx)(o.code,{children:"nativeID"})," value from the corresponding ",(0,i.jsx)(o.code,{children:"TextInput"}),"."]}),"\n",(0,i.jsx)(o.h2,{id:"example",children:"Example"}),"\n",(0,i.jsx)(o.pre,{children:(0,i.jsx)(o.code,{className:"language-tsx",children:'<KeyboardGestureArea\n  interpolator="ios"\n  offset={50}\n  textInputNativeID="composer"\n>\n  <ScrollView>\n    {/* The other UI components of application in your tree */}\n  </ScrollView>\n  <TextInput nativeID="composer" />\n</KeyboardGestureArea>\n'})})]})}function p(e={}){const{wrapper:o}={...(0,n.R)(),...e.components};return o?(0,i.jsx)(o,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},28453:(e,o,r)=>{r.d(o,{R:()=>s,x:()=>a});var i=r(96540);const n={},t=i.createContext(n);function s(e){const o=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function a(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:s(e.components),i.createElement(t.Provider,{value:o},e.children)}}}]);