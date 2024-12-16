"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6524],{83891:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>a,contentTitle:()=>d,default:()=>p,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var r=n(74848),t=n(28453);const i={sidebar_position:5,keywords:["react-native-keyboard-controller","KeyboardController","module","windowSoftInputMode","adjustResize","adjustPan"]},d="KeyboardController",s={id:"api/keyboard-controller",title:"KeyboardController",description:"KeyboardController is an object which has two functions:",source:"@site/versioned_docs/version-1.6.0/api/keyboard-controller.md",sourceDirName:"api",slug:"/api/keyboard-controller",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/docs/1.6.0/api/keyboard-controller",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.6.0/api/keyboard-controller.md",tags:[],version:"1.6.0",sidebarPosition:5,frontMatter:{sidebar_position:5,keywords:["react-native-keyboard-controller","KeyboardController","module","windowSoftInputMode","adjustResize","adjustPan"]},sidebar:"tutorialSidebar",previous:{title:"KeyboardGestureArea",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/docs/1.6.0/api/keyboard-gesture-area"},next:{title:"KeyboardEvents",permalink:"/react-native-keyboard-controller/pr-preview/pr-733/docs/1.6.0/api/keyboard-events"}},a={},l=[{value:"Example",id:"example",level:2}];function c(e){const o={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.h1,{id:"keyboardcontroller",children:"KeyboardController"}),"\n",(0,r.jsxs)(o.p,{children:[(0,r.jsx)(o.code,{children:"KeyboardController"})," is an object which has two functions:"]}),"\n",(0,r.jsxs)(o.ul,{children:["\n",(0,r.jsxs)(o.li,{children:[(0,r.jsx)(o.code,{children:"setInputMode"})," - used to change ",(0,r.jsx)(o.code,{children:"windowSoftInputMode"})," in runtime;"]}),"\n",(0,r.jsxs)(o.li,{children:[(0,r.jsx)(o.code,{children:"setDefaultMode"})," - used to restore default ",(0,r.jsx)(o.code,{children:"windowSoftInputMode"})," (which is declared in ",(0,r.jsx)(o.code,{children:"AndroidManifest.xml"}),");"]}),"\n"]}),"\n",(0,r.jsx)(o.admonition,{title:"Understanding how different modes works",type:"tip",children:(0,r.jsxs)(o.p,{children:["To understand the difference between ",(0,r.jsx)(o.code,{children:"adjustResize"}),"/",(0,r.jsx)(o.code,{children:"adjustPan"}),"/",(0,r.jsx)(o.code,{children:"adjustNothing"})," behavior you can look into this ",(0,r.jsx)(o.a,{href:"https://stackoverflow.com/a/71301500/9272042",children:"post"}),"."]})}),"\n",(0,r.jsx)(o.admonition,{type:"info",children:(0,r.jsxs)(o.p,{children:["A combination of ",(0,r.jsx)(o.code,{children:"adjustResize"})," + ",(0,r.jsx)(o.code,{children:"edge-to-edge"})," mode will result in behavior similar to ",(0,r.jsx)(o.code,{children:"adjustNothing"})," - in this case window is not resized automatically and content is not moved along with the keyboard position. And it becomes a responsibility of developer to handle keyboard appearance (thus it'll match iOS behavior)."]})}),"\n",(0,r.jsx)(o.h2,{id:"example",children:"Example"}),"\n",(0,r.jsx)(o.pre,{children:(0,r.jsx)(o.code,{className:"language-ts",children:'import {\n  KeyboardController,\n  AndroidSoftInputModes,\n} from "react-native-keyboard-controller";\n\nexport const useResizeMode = () => {\n  useEffect(() => {\n    KeyboardController.setInputMode(\n      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,\n    );\n\n    return () => KeyboardController.setDefaultMode();\n  }, []);\n};\n'})})]})}function p(e={}){const{wrapper:o}={...(0,t.R)(),...e.components};return o?(0,r.jsx)(o,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},28453:(e,o,n)=>{n.d(o,{R:()=>d,x:()=>s});var r=n(96540);const t={},i=r.createContext(t);function d(e){const o=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function s(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:d(e.components),r.createElement(i.Provider,{value:o},e.children)}}}]);