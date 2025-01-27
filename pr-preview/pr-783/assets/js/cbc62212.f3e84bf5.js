"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6966],{55602:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>a,toc:()=>d});var r=t(74848),n=t(28453);const s={sidebar_position:3},o="Compatibility",a={id:"guides/compatibility",title:"Compatibility",description:"react-native",source:"@site/versioned_docs/version-1.4.0/guides/compatibility.md",sourceDirName:"guides",slug:"/guides/compatibility",permalink:"/react-native-keyboard-controller/pr-preview/pr-783/docs/1.4.0/guides/compatibility",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.4.0/guides/compatibility.md",tags:[],version:"1.4.0",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Building own hook",permalink:"/react-native-keyboard-controller/pr-preview/pr-783/docs/1.4.0/guides/building-own-hook"},next:{title:"Recipes",permalink:"/react-native-keyboard-controller/pr-preview/pr-783/docs/1.4.0/category/recipes"}},c={},d=[{value:"<code>react-native</code>",id:"react-native",level:2},{value:"<code>react-native-reanimated</code>",id:"react-native-reanimated",level:2},{value:"Third-party libraries compatibility",id:"third-party-libraries-compatibility",level:2}];function l(e){const i={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.h1,{id:"compatibility",children:"Compatibility"}),"\n",(0,r.jsx)(i.h2,{id:"react-native",children:(0,r.jsx)(i.code,{children:"react-native"})}),"\n",(0,r.jsxs)(i.p,{children:["Starting from ",(0,r.jsx)(i.code,{children:"1.2.0"})," this library adds support for a new architecture called ",(0,r.jsx)(i.code,{children:"Fabric"}),". Since a new architecture is still in adoption stage and it changes some APIs over time - it's highly recommended to use versions which are compatible and were intensively tested against specific ",(0,r.jsx)(i.code,{children:"react-native"})," versions."]}),"\n",(0,r.jsx)(i.p,{children:"Below you can find a table with supported versions:"}),"\n",(0,r.jsxs)(i.table,{children:[(0,r.jsx)(i.thead,{children:(0,r.jsxs)(i.tr,{children:[(0,r.jsx)(i.th,{children:"library version"}),(0,r.jsx)(i.th,{children:"react-native version"})]})}),(0,r.jsxs)(i.tbody,{children:[(0,r.jsxs)(i.tr,{children:[(0,r.jsx)(i.td,{children:"1.3.0+"}),(0,r.jsx)(i.td,{children:"0.70.0+"})]}),(0,r.jsxs)(i.tr,{children:[(0,r.jsx)(i.td,{children:"1.2.0+"}),(0,r.jsx)(i.td,{children:"0.69.0+"})]})]})]}),"\n",(0,r.jsx)(i.admonition,{type:"info",children:(0,r.jsxs)(i.p,{children:["For ",(0,r.jsx)(i.code,{children:"Paper"})," (old) architecture there is no any restrictions. If you found an incompatibility - don't hesitate to open an ",(0,r.jsx)(i.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko&labels=bug&template=bug_report.md&title=",children:"issue"}),". It will help the project \ud83d\ude4f"]})}),"\n",(0,r.jsx)(i.h2,{id:"react-native-reanimated",children:(0,r.jsx)(i.code,{children:"react-native-reanimated"})}),"\n",(0,r.jsxs)(i.p,{children:["This library is heavily relies on ",(0,r.jsx)(i.code,{children:"react-native-reanimated"})," primitives to bring advanced concepts for keyboard handling."]}),"\n",(0,r.jsxs)(i.p,{children:["The minimal supported version of ",(0,r.jsx)(i.code,{children:"react-native-reanimated"})," is ",(0,r.jsx)(i.code,{children:"2.3.0"}),"."]}),"\n",(0,r.jsx)(i.h2,{id:"third-party-libraries-compatibility",children:"Third-party libraries compatibility"}),"\n",(0,r.jsxs)(i.p,{children:["Since this library uses ",(0,r.jsx)(i.code,{children:"WindowInsetsCompat"})," API on Android it may conflict with other libraries if they are using deprecated API (if they are changing ",(0,r.jsx)(i.code,{children:"window"})," flags directly)."]}),"\n",(0,r.jsxs)(i.p,{children:["For example ",(0,r.jsx)(i.code,{children:"react-native-screens"})," ",(0,r.jsx)(i.a,{href:"https://github.com/software-mansion/react-native-screens/pull/1451",children:"were"})," using old API, so if you are using ",(0,r.jsx)(i.code,{children:"StatusBar"})," management from ",(0,r.jsx)(i.code,{children:"react-native-screens"})," you'll need to use at least ",(0,r.jsx)(i.code,{children:"3.14+"})," version. Otherwise it will ",(0,r.jsx)(i.strong,{children:"break"})," keyboard animations."]}),"\n",(0,r.jsxs)(i.p,{children:[(0,r.jsx)(i.code,{children:"StatusBar"})," component from ",(0,r.jsx)(i.code,{children:"react-native"})," is also using deprecated API. In order to allow better compatibility - ",(0,r.jsx)(i.code,{children:"react-native-keyboard-controller"})," ",(0,r.jsx)(i.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30",children:"monkey-patches"})," this component (hopefully soon they will change an approach and will rewrite this component to new API)."]}),"\n",(0,r.jsxs)(i.p,{children:["If you know other 3rd party libraries that may be using deprecated API, please open an ",(0,r.jsx)(i.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko&labels=bug&template=bug_report.md&title=",children:"issue"})," and we'll try to fix it."]})]})}function h(e={}){const{wrapper:i}={...(0,n.R)(),...e.components};return i?(0,r.jsx)(i,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},28453:(e,i,t)=>{t.d(i,{R:()=>o,x:()=>a});var r=t(96540);const n={},s=r.createContext(n);function o(e){const i=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function a(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),r.createElement(s.Provider,{value:i},e.children)}}}]);