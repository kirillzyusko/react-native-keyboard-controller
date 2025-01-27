"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5625],{82211:(e,o,s)=>{s.r(o),s.d(o,{assets:()=>a,contentTitle:()=>i,default:()=>h,frontMatter:()=>d,metadata:()=>r,toc:()=>l});var n=s(74848),t=s(28453);const d={sidebar_position:5,keywords:["react-native-keyboard-controller","react-native","KeyboardController","module","dismiss","dismiss keyboard","windowSoftInputMode","adjustResize","adjustPan"]},i="KeyboardController",r={id:"api/keyboard-controller",title:"KeyboardController",description:"The KeyboardController module in React Native provides a convenient set of methods for managing the behavior of the keyboard. With seamless runtime adjustments, this module allows developers to dynamically change the windowSoftInputMode on Android and dismiss the keyboard on both platforms.",source:"@site/versioned_docs/version-1.15.0/api/keyboard-controller.md",sourceDirName:"api",slug:"/api/keyboard-controller",permalink:"/react-native-keyboard-controller/pr-preview/pr-783/docs/1.15.0/api/keyboard-controller",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.15.0/api/keyboard-controller.md",tags:[],version:"1.15.0",sidebarPosition:5,frontMatter:{sidebar_position:5,keywords:["react-native-keyboard-controller","react-native","KeyboardController","module","dismiss","dismiss keyboard","windowSoftInputMode","adjustResize","adjustPan"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardGestureArea",permalink:"/react-native-keyboard-controller/pr-preview/pr-783/docs/1.15.0/api/keyboard-gesture-area"},next:{title:"KeyboardEvents",permalink:"/react-native-keyboard-controller/pr-preview/pr-783/docs/1.15.0/api/keyboard-events"}},a={},l=[{value:"Methods",id:"methods",level:2},{value:'<code>setInputMode</code> <div class="label android"></div>',id:"setinputmode-",level:3},{value:'<code>setDefaultMode</code> <div class="label android"></div>',id:"setdefaultmode-",level:3},{value:"<code>dismiss</code>",id:"dismiss",level:3},{value:"<code>isVisible</code>",id:"isvisible",level:3},{value:"<code>state</code>",id:"state",level:3},{value:"<code>setFocusTo</code>",id:"setfocusto",level:3}];function c(e){const o={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.h1,{id:"keyboardcontroller",children:"KeyboardController"}),"\n",(0,n.jsxs)(o.p,{children:["The ",(0,n.jsx)(o.code,{children:"KeyboardController"})," module in React Native provides a convenient set of methods for managing the behavior of the keyboard. With seamless runtime adjustments, this module allows developers to dynamically change the ",(0,n.jsx)(o.code,{children:"windowSoftInputMode"})," on Android and dismiss the keyboard on both platforms."]}),"\n",(0,n.jsx)(o.h2,{id:"methods",children:"Methods"}),"\n",(0,n.jsxs)(o.h3,{id:"setinputmode-",children:[(0,n.jsx)(o.code,{children:"setInputMode"})," ",(0,n.jsx)("div",{className:"label android"})]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"static setInputMode(mode: AndroidSoftInputModes): void;\n"})}),"\n",(0,n.jsxs)(o.p,{children:["This method is used to dynamically change the ",(0,n.jsx)(o.code,{children:"windowSoftInputMode"})," (",(0,n.jsx)(o.code,{children:"softwareKeyboardLayoutMode"})," in Expo terminology) during runtime in an Android application. It takes an argument that specifies the desired input mode. The example provided sets the input mode to ",(0,n.jsx)(o.code,{children:"SOFT_INPUT_ADJUST_RESIZE"}),":"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);\n"})}),"\n",(0,n.jsx)(o.admonition,{title:"Understanding how different modes works",type:"tip",children:(0,n.jsxs)(o.p,{children:["To understand the difference between ",(0,n.jsx)(o.code,{children:"adjustResize"}),"/",(0,n.jsx)(o.code,{children:"adjustPan"}),"/",(0,n.jsx)(o.code,{children:"adjustNothing"})," behavior you can look into this ",(0,n.jsx)(o.a,{href:"https://stackoverflow.com/a/71301500/9272042",children:"post"}),"."]})}),"\n",(0,n.jsx)(o.admonition,{type:"info",children:(0,n.jsxs)(o.p,{children:["A combination of ",(0,n.jsx)(o.code,{children:"adjustResize"})," + ",(0,n.jsx)(o.code,{children:"edge-to-edge"})," mode will result in behavior similar to ",(0,n.jsx)(o.code,{children:"adjustNothing"})," - in this case window is not resized automatically and content is not moved along with the keyboard position. And it becomes a responsibility of developer to handle keyboard appearance (thus it'll match iOS behavior)."]})}),"\n",(0,n.jsxs)(o.h3,{id:"setdefaultmode-",children:[(0,n.jsx)(o.code,{children:"setDefaultMode"})," ",(0,n.jsx)("div",{className:"label android"})]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"static setDefaultMode(): void;\n"})}),"\n",(0,n.jsxs)(o.p,{children:["This method is used to restore the default ",(0,n.jsx)(o.code,{children:"windowSoftInputMode"})," (",(0,n.jsx)(o.code,{children:"softwareKeyboardLayoutMode"})," in Expo terminology) declared in the ",(0,n.jsx)(o.code,{children:"AndroidManifest.xml"})," (or ",(0,n.jsx)(o.code,{children:"app.json"})," in Expo case). It resets the input mode to the default value:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"KeyboardController.setDefaultMode();\n"})}),"\n",(0,n.jsx)(o.h3,{id:"dismiss",children:(0,n.jsx)(o.code,{children:"dismiss"})}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"static dismiss(options?: DismissOptions): Promise<void>;\n"})}),"\n",(0,n.jsx)(o.p,{children:"This method is used to hide the keyboard. It triggers the dismissal of the keyboard. The method returns promise that will be resolved only when keyboard is fully hidden (if keyboard is already hidden it will resolve immediately):"}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"await KeyboardController.dismiss();\n"})}),"\n",(0,n.jsxs)(o.p,{children:["If you want to hide a keyboard and keep focus then you can pass ",(0,n.jsx)(o.code,{children:"keepFocus"})," option:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"await KeyboardController.dismiss({ keepFocus: true });\n"})}),"\n",(0,n.jsxs)(o.admonition,{type:"info",children:[(0,n.jsxs)(o.mdxAdmonitionTitle,{children:["What is the difference comparing to ",(0,n.jsx)(o.code,{children:"react-native"})," implementation?"]}),(0,n.jsxs)(o.p,{children:["The equivalent method from ",(0,n.jsx)(o.code,{children:"react-native"})," relies on specific internal components, such as ",(0,n.jsx)(o.code,{children:"TextInput"}),", and may not work as intended if a custom input component is used."]}),(0,n.jsx)(o.p,{children:"In contrast, the described method enables keyboard dismissal for any focused input, extending functionality beyond the limitations of the default implementation."})]}),"\n",(0,n.jsx)(o.h3,{id:"isvisible",children:(0,n.jsx)(o.code,{children:"isVisible"})}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"static isVisible(): boolean;\n"})}),"\n",(0,n.jsxs)(o.p,{children:["This method returns ",(0,n.jsx)(o.code,{children:"true"})," if keyboard is currently visible and ",(0,n.jsx)(o.code,{children:"false"})," otherwise."]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"if (KeyboardController.isVisible()) {\n  // do something\n}\n"})}),"\n",(0,n.jsx)(o.h3,{id:"state",children:(0,n.jsx)(o.code,{children:"state"})}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:"static state(): KeyboardEventData | null;\n"})}),"\n",(0,n.jsxs)(o.p,{children:["This method returns the last keyboard state. It returns ",(0,n.jsx)(o.code,{children:"null"})," if keyboard was not shown in the app yet."]}),"\n",(0,n.jsx)(o.h3,{id:"setfocusto",children:(0,n.jsx)(o.code,{children:"setFocusTo"})}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:'static setFocusTo(direction: "prev" | "current" | "next"): void;\n'})}),"\n",(0,n.jsx)(o.p,{children:"This method sets focus to the selected field. Possible values:"}),"\n",(0,n.jsxs)(o.ul,{children:["\n",(0,n.jsxs)(o.li,{children:[(0,n.jsx)(o.code,{children:"prev"})," - set focus to the previous field;"]}),"\n",(0,n.jsxs)(o.li,{children:[(0,n.jsx)(o.code,{children:"current"})," - set focus to the last focused field (i. e. if keyboard was closed you can restore focus);"]}),"\n",(0,n.jsxs)(o.li,{children:[(0,n.jsx)(o.code,{children:"next"})," - set focus to the next field."]}),"\n"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-ts",children:'KeyboardController.setFocusTo("next");\n'})})]})}function h(e={}){const{wrapper:o}={...(0,t.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},28453:(e,o,s)=>{s.d(o,{R:()=>i,x:()=>r});var n=s(96540);const t={},d=n.createContext(t);function i(e){const o=n.useContext(d);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function r(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),n.createElement(d.Provider,{value:o},e.children)}}}]);