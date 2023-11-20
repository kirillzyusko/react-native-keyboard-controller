"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5930],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=u(n),m=a,f=c["".concat(s,".").concat(m)]||c[m]||p[m]||o;return n?r.createElement(f,i(i({ref:t},d),{},{components:n})):r.createElement(f,i({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>i});var r=n(7294),a=n(6010);const o="tabItem_Ymn6";function i(e){let{children:t,hidden:n,className:i}=e;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(o,i),hidden:n},t)}},4866:(e,t,n)=>{n.d(t,{Z:()=>x});var r=n(7462),a=n(7294),o=n(6010),i=n(2466),l=n(6775),s=n(1980),u=n(7392),d=n(12);function p(e){return function(e){var t;return(null==(t=a.Children.map(e,(e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})))?void 0:t.filter(Boolean))??[]}(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:a}}=e;return{value:t,label:n,attributes:r,default:a}}))}function c(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??p(n);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function m(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:n}=e;const r=(0,l.k6)(),o=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,s._X)(o),(0,a.useCallback)((e=>{if(!o)return;const t=new URLSearchParams(r.location.search);t.set(o,e),r.replace({...r.location,search:t.toString()})}),[o,r])]}function b(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,o=c(e),[i,l]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:o}))),[s,u]=f({queryString:n,groupId:r}),[p,b]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,o]=(0,d.Nk)(n);return[r,(0,a.useCallback)((e=>{n&&o.set(e)}),[n,o])]}({groupId:r}),k=(()=>{const e=s??p;return m({value:e,tabValues:o})?e:null})();(0,a.useLayoutEffect)((()=>{k&&l(k)}),[k]);return{selectedValue:i,selectValue:(0,a.useCallback)((e=>{if(!m({value:e,tabValues:o}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),b(e)}),[u,b,o]),tabValues:o}}var k=n(2389);const v="tabList__CuJ",y="tabItem_LNqP";function h(e){let{className:t,block:n,selectedValue:l,selectValue:s,tabValues:u}=e;const d=[],{blockElementScrollPositionUntilNextRender:p}=(0,i.o5)(),c=e=>{const t=e.currentTarget,n=d.indexOf(t),r=u[n].value;r!==l&&(p(t),s(r))},m=e=>{var t;let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const t=d.indexOf(e.currentTarget)+1;n=d[t]??d[0];break}case"ArrowLeft":{const t=d.indexOf(e.currentTarget)-1;n=d[t]??d[d.length-1];break}}null==(t=n)||t.focus()};return a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":n},t)},u.map((e=>{let{value:t,label:n,attributes:i}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:l===t?0:-1,"aria-selected":l===t,key:t,ref:e=>d.push(e),onKeyDown:m,onClick:c},i,{className:(0,o.Z)("tabs__item",y,null==i?void 0:i.className,{"tabs__item--active":l===t})}),n??t)})))}function g(e){let{lazy:t,children:n,selectedValue:r}=e;const o=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=o.find((e=>e.props.value===r));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return a.createElement("div",{className:"margin-top--md"},o.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==r}))))}function w(e){const t=b(e);return a.createElement("div",{className:(0,o.Z)("tabs-container",v)},a.createElement(h,(0,r.Z)({},e,t)),a.createElement(g,(0,r.Z)({},e,t)))}function x(e){const t=(0,k.Z)();return a.createElement(w,(0,r.Z)({key:String(t)},e))}},694:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>u,toc:()=>p});var r=n(7462),a=(n(7294),n(3905)),o=n(4866),i=n(5162);const l={sidebar_position:1,description:"Guide dedicated to installation process",keywords:["react-native-keyboard-controller","react-native keyboard","installation","setup","keyboard handling","keyboard animation","keyboard movement","troubleshooting"]},s="Installation",u={unversionedId:"installation",id:"installation",title:"Installation",description:"Guide dedicated to installation process",source:"@site/docs/installation.mdx",sourceDirName:".",slug:"/installation",permalink:"/react-native-keyboard-controller/pr-preview/pr-280/docs/next/installation",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/docs/installation.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,description:"Guide dedicated to installation process",keywords:["react-native-keyboard-controller","react-native keyboard","installation","setup","keyboard handling","keyboard animation","keyboard movement","troubleshooting"]},sidebar:"tutorialSidebar",next:{title:"Guides",permalink:"/react-native-keyboard-controller/pr-preview/pr-280/docs/next/category/guides"}},d={},p=[{value:"Adding a library to the project",id:"adding-a-library-to-the-project",level:2},{value:"Linking",id:"linking",level:3},{value:"Expo",id:"expo",level:3},{value:"Adding provider",id:"adding-provider",level:2},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"Incompatible <code>kotlinVersion</code> and failed Android builds",id:"incompatible-kotlinversion-and-failed-android-builds",level:3},{value:"react-native or expo bare workflow",id:"react-native-or-expo-bare-workflow",level:4},{value:"Expo managed workflow",id:"expo-managed-workflow",level:4},{value:"Swift support",id:"swift-support",level:3}],c={toc:p};function m(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"installation"},"Installation"),(0,a.kt)("h2",{id:"adding-a-library-to-the-project"},"Adding a library to the project"),(0,a.kt)("p",null,"Install the ",(0,a.kt)("inlineCode",{parentName:"p"},"react-native-keyboard-controller")," package in your React Native project."),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(i.Z,{value:"yarn",label:"YARN",default:!0,mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"yarn add react-native-keyboard-controller\n"))),(0,a.kt)(i.Z,{value:"npm",label:"NPM",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"npm install react-native-keyboard-controller --save\n")))),(0,a.kt)("h3",{id:"linking"},"Linking"),(0,a.kt)("p",null,"This package supports ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/react-native-community/cli/blob/master/docs/autolinking.md"},"autolinking"),"."),(0,a.kt)("admonition",{title:"Pods update",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Don't forget to re-install ",(0,a.kt)("inlineCode",{parentName:"p"},"pods")," after adding the package and don't forget to re-assemble ",(0,a.kt)("inlineCode",{parentName:"p"},"android")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"ios")," applications, since this library contains native code.")),(0,a.kt)("h3",{id:"expo"},"Expo"),(0,a.kt)("p",null,"This library has native code, so it does not work with ",(0,a.kt)("em",{parentName:"p"},"Expo Go")," but you can easily install it using a ",(0,a.kt)("a",{parentName:"p",href:"https://docs.expo.dev/development/getting-started/"},"custom dev client"),"."),(0,a.kt)("h2",{id:"adding-provider"},"Adding provider"),(0,a.kt)("p",null,"In order to use it you'll need to wrap your app with ",(0,a.kt)("inlineCode",{parentName:"p"},"KeyboardProvider")," component."),(0,a.kt)("admonition",{title:"Why it's needed?",type:"info"},(0,a.kt)("p",{parentName:"admonition"},"If you are bothered why it's needed, you can read more about it in ",(0,a.kt)("a",{parentName:"p",href:"/react-native-keyboard-controller/pr-preview/pr-280/docs/next/recipes/platform-differences"},"architecture")," deep dive to understand all aspects of how this library works.")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { KeyboardProvider } from 'react-native-keyboard-controller';\n\nexport default function App() {\n  return (\n    <KeyboardProvider>\n      // your code here\n    </KeyboardProvider>\n  );\n}\n")),(0,a.kt)("p",null,"Congratulations! \ud83c\udf89 You've just finished installation process. Go to the ",(0,a.kt)("a",{parentName:"p",href:"/react-native-keyboard-controller/pr-preview/pr-280/docs/next/guides/first-animation"},"next section")," to get more insights of what you can do using this library. \ud83d\ude0e"),(0,a.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,a.kt)("h3",{id:"incompatible-kotlinversion-and-failed-android-builds"},"Incompatible ",(0,a.kt)("inlineCode",{parentName:"h3"},"kotlinVersion")," and failed Android builds"),(0,a.kt)("p",null,"Sometimes you may see failed Android builds complaining that your version of kotlin is lower than expected version."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"error: module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.6.0, expected version is 1.4.1.")),(0,a.kt)("p",null,"To overcome this issue you will need to set higher version of the kotlin:"),(0,a.kt)("h4",{id:"react-native-or-expo-bare-workflow"},"react-native or expo bare workflow"),(0,a.kt)("p",null,"You need to modify ",(0,a.kt)("inlineCode",{parentName:"p"},"android/build.gradle")," and specify correct ",(0,a.kt)("inlineCode",{parentName:"p"},"kotlinVersion"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'buildscript {\n    ext {\n        kotlinVersion = "1.6.21"\n    }\n}\n')),(0,a.kt)("p",null,"For more information please, see how it's configured in ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/kirillzyusko/react-native-keyboard-controller/blob/9d0e63712a2f55dab0f6f3f95398567bb9ca1efa/example/android/build.gradle#L9"},"example")," project."),(0,a.kt)("h4",{id:"expo-managed-workflow"},"Expo managed workflow"),(0,a.kt)("p",null,"If you are using Expo managed workflow you need to install ",(0,a.kt)("inlineCode",{parentName:"p"},"expo-build-properties")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"npx expo install expo-build-properties\n")),(0,a.kt)("p",null,"And add plugin inside of your ",(0,a.kt)("inlineCode",{parentName:"p"},"app.json")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"app.config.js")," with following configuration:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "expo": {\n    "plugins": [\n      [\n        "expo-build-properties",\n        {\n          "android": {\n            "kotlinVersion": "1.6.21"\n          }\n        }\n      ]\n    ]\n  }\n}\n')),(0,a.kt)("h3",{id:"swift-support"},"Swift support"),(0,a.kt)("p",null,"Since part of this library is written using ",(0,a.kt)("inlineCode",{parentName:"p"},"swift")," language - your project needs to support it. For that you can create empty ",(0,a.kt)("inlineCode",{parentName:"p"},".swift")," file with bridging header. See this ",(0,a.kt)("a",{parentName:"p",href:"https://stackoverflow.com/a/56176956/9272042"},"step-by-step")," guide if you have problems."))}m.isMDXComponent=!0}}]);