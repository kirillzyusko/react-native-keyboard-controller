"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4491],{21586:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>l,metadata:()=>d,toc:()=>u});var t=r(74848),o=r(28453),i=r(11470),a=r(19365);const l={sidebar_position:1,description:"Guide dedicated to installation process",keywords:["react-native-keyboard-controller","react-native keyboard","installation","setup","keyboard handling","keyboard animation","keyboard movement","troubleshooting"]},s="Installation",d={id:"installation",title:"Installation",description:"Guide dedicated to installation process",source:"@site/versioned_docs/version-1.11.0/installation.mdx",sourceDirName:".",slug:"/installation",permalink:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.11.0/installation",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.11.0/installation.mdx",tags:[],version:"1.11.0",sidebarPosition:1,frontMatter:{sidebar_position:1,description:"Guide dedicated to installation process",keywords:["react-native-keyboard-controller","react-native keyboard","installation","setup","keyboard handling","keyboard animation","keyboard movement","troubleshooting"]},sidebar:"tutorialSidebar",next:{title:"Guides",permalink:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.11.0/category/guides"}},c={},u=[{value:"Adding a library to the project",id:"adding-a-library-to-the-project",level:2},{value:"Linking",id:"linking",level:3},{value:"Expo",id:"expo",level:3},{value:"Adding provider",id:"adding-provider",level:2},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"Incompatible <code>kotlinVersion</code> and failed Android builds",id:"incompatible-kotlinversion-and-failed-android-builds",level:3},{value:"react-native or expo bare workflow",id:"react-native-or-expo-bare-workflow",level:4},{value:"Expo managed workflow",id:"expo-managed-workflow",level:4},{value:"Swift support",id:"swift-support",level:3}];function p(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"installation",children:"Installation"}),"\n",(0,t.jsx)(n.h2,{id:"adding-a-library-to-the-project",children:"Adding a library to the project"}),"\n",(0,t.jsxs)(n.p,{children:["Install the ",(0,t.jsx)(n.code,{children:"react-native-keyboard-controller"})," package in your React Native project."]}),"\n",(0,t.jsxs)(i.A,{children:[(0,t.jsx)(a.A,{value:"yarn",label:"YARN",default:!0,children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-shell",children:"yarn add react-native-keyboard-controller\n"})})}),(0,t.jsx)(a.A,{value:"npm",label:"NPM",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-shell",children:"npm install react-native-keyboard-controller --save\n"})})})]}),"\n",(0,t.jsxs)(n.admonition,{type:"warning",children:[(0,t.jsxs)(n.mdxAdmonitionTitle,{children:["Mandatory ",(0,t.jsx)(n.code,{children:"react-native-reanimated"})," dependency"]}),(0,t.jsxs)(n.p,{children:["This library requires ",(0,t.jsx)(n.code,{children:"react-native-reanimated"})," to work properly. If you don't have it in your project, you need to follow ",(0,t.jsx)(n.a,{href:"https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation",children:"installation guide"})," and install it in your project before using this library."]})]}),"\n",(0,t.jsx)(n.h3,{id:"linking",children:"Linking"}),"\n",(0,t.jsxs)(n.p,{children:["This package supports ",(0,t.jsx)(n.a,{href:"https://github.com/react-native-community/cli/blob/master/docs/autolinking.md",children:"autolinking"}),"."]}),"\n",(0,t.jsx)(n.admonition,{title:"Pods update",type:"tip",children:(0,t.jsxs)(n.p,{children:["Don't forget to re-install ",(0,t.jsx)(n.code,{children:"pods"})," after adding the package and don't forget to re-assemble ",(0,t.jsx)(n.code,{children:"android"})," and ",(0,t.jsx)(n.code,{children:"ios"})," applications, since this library contains native code."]})}),"\n",(0,t.jsx)(n.h3,{id:"expo",children:"Expo"}),"\n",(0,t.jsxs)(n.p,{children:["This library has native code, so it does not work with ",(0,t.jsx)(n.em,{children:"Expo Go"})," but you can easily install it using a ",(0,t.jsx)(n.a,{href:"https://docs.expo.dev/development/getting-started/",children:"custom dev client"}),"."]}),"\n",(0,t.jsx)(n.h2,{id:"adding-provider",children:"Adding provider"}),"\n",(0,t.jsxs)(n.p,{children:["In order to use it you'll need to wrap your app with ",(0,t.jsx)(n.code,{children:"KeyboardProvider"})," component."]}),"\n",(0,t.jsx)(n.admonition,{title:"Why it's needed?",type:"info",children:(0,t.jsxs)(n.p,{children:["If you are bothered why it's needed, you can read more about it in ",(0,t.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.11.0/recipes/platform-differences",children:"architecture"})," deep dive to understand all aspects of how this library works."]})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:'import { KeyboardProvider } from "react-native-keyboard-controller";\n\nexport default function App() {\n  return (\n    <KeyboardProvider>\n      {/* your main application code goes here */}\n    </KeyboardProvider>\n  );\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Congratulations! \ud83c\udf89 You've just finished installation process. Go to the ",(0,t.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-727/docs/1.11.0/guides/first-animation",children:"next section"})," to get more insights of what you can do using this library. \ud83d\ude0e"]}),"\n",(0,t.jsx)(n.h2,{id:"troubleshooting",children:"Troubleshooting"}),"\n",(0,t.jsxs)(n.h3,{id:"incompatible-kotlinversion-and-failed-android-builds",children:["Incompatible ",(0,t.jsx)(n.code,{children:"kotlinVersion"})," and failed Android builds"]}),"\n",(0,t.jsx)(n.p,{children:"Sometimes you may see failed Android builds complaining that your version of kotlin is lower than expected version."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.code,{children:"error: module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.6.0, expected version is 1.4.1."})}),"\n",(0,t.jsx)(n.p,{children:"To overcome this issue you will need to set higher version of the kotlin:"}),"\n",(0,t.jsx)(n.h4,{id:"react-native-or-expo-bare-workflow",children:"react-native or expo bare workflow"}),"\n",(0,t.jsxs)(n.p,{children:["You need to modify ",(0,t.jsx)(n.code,{children:"android/build.gradle"})," and specify correct ",(0,t.jsx)(n.code,{children:"kotlinVersion"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-java",children:'buildscript {\n    ext {\n        kotlinVersion = "1.6.21"\n    }\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["For more information please, see how it's configured in ",(0,t.jsx)(n.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/blob/9d0e63712a2f55dab0f6f3f95398567bb9ca1efa/example/android/build.gradle#L9",children:"example"})," project."]}),"\n",(0,t.jsx)(n.h4,{id:"expo-managed-workflow",children:"Expo managed workflow"}),"\n",(0,t.jsxs)(n.p,{children:["If you are using Expo managed workflow you need to install ",(0,t.jsx)(n.code,{children:"expo-build-properties"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sh",children:"npx expo install expo-build-properties\n"})}),"\n",(0,t.jsxs)(n.p,{children:["And add plugin inside of your ",(0,t.jsx)(n.code,{children:"app.json"})," or ",(0,t.jsx)(n.code,{children:"app.config.js"})," with following configuration:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  "expo": {\n    "plugins": [\n      [\n        "expo-build-properties",\n        {\n          "android": {\n            "kotlinVersion": "1.6.21"\n          }\n        }\n      ]\n    ]\n  }\n}\n'})}),"\n",(0,t.jsx)(n.h3,{id:"swift-support",children:"Swift support"}),"\n",(0,t.jsxs)(n.p,{children:["Since part of this library is written using ",(0,t.jsx)(n.code,{children:"swift"})," language - your project needs to support it. For that you can create empty ",(0,t.jsx)(n.code,{children:".swift"})," file with bridging header. See this ",(0,t.jsx)(n.a,{href:"https://stackoverflow.com/a/56176956/9272042",children:"step-by-step"})," guide if you have problems."]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}},19365:(e,n,r)=>{r.d(n,{A:()=>a});r(96540);var t=r(34164);const o={tabItem:"tabItem_Ymn6"};var i=r(74848);function a(e){let{children:n,hidden:r,className:a}=e;return(0,i.jsx)("div",{role:"tabpanel",className:(0,t.A)(o.tabItem,a),hidden:r,children:n})}},11470:(e,n,r)=>{r.d(n,{A:()=>k});var t=r(96540),o=r(34164),i=r(23104),a=r(56347),l=r(205),s=r(57485),d=r(31682),c=r(70679);function u(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:n,children:r}=e;return(0,t.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:r,attributes:t,default:o}}=e;return{value:n,label:r,attributes:t,default:o}}))}(r);return function(e){const n=(0,d.X)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,r])}function h(e){let{value:n,tabValues:r}=e;return r.some((e=>e.value===n))}function b(e){let{queryString:n=!1,groupId:r}=e;const o=(0,a.W6)(),i=function(e){let{queryString:n=!1,groupId:r}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:n,groupId:r});return[(0,s.aZ)(i),(0,t.useCallback)((e=>{if(!i)return;const n=new URLSearchParams(o.location.search);n.set(i,e),o.replace({...o.location,search:n.toString()})}),[i,o])]}function f(e){const{defaultValue:n,queryString:r=!1,groupId:o}=e,i=p(e),[a,s]=(0,t.useState)((()=>function(e){let{defaultValue:n,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=r.find((e=>e.default))??r[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:i}))),[d,u]=b({queryString:r,groupId:o}),[f,m]=function(e){let{groupId:n}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(n),[o,i]=(0,c.Dv)(r);return[o,(0,t.useCallback)((e=>{r&&i.set(e)}),[r,i])]}({groupId:o}),v=(()=>{const e=d??f;return h({value:e,tabValues:i})?e:null})();(0,l.A)((()=>{v&&s(v)}),[v]);return{selectedValue:a,selectValue:(0,t.useCallback)((e=>{if(!h({value:e,tabValues:i}))throw new Error(`Can't select invalid tab value=${e}`);s(e),u(e),m(e)}),[u,m,i]),tabValues:i}}var m=r(92303);const v={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=r(74848);function g(e){let{className:n,block:r,selectedValue:t,selectValue:a,tabValues:l}=e;const s=[],{blockElementScrollPositionUntilNextRender:d}=(0,i.a_)(),c=e=>{const n=e.currentTarget,r=s.indexOf(n),o=l[r].value;o!==t&&(d(n),a(o))},u=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const r=s.indexOf(e.currentTarget)+1;n=s[r]??s[0];break}case"ArrowLeft":{const r=s.indexOf(e.currentTarget)-1;n=s[r]??s[s.length-1];break}}n?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.A)("tabs",{"tabs--block":r},n),children:l.map((e=>{let{value:n,label:r,attributes:i}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:t===n?0:-1,"aria-selected":t===n,ref:e=>s.push(e),onKeyDown:u,onClick:c,...i,className:(0,o.A)("tabs__item",v.tabItem,i?.className,{"tabs__item--active":t===n}),children:r??n},n)}))})}function y(e){let{lazy:n,children:r,selectedValue:o}=e;const i=(Array.isArray(r)?r:[r]).filter(Boolean);if(n){const e=i.find((e=>e.props.value===o));return e?(0,t.cloneElement)(e,{className:"margin-top--md"}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:i.map(((e,n)=>(0,t.cloneElement)(e,{key:n,hidden:e.props.value!==o})))})}function j(e){const n=f(e);return(0,x.jsxs)("div",{className:(0,o.A)("tabs-container",v.tabList),children:[(0,x.jsx)(g,{...n,...e}),(0,x.jsx)(y,{...n,...e})]})}function k(e){const n=(0,m.A)();return(0,x.jsx)(j,{...e,children:u(e.children)},String(n))}},28453:(e,n,r)=>{r.d(n,{R:()=>a,x:()=>l});var t=r(96540);const o={},i=t.createContext(o);function a(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);