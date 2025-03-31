"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6743],{84659:(a,e,t)=>{t.r(e),t.d(e,{assets:()=>h,contentTitle:()=>d,default:()=>u,frontMatter:()=>o,metadata:()=>c,toc:()=>i});var s=t(74848),n=t(28453),r=t(78729),l=t(69026);const o={keywords:["react-native","react native","react-native-keyboard-controller","useFocusedInputHandler","onTextChanged","onChangeText","input interceptor","react-native-reanimated","worklet","react hook"]},d="useFocusedInputHandler",c={id:"api/hooks/input/use-focused-input-handler",title:"useFocusedInputHandler",description:"useFocusedInputHandler is a hook that allows to intercept events from a focused TextInput.",source:"@site/versioned_docs/version-1.16.0/api/hooks/input/use-focused-input-handler.mdx",sourceDirName:"api/hooks/input",slug:"/api/hooks/input/use-focused-input-handler",permalink:"/react-native-keyboard-controller/pr-preview/pr-891/docs/api/hooks/input/use-focused-input-handler",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.16.0/api/hooks/input/use-focused-input-handler.mdx",tags:[],version:"1.16.0",frontMatter:{keywords:["react-native","react native","react-native-keyboard-controller","useFocusedInputHandler","onTextChanged","onChangeText","input interceptor","react-native-reanimated","worklet","react hook"]},sidebar:"tutorialSidebar",previous:{title:"useReanimatedKeyboardAnimation",permalink:"/react-native-keyboard-controller/pr-preview/pr-891/docs/api/hooks/keyboard/use-reanimated-keyboard-animation"},next:{title:"useReanimatedFocusedInput",permalink:"/react-native-keyboard-controller/pr-preview/pr-891/docs/api/hooks/input/use-reanimated-focused-input"}},h={},i=[{value:"Example",id:"example",level:2},{value:"Handlers",id:"handlers",level:2},{value:"<code>onChangeText</code>",id:"onchangetext",level:3},{value:"<code>onSelectionChange</code>",id:"onselectionchange",level:3}];function f(a){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,n.R)(),...a.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.h1,{id:"usefocusedinputhandler",children:"useFocusedInputHandler"}),"\n","\n",(0,s.jsx)("div",{className:"interactive-animation lottie",children:(0,s.jsx)(r.A,{})}),"\n",(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.code,{children:"useFocusedInputHandler"})," is a hook that allows to intercept events from a focused ",(0,s.jsx)(e.code,{children:"TextInput"}),"."]}),"\n",(0,s.jsx)(e.h2,{id:"example",children:"Example"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-ts",children:'useFocusedInputHandler(\n  {\n    onChangeText: ({ text }) => {\n      "worklet";\n    },\n    onSelectionChange: ({ target, selection }) => {\n      "worklet";\n    },\n  },\n  [],\n);\n'})}),"\n",(0,s.jsx)(e.h2,{id:"handlers",children:"Handlers"}),"\n",(0,s.jsx)(e.h3,{id:"onchangetext",children:(0,s.jsx)(e.code,{children:"onChangeText"})}),"\n",(0,s.jsxs)(e.p,{children:["Fires an event whenever user changes text in focused ",(0,s.jsx)(e.code,{children:"TextInput"})," (i. e. adds or deletes symbols). Event has following structure:"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-ts",children:"type FocusedInputTextChangedEvent = {\n  text: string;\n};\n"})}),"\n",(0,s.jsxs)(e.p,{children:["This handler can be handy when you need to have an access to what user typed on a global level (i. e. when you don't have a direct access to your ",(0,s.jsx)(e.code,{children:"TextInput"}),"), for example:"]}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsxs)(e.li,{children:["you develop a generic component for any kind of avoidance focused inputs (i. e. ",(0,s.jsx)(e.code,{children:"AwareScrollView"}),") that doesn't have an access to child ",(0,s.jsx)(e.code,{children:"TextInputs"})," by design;"]}),"\n",(0,s.jsx)(e.li,{children:"you track user activity on the screen and if there is no activity for certain period of time then you do a certain action (logout for example). If you want to reset timer when user interacts with a keyboard - usage of this hook can be a good choice."}),"\n"]}),"\n",(0,s.jsx)(e.h3,{id:"onselectionchange",children:(0,s.jsx)(e.code,{children:"onSelectionChange"})}),"\n",(0,s.jsxs)(e.p,{children:["Fires an event whenever user selects text in focused ",(0,s.jsx)(e.code,{children:"TextInput"}),". Event has following structure:"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-ts",children:"type FocusedInputSelectionChangedEvent = {\n  target: number;\n  selection: {\n    start: {\n      x: number;\n      y: number;\n      position: number;\n    };\n    end: {\n      x: number;\n      y: number;\n      position: number;\n    };\n  };\n};\n"})}),"\n",(0,s.jsxs)(e.p,{children:["This handler can be handy when you need to have an access to input on a global level (i. e. when you don't have a direct access to your ",(0,s.jsx)(e.code,{children:"TextInput"}),") or if you need to have an access to coordinates of text selection (for example to draw a custom element that follows caret position):"]}),"\n","\n",(0,s.jsx)(l.A,{src:"/video/selection-demo.mov",width:60})]})}function u(a={}){const{wrapper:e}={...(0,n.R)(),...a.components};return e?(0,s.jsx)(e,{...a,children:(0,s.jsx)(f,{...a})}):f(a)}},78729:(a,e,t)=>{t.d(e,{A:()=>o});var s=t(96540),n=t(74848);function r(a){let{onHoverFocus:e,onHoverBlur:t}=a;return(0,n.jsxs)("svg",{style:{width:"100%",height:"100%"},viewBox:"0 0 413 804.93",xmlns:"http://www.w3.org/2000/svg",onMouseEnter:e,onMouseLeave:t,children:[(0,n.jsx)("g",{"data-name":"Layer 6",id:"Layer_6",children:(0,n.jsx)("rect",{fill:"#3b3b3b",height:"804.93",rx:"47.76",width:"413"})}),(0,n.jsxs)("g",{"data-name":"Layer 5",id:"Layer_5",children:[(0,n.jsx)("rect",{fill:"#fff",height:"771.21",id:"background",rx:"28.1",width:"379.29",x:"16.86",y:"16.86"}),(0,n.jsx)("rect",{fill:"#66e625",height:"54.13",rx:"19.77",width:"132.09",x:"35.88",y:"144.7"}),(0,n.jsx)("rect",{fill:"#e5e5e5",height:"54.13",rx:"19.77",width:"132.09",x:"35.88",y:"422.87"}),(0,n.jsx)("circle",{className:"dot dot-1",cx:"79.1",cy:"449.92",fill:"#a8a8a8",r:"8.22"}),(0,n.jsx)("circle",{className:"dot dot-2",cx:"103.56",cy:"449.94",fill:"#a8a8a8",r:"8.22"}),(0,n.jsx)("circle",{className:"dot dot-3",cx:"128.02",cy:"449.94",fill:"#a8a8a8",r:"8.22"}),(0,n.jsx)("rect",{fill:"#66e625",height:"54.13",rx:"19.77",width:"132.09",x:"35.88",y:"210.64"}),(0,n.jsx)("rect",{fill:"#59c3e6",height:"54.13",rx:"19.77",width:"132.09",x:"245.48",y:"352.34"})]}),(0,n.jsxs)("g",{"data-name":"Layer 8",id:"Layer_8",children:[(0,n.jsx)("path",{d:"M16.63,491.75H396.37a0,0,0,0,1,0,0V760.12A28.34,28.34,0,0,1,368,788.46H36.64a20,20,0,0,1-20-20V491.75A0,0,0,0,1,16.63,491.75Z"}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M109.36,644.88a5.06,5.06,0,0,1,5.07-5.06H136.7a5.06,5.06,0,0,1,5.07,5.06V678.3a5.07,5.07,0,0,1-5.07,5.06H114.43a5.07,5.07,0,0,1-5.07-5.06Z",fill:"#646464",id:"z",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{className:"symbol",d:"M119.32,670.2h12.49v-1.48H121.46v-.14l10.2-14.32v-1.19h-12v1.47h9.89v.15L119.32,669Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M147.84,644.88a5.06,5.06,0,0,1,5.07-5.06h22.27a5.06,5.06,0,0,1,5.07,5.06V678.3a5.07,5.07,0,0,1-5.07,5.06H152.91a5.07,5.07,0,0,1-5.07-5.06Z",fill:"#646464",id:"x",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M157.06,670.2h1.85l5-7.24H164l5,7.24h2L165,661.68v0l6-8.57h-1.85l-5,7.29h-.07l-5-7.29h-2l5.91,8.5v0Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M186.32,644.88a5.06,5.06,0,0,1,5.07-5.06h22.27a5.06,5.06,0,0,1,5.07,5.06V678.3a5.07,5.07,0,0,1-5.07,5.06H191.39a5.07,5.07,0,0,1-5.07-5.06Z",fill:"#646464",id:"c",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M202.94,670.55c3.63,0,6.34-2.09,6.82-5.22v0h-1.63c-.48,2.24-2.53,3.71-5.18,3.71-3.61,0-5.9-2.89-5.88-7.41s2.29-7.41,5.87-7.41a5.16,5.16,0,0,1,5.19,4.07v0h1.62v0a6.66,6.66,0,0,0-6.83-5.57c-4.64,0-7.54,3.43-7.54,8.91S198.28,670.56,202.94,670.55Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M224.8,644.88a5.06,5.06,0,0,1,5.07-5.06h22.28a5.06,5.06,0,0,1,5.06,5.06V678.3a5.07,5.07,0,0,1-5.06,5.06H229.87a5.07,5.07,0,0,1-5.07-5.06Z",fill:"#646464",id:"v",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M240.2,670.2h1.61l6.4-17.13H246.5l-5.42,15h-.16l-5.42-15h-1.71Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M263.28,644.88a5.06,5.06,0,0,1,5.07-5.06h22.28a5.06,5.06,0,0,1,5.06,5.06V678.3a5.07,5.07,0,0,1-5.06,5.06H268.35a5.07,5.07,0,0,1-5.07-5.06Z",fill:"#646464",id:"b",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M273.85,670.2h6.24c3.8,0,5.89-1.78,5.89-4.68a4.22,4.22,0,0,0-4-4.25v-.14a3.85,3.85,0,0,0,3.13-3.83c0-2.57-2-4.23-5.1-4.23h-6.15Zm5.83-15.69c5.27-.12,5,6.5-.37,6.17h-3.83v-6.17Zm0,7.57c2.91,0,4.6,1.2,4.6,3.33s-1.47,3.35-4.47,3.35h-4.37v-6.68Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M301.76,644.88a5.06,5.06,0,0,1,5.07-5.06h22.28a5.06,5.06,0,0,1,5.06,5.06V678.3a5.07,5.07,0,0,1-5.06,5.06H306.83a5.07,5.07,0,0,1-5.07-5.06Z",fill:"#646464",id:"n",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M311.3,670.2h1.6V656h.15l10,14.23h1.57V653.07H323v14.22h-.15l-10-14.22h-1.6Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M340.25,644.88a5.05,5.05,0,0,1,5.06-5.06h22.28a5.06,5.06,0,0,1,5.06,5.06V678.3a5.07,5.07,0,0,1-5.06,5.06H345.31a5.06,5.06,0,0,1-5.06-5.06Z",fill:"#646464",id:"m",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M348.2,670.2h1.52v-14h.12l5.9,14h1.41l5.91-14h.12v14h1.52V653.07h-1.88l-6.3,15h-.14l-6.32-15H348.2Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M72.65,590.2a5.07,5.07,0,0,1,5.07-5.07H100a5.07,5.07,0,0,1,5.06,5.07v33.41a5.07,5.07,0,0,1-5.06,5.07H77.72a5.07,5.07,0,0,1-5.07-5.07Z",fill:"#646464",id:"a",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M81.64,615.51h1.71l1.9-5.24h7.2l1.9,5.24h1.71l-6.41-17.12H88Zm7.13-15h.15l3,8.36H85.75Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M111.13,590.2a5.07,5.07,0,0,1,5.07-5.07h22.28a5.07,5.07,0,0,1,5.06,5.07v33.41a5.07,5.07,0,0,1-5.06,5.07H116.2a5.07,5.07,0,0,1-5.07-5.07Z",fill:"#646464",id:"s",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M127.42,615.87c3.7,0,6.17-2,6.16-5,0-2.39-1.44-3.83-5-4.63l-1.75-.41c-2.6-.59-3.66-1.55-3.66-3.06,0-4.23,8-4.14,8.45-.28v.14h1.63c-.24-6.06-11.76-6.07-11.74.18,0,6.41,10.25,3.17,10.41,8.25,0,4.54-9.08,4.32-9.22,0h-1.63C121.28,613.87,123.74,615.87,127.42,615.87Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M149.62,590.2a5.06,5.06,0,0,1,5.06-5.07H177A5.07,5.07,0,0,1,182,590.2v33.41a5.07,5.07,0,0,1-5.06,5.07H154.68a5.06,5.06,0,0,1-5.06-5.07Z",fill:"#646464",id:"d",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M159.28,615.51h5.64c5.23,0,8.12-3.24,8.12-8.55s-2.89-8.57-8.12-8.57h-5.64ZM160.9,614V599.86h3.92c4.19,0,6.57,2.69,6.56,7.11S169,614,164.82,614Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M188.1,590.2a5.06,5.06,0,0,1,5.06-5.07h22.28a5.07,5.07,0,0,1,5.06,5.07v33.41a5.07,5.07,0,0,1-5.06,5.07H193.16a5.06,5.06,0,0,1-5.06-5.07Z",fill:"#646464",id:"f",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M199.63,615.51h1.63v-7.77h7.84v-1.45h-7.84v-6.43h8.53v-1.47H199.63Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M226.58,590.2a5.06,5.06,0,0,1,5.06-5.07h22.28A5.07,5.07,0,0,1,259,590.2v33.41a5.07,5.07,0,0,1-5.06,5.07H231.64a5.06,5.06,0,0,1-5.06-5.07Z",fill:"#646464",id:"g",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M243,615.87c5.31-.06,7.54-3.93,7.14-8.89h-6.92v1.44h5.3c.17,3.42-2,6-5.52,5.94-3.64,0-6-2.88-6-7.44s2.32-7.38,6-7.38a5.12,5.12,0,0,1,5.33,3.74l0,.11H250c-.63-3.26-3.3-5.36-7-5.36-4.61,0-7.62,3.49-7.62,8.87S238.33,615.87,243,615.87Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M265.06,590.2a5.06,5.06,0,0,1,5.06-5.07H292.4a5.07,5.07,0,0,1,5.06,5.07v33.41a5.07,5.07,0,0,1-5.06,5.07H270.12a5.06,5.06,0,0,1-5.06-5.07Z",fill:"#646464",id:"h",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M274.63,615.51h1.62v-8h10v8h1.62V598.39h-1.62V606h-10v-7.62h-1.62Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M303.54,590.2a5.06,5.06,0,0,1,5.06-5.07h22.28a5.07,5.07,0,0,1,5.06,5.07v33.41a5.07,5.07,0,0,1-5.06,5.07H308.6a5.06,5.06,0,0,1-5.06-5.07Z",fill:"#646464",id:"j",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M319.09,615.87c3.06,0,4.91-1.9,4.91-5V598.39h-1.63v12.4c.37,4.38-6,4.83-6.36.85v-.08h-1.62v.12A4.36,4.36,0,0,0,319.09,615.87Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M342,590.2a5.06,5.06,0,0,1,5.06-5.07h22.28a5.07,5.07,0,0,1,5.06,5.07v33.41a5.07,5.07,0,0,1-5.06,5.07H347.08a5.06,5.06,0,0,1-5.06-5.07Z",fill:"#646464",id:"k",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M352.63,615.51h1.63V609.4l2.29-2.49,6.58,8.6h2.1l-7.56-9.73,6.86-7.39h-2l-8.1,8.85h-.14v-8.85h-1.63Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M380.5,590.2a5.07,5.07,0,0,1,5.06-5.07h22.28a5.06,5.06,0,0,1,5.06,5.07v33.41a5.06,5.06,0,0,1-5.06,5.07H385.56a5.07,5.07,0,0,1-5.06-5.07Z",fill:"#646464",id:"l",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M392.13,615.51h10.2V614h-8.57V598.39h-1.63Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M55.69,535.51a5.07,5.07,0,0,1,5.07-5.06H82a5.06,5.06,0,0,1,5.06,5.06v33.42A5.05,5.05,0,0,1,82,574H60.76a5.06,5.06,0,0,1-5.07-5.06Z",fill:"#646464",id:"q",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M71.39,561.19a8.14,8.14,0,0,0,3.24-.63l1.66,2.29h1.84l-2.21-3c2.06-1.49,3.23-4.15,3.22-7.57,0-5.43-3-8.89-7.76-8.89s-7.76,3.46-7.75,8.91S66.57,561.19,71.39,561.19Zm0-1.5c-8.19.28-8.16-15.12,0-14.83,6.58-.33,8,10.09,3.6,13.66l-1.73-2.38H71.41l2.28,3.12A6.08,6.08,0,0,1,71.39,559.69Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M93.16,535.51a5.07,5.07,0,0,1,5.06-5.06h21.27a5.06,5.06,0,0,1,5.06,5.06v33.42a5.05,5.05,0,0,1-5.06,5.06H98.22a5.06,5.06,0,0,1-5.06-5.06Z",fill:"#646464",id:"w",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M103.09,560.83h1.51l4.2-14.3h.12l4.2,14.3h1.5l4.71-17.12h-1.68l-3.76,14.59h-.11l-4.12-14.59h-1.61l-4.12,14.59h-.11l-3.76-14.59H98.38Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M130.63,535.51a5.07,5.07,0,0,1,5.06-5.06H157a5.07,5.07,0,0,1,5.06,5.06v33.42A5.06,5.06,0,0,1,157,574H135.69a5.06,5.06,0,0,1-5.06-5.06Z",fill:"#646464",id:"e",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M141.41,560.83h10.35v-1.47H143v-6.58h8.28v-1.44H143v-6.16h8.72v-1.47H141.41Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M168.1,535.51a5.06,5.06,0,0,1,5.06-5.06h21.26a5.07,5.07,0,0,1,5.07,5.06v33.42a5.06,5.06,0,0,1-5.07,5.06H173.16a5.05,5.05,0,0,1-5.06-5.06Z",fill:"#646464",id:"r",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M178.21,560.83h1.63v-7h4.63l3.94,7h1.9l-4.16-7.27c5.72-1.53,4.5-10.22-1.8-9.85h-6.14Zm1.63-8.46v-7.22c3.22.13,8.26-1,8.32,3.62,0,2.28-1.46,3.6-3.94,3.6Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M205.56,535.51a5.07,5.07,0,0,1,5.07-5.06h21.26a5.07,5.07,0,0,1,5.07,5.06v33.42a5.06,5.06,0,0,1-5.07,5.06H210.63a5.06,5.06,0,0,1-5.07-5.06Z",fill:"#646464",id:"t",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M220.45,560.83h1.62V545.18h5.74v-1.47h-13.1v1.47h5.74Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M243,535.51a5.07,5.07,0,0,1,5.06-5.06h21.27a5.06,5.06,0,0,1,5.06,5.06v33.42a5.05,5.05,0,0,1-5.06,5.06H248.09a5.06,5.06,0,0,1-5.06-5.06Z",fill:"#646464",id:"y",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M257.92,560.83h1.61v-7.4l6.14-9.72h-1.85l-5,8.07h-.14l-5-8.07h-1.87l6.15,9.72Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M280.5,535.51a5.07,5.07,0,0,1,5.06-5.06h21.27a5.07,5.07,0,0,1,5.06,5.06v33.42a5.06,5.06,0,0,1-5.06,5.06H285.56a5.06,5.06,0,0,1-5.06-5.06Z",fill:"#646464",id:"u",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M296.2,561.19c4.11,0,6.62-2.52,6.62-6.26V543.71h-1.63v11.13c0,2.9-1.85,4.84-5,4.84s-5-1.94-5-4.84V543.71h-1.62v11.22C289.56,558.67,292.08,561.19,296.2,561.19Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M318,535.51a5.06,5.06,0,0,1,5.06-5.06H344.3a5.07,5.07,0,0,1,5.06,5.06v33.42A5.06,5.06,0,0,1,344.3,574H323a5.05,5.05,0,0,1-5.06-5.06Z",fill:"#646464",id:"i",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M332.84,560.83h1.63V543.71h-1.63Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M355.43,535.51a5.07,5.07,0,0,1,5.07-5.06h21.26a5.07,5.07,0,0,1,5.07,5.06v33.42a5.06,5.06,0,0,1-5.07,5.06H360.5a5.06,5.06,0,0,1-5.07-5.06Z",fill:"#646464",id:"o",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M371.13,561.19c4.83,0,7.76-3.49,7.75-8.94s-3-8.9-7.75-8.9-7.76,3.43-7.76,8.9S366.29,561.19,371.13,561.19Zm0-1.51c-3.79,0-6.11-2.93-6.1-7.43-.24-9.9,12.44-9.9,12.2,0C377.24,556.75,374.89,559.68,371.13,559.68Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M392.9,535.51a5.07,5.07,0,0,1,5.07-5.06h21.26a5.06,5.06,0,0,1,5.06,5.06v33.42a5.05,5.05,0,0,1-5.06,5.06H398a5.06,5.06,0,0,1-5.07-5.06Z",fill:"#646464",id:"p",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M403.25,560.83h1.62v-6.46h4.45c7.31.12,7.34-10.8,0-10.66h-6.07Zm5.69-15.68a3.9,3.9,0,1,1,0,7.78h-4.07v-7.78Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button-secondary-2",d:"M53.67,644.88a5.05,5.05,0,0,1,5.06-5.06H91.14a5.06,5.06,0,0,1,5.06,5.06V678.3a5.07,5.07,0,0,1-5.06,5.06H58.73a5.06,5.06,0,0,1-5.06-5.06Z",fill:"#d3d3d3",id:"shift",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M70.51,663.76H65.82a.51.51,0,0,1-.36-.86l9.11-9.41a.5.5,0,0,1,.73,0l9.11,9.41a.51.51,0,0,1-.36.86h-4.7v5.58a.51.51,0,0,1-.51.5H71a.51.51,0,0,1-.51-.5Z",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button-secondary",d:"M384.8,644.88a5.06,5.06,0,0,1,5.06-5.06h32.41a5.05,5.05,0,0,1,5.06,5.06v32.4a5.06,5.06,0,0,1-5.06,5.07H389.86a5.07,5.07,0,0,1-5.06-5.07Z",fill:"#3f3f3f",id:"backspace",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M405.27,658.58a.76.76,0,0,1,1.08-1.08l2.5,2.51,2.51-2.51a.76.76,0,1,1,1.07,1.08l-2.5,2.5,2.5,2.51a.76.76,0,0,1-1.07,1.07l-2.51-2.5-2.5,2.5a.76.76,0,0,1-1.08-1.07l2.51-2.51Z",fill:"#fff",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M402.14,653.36l-7.72,7.72,7.72,7.72a3,3,0,0,0,2.15.89h10.38a3,3,0,0,0,3-3V655.51a3,3,0,0,0-3-3H404.29A3,3,0,0,0,402.14,653.36Zm12.53,15H404.29a1.72,1.72,0,0,1-1.22-.5l-6.79-6.79,6.79-6.78a1.69,1.69,0,0,1,1.22-.51h10.38a1.72,1.72,0,0,1,1.73,1.72v11.14A1.72,1.72,0,0,1,414.67,668.37Z",fill:"#fff",fillRule:"evenodd",transform:"translate(-34 -30.6)"})]}),(0,n.jsx)("path",{d:"M176.2,804.88H304.8a3,3,0,0,1,3,3h0a3,3,0,0,1-3,3H176.2a3,3,0,0,1-3-3h0A3,3,0,0,1,176.2,804.88Z",fill:"#fff",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M390.88,766.27a4.27,4.27,0,0,0-4.27,4.26v9.87a4.27,4.27,0,0,0,8.53,0v-9.87A4.26,4.26,0,0,0,390.88,766.27Zm-2.44,4.26v9.88a2.44,2.44,0,0,0,4.87,0v-9.88A2.44,2.44,0,0,0,388.44,770.53Z",fill:"#939393",fillRule:"evenodd",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M391.87,789.69v-2.54c5.48-.34,7-5.24,6.65-9.53v0a.91.91,0,1,0-1.82,0c.22,4.19-.53,8.1-5.76,8.06-3.72,0-5.88-2.56-5.88-6.28v-1.72a.91.91,0,1,0-1.82,0v1.72c0,3.73,2.65,7.54,6.77,7.81v2.54h-3.42a.92.92,0,0,0-.92.92.91.91,0,0,0,.92.91h8.61a.92.92,0,0,0,0-1.83Z",fill:"#939393",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M90.12,792.85a13.29,13.29,0,0,1-13.29-13.29c.7-17.63,25.89-17.62,26.58,0A13.29,13.29,0,0,1,90.12,792.85Zm0-1.33a12,12,0,0,0,12-12c-.63-15.87-23.29-15.86-23.92,0A12,12,0,0,0,90.12,791.52Zm0-2.65c-4.74,0-9.24-4.55-9.24-7.83,0-1.89,4.1.38,9.24.38s9.27-2.26,9.26-.38C99.35,784.22,94.84,788.87,90.11,788.87Zm0-4.19c4.4,0,7.45-1.7,7.45-2.93s-3,.73-7.45.73-7.4-1.72-7.4-.73S85.7,784.68,90.11,784.68Zm-4-7.48a1.58,1.58,0,0,1,0-3.15A1.58,1.58,0,0,1,86.12,777.2Zm8,0a1.58,1.58,0,0,1,0-3.15A1.58,1.58,0,0,1,94.09,777.2Z",fill:"#939393",fillRule:"evenodd",transform:"translate(-34 -30.6)"}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button",d:"M147.84,701.59a5.07,5.07,0,0,1,5.07-5.07H327.08a5.06,5.06,0,0,1,5.06,5.07V735a5.06,5.06,0,0,1-5.06,5.07H152.91a5.07,5.07,0,0,1-5.07-5.07Z",fill:"#646464",id:"_",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M222.2,724c3.63.15,5-4.14,1-4.89l-1.31-.32c-2.23-.37-1.64-2.51.32-2.48a1.76,1.76,0,0,1,1.88,1.14h1.35c-.29-3.13-6.41-3-6.39.2,0,1.23.72,1.93,2.32,2.31.92.22,2.94.53,2.81,1.55,0,1.72-3.67,1.76-4,.16h-1.41C219,723.1,220.3,724,222.2,724Zm5.23,2.69h1.37v-4.19h.13a2.94,2.94,0,0,0,2.66,1.5c2.16,0,3.57-1.74,3.57-4.41s-1.41-4.43-3.57-4.42a2.91,2.91,0,0,0-2.66,1.51h-.13v-1.36h-1.37Zm3.84-3.91c-3.34.18-3.34-6.58,0-6.39C234.6,716.2,234.6,723,231.27,722.8Zm8.06,1.22a2.84,2.84,0,0,0,2.58-1.41H242v1.26h1.38V718c.28-3.63-6.17-3.75-6.59-.56h1.37c.44-1.59,4.08-1.42,3.84.56v.77l-2.45.15C235.44,718.92,235.54,724,239.33,724Zm-1.44-2.57c-.11-1.77,2.88-1.36,4.15-1.54v.78a2.23,2.23,0,0,1-2.42,2.13C238.63,722.82,237.89,722.32,237.89,721.45ZM249.1,724a3.3,3.3,0,0,0,3.54-2.65l0-.08h-1.37a2.07,2.07,0,0,1-2.2,1.51c-1.53,0-2.51-1.28-2.5-3.24s1-3.15,2.5-3.15a2.12,2.12,0,0,1,2.2,1.51v0h1.37a3.31,3.31,0,0,0-3.57-2.76C243.84,715,243.91,724.23,249.1,724Zm8.73,0a3.4,3.4,0,0,0,3.54-2.36H260a2.15,2.15,0,0,1-2.13,1.13c-1.52,0-2.49-1-2.53-2.79h6.14c.19-2.63-1.19-4.87-3.73-4.81C252.66,715,252.6,724.27,257.83,724Zm-.09-7.61c1.25,0,2.19.8,2.33,2.49h-4.72A2.41,2.41,0,0,1,257.74,716.41Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button-primary",d:"M339.23,701.59a5.07,5.07,0,0,1,5.07-5.07h78a5.06,5.06,0,0,1,5.06,5.07V735a5.06,5.06,0,0,1-5.06,5.07h-78a5.07,5.07,0,0,1-5.07-5.07Z",fill:"#0f77f0",id:"return",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M362.37,723.87h1.38v-5.29c-.06-1.61,1.63-2.36,3.09-2v-1.34c-1.18-.25-2.65.24-3,1.36h-.13v-1.26h-1.38Zm9.09.15a3.38,3.38,0,0,0,3.54-2.36h-1.38a2.15,2.15,0,0,1-2.13,1.13c-1.51,0-2.49-1-2.53-2.79h6.14c.19-2.63-1.18-4.87-3.72-4.81C366.3,715,366.23,724.27,371.46,724Zm-.09-7.61c1.26,0,2.19.8,2.33,2.49H369A2.4,2.4,0,0,1,371.37,716.41Zm8.57,7.52a4.34,4.34,0,0,0,.8-.08v-1.17c-1,.14-1.94,0-1.86-1.38v-4.82h1.86v-1.14h-1.86v-2.21h-1.43v2.21h-1.34v1.14h1.34v5.17C377.45,723.28,378.19,723.93,379.94,723.93Zm5.39.09a2.56,2.56,0,0,0,2.53-1.43H388v1.28h1.38v-8.53H388v5a2.15,2.15,0,0,1-2.3,2.42c-1.36,0-1.92-.74-1.92-2.27v-5.19H382.4v5.52C382.4,722.88,383.39,724,385.33,724Zm6.28-.15H393v-5.29c-.05-1.61,1.63-2.36,3.09-2v-1.34c-1.18-.25-2.65.24-3,1.36H393v-1.26h-1.38Zm6,0H399v-5a2.16,2.16,0,0,1,2.23-2.41c1.36,0,2,.73,2,2.27v5.19h1.38v-5.53c0-2-1.07-3.15-3-3.15a2.52,2.52,0,0,0-2.49,1.43H399v-1.28h-1.37Z",fill:"#fff",transform:"translate(-34 -30.6)"})]}),(0,n.jsxs)("g",{className:"keyboard-button-group",children:[(0,n.jsx)("path",{className:"keyboard-button-secondary",d:"M53.67,701.59a5.06,5.06,0,0,1,5.06-5.07h78a5.07,5.07,0,0,1,5.07,5.07V735a5.07,5.07,0,0,1-5.07,5.07h-78A5.06,5.06,0,0,1,53.67,735Z",fill:"#3f3f3f",id:"123",transform:"translate(-34 -30.6)"}),(0,n.jsx)("path",{d:"M88.54,723.87H90V712.45H88.55l-3,2.18v1.51L88.42,714h.12Zm4.4,0h7.39v-1.29H94.92v-.12l2.6-2.68c2.06-2.13,2.62-3.08,2.62-4.39a3.29,3.29,0,0,0-3.52-3.21,3.51,3.51,0,0,0-3.76,3.48h1.38v0c-.11-2.9,4.51-3,4.44-.12,0,1-.43,1.59-1.89,3.17l-3.86,4.17Zm13.34.19c4.36.19,5.67-5.63,1.17-6.14v0a2.74,2.74,0,0,0,2.42-2.69c0-4.05-7.34-3.83-7.4.24h1.37a2.17,2.17,0,0,1,2.43-2c3-.12,2.77,4-.14,3.88h-1.37v1.2h1.43c3.38-.16,3.54,4.31.09,4.25-1.55,0-2.59-.8-2.67-2h-1.37C102.35,722.7,103.88,724.05,106.28,724.06Z",fill:"#fff",transform:"translate(-34 -30.6)"})]})]}),(0,n.jsx)("g",{"data-name":"Layer 4",id:"Layer_4",children:(0,n.jsx)("path",{d:"M157.62,30.6H324.79V50.26a14,14,0,0,1-14.05,14.05H171.67a14,14,0,0,1-14-14.05Z",fill:"#3b3b3b",id:"notch",transform:"translate(-34 -30.6)"})}),(0,n.jsxs)("g",{"data-name":"Layer 10",id:"Layer_10",children:[(0,n.jsx)("rect",{fill:"#59c3e6",height:"54.13",rx:"19.77",width:"132.09",x:"245.48",y:"67.37"}),(0,n.jsx)("rect",{fill:"#59c3e6",height:"54.13",rx:"21.14",width:"132.09",x:"245.48",y:"285.57"})]})]})}const l="Hello, World!".toLowerCase().replace(/ /g,"_");const o=function(){const a=(0,s.useRef)(null),e=(0,s.useRef)(""),t=(0,s.useCallback)((()=>{document.getElementById(e.current)?.classList.remove("hover")}),[]),o=(0,s.useCallback)((()=>{clearInterval(a.current),t()}),[t]),d=(0,s.useCallback)((()=>{let s=0;a.current=setInterval((()=>{s>=l.length?s=0:(setTimeout(t,200),e.current=l[s++],"zxcvbnmasdfghjklqwertyuiop_".includes(e.current)&&document.getElementById(e.current)?.classList.add("hover"))}),350)}),[t]);return(0,s.useEffect)((()=>(d(),o)),[d,o]),(0,n.jsx)(r,{onHoverBlur:d,onHoverFocus:o})}},69026:(a,e,t)=>{t.d(e,{A:()=>r});var s=t(86025),n=(t(96540),t(74848));function r(a){let{src:e,width:t=100,...r}=a;const l=(0,s.Ay)(e);return(0,n.jsx)("div",{className:"center video",children:(0,n.jsx)("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,height:"100%",src:l,width:`${t}%`,...r})})}},28453:(a,e,t)=>{t.d(e,{R:()=>l,x:()=>o});var s=t(96540);const n={},r=s.createContext(n);function l(a){const e=s.useContext(r);return s.useMemo((function(){return"function"==typeof a?a(e):{...e,...a}}),[e,a])}function o(a){let e;return e=a.disableParentContext?"function"==typeof a.components?a.components(n):a.components||n:l(a.components),s.createElement(r.Provider,{value:e},a.children)}}}]);