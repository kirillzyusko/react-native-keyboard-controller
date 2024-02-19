"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6796],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>m});var a=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,i=function(e,t){if(null==e)return{};var r,a,i={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=a.createContext({}),c=function(e){var t=a.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},s=function(e){var t=c(e.components);return a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var r=e.components,i=e.mdxType,n=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),u=c(r),m=i,b=u["".concat(p,".").concat(m)]||u[m]||d[m]||n;return r?a.createElement(b,o(o({ref:t},s),{},{components:r})):a.createElement(b,o({ref:t},s))}));function m(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var n=r.length,o=new Array(n);o[0]=u;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var c=2;c<n;c++)o[c]=r[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},6662:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>d,frontMatter:()=>n,metadata:()=>l,toc:()=>c});var a=r(7462),i=(r(7294),r(3905));const n={sidebar_position:4,description:"Compatibility of library with different react-native versions and architectures",keywords:["react-native-keyboard-controller","compatibility","react-native versions"]},o="Compatibility",l={unversionedId:"guides/compatibility",id:"guides/compatibility",title:"Compatibility",description:"Compatibility of library with different react-native versions and architectures",source:"@site/docs/guides/compatibility.md",sourceDirName:"guides",slug:"/guides/compatibility",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/next/guides/compatibility",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/docs/guides/compatibility.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4,description:"Compatibility of library with different react-native versions and architectures",keywords:["react-native-keyboard-controller","compatibility","react-native versions"]},sidebar:"tutorialSidebar",previous:{title:"Interactive Keyboard",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/next/guides/interactive-keyboard"},next:{title:"Recipes",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/next/category/recipes"}},p={},c=[{value:"React Native",id:"react-native",level:2},{value:"Fabric (new) architecture",id:"fabric-new-architecture",level:3},{value:"Paper (old) architecture",id:"paper-old-architecture",level:3},{value:"Third-party libraries compatibility",id:"third-party-libraries-compatibility",level:2}],s={toc:c};function d(e){let{components:t,...r}=e;return(0,i.kt)("wrapper",(0,a.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"compatibility"},"Compatibility"),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"If you found an incompatibility or conflict with other open source libraries - don't hesitate to open an ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko&labels=bug&template=bug_report.md&title="},"issue"),". It will help the project \ud83d\ude4f")),(0,i.kt)("h2",{id:"react-native"},"React Native"),(0,i.kt)("p",null,"Below you can find an information about compatibility with ",(0,i.kt)("inlineCode",{parentName:"p"},"react-native")," package per different architectures."),(0,i.kt)("h3",{id:"fabric-new-architecture"},"Fabric (new) architecture"),(0,i.kt)("p",null,"Starting from ",(0,i.kt)("inlineCode",{parentName:"p"},"1.2.0")," this library adds support for a new architecture called ",(0,i.kt)("inlineCode",{parentName:"p"},"Fabric"),". Since a new architecture is still in adoption stage and it changes some APIs over time - it's highly recommended to use versions which are compatible and were intensively tested against specific ",(0,i.kt)("inlineCode",{parentName:"p"},"react-native")," versions."),(0,i.kt)("p",null,"Below you can find a table with supported versions:"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"library version"),(0,i.kt)("th",{parentName:"tr",align:null},"react-native version"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"1.3.0+"),(0,i.kt)("td",{parentName:"tr",align:null},"0.70.0+")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"1.2.0+"),(0,i.kt)("td",{parentName:"tr",align:null},"0.69.0+")))),(0,i.kt)("h3",{id:"paper-old-architecture"},"Paper (old) architecture"),(0,i.kt)("p",null,"This library supports as minimal ",(0,i.kt)("inlineCode",{parentName:"p"},"react-native")," version as possible. However it was decided to drop a support for some really old versions for better development workflow and future support."),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"library version"),(0,i.kt)("th",{parentName:"tr",align:null},"react-native version"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"1.7.0+"),(0,i.kt)("td",{parentName:"tr",align:null},"0.65.0+")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"1.0.0+"),(0,i.kt)("td",{parentName:"tr",align:null},"0.62.0+")))),(0,i.kt)("h2",{id:"third-party-libraries-compatibility"},"Third-party libraries compatibility"),(0,i.kt)("p",null,"Since this library uses ",(0,i.kt)("inlineCode",{parentName:"p"},"WindowInsetsCompat")," API on Android it may conflict with other libraries if they are using deprecated API (if they are changing ",(0,i.kt)("inlineCode",{parentName:"p"},"window")," flags directly)."),(0,i.kt)("p",null,"For example ",(0,i.kt)("inlineCode",{parentName:"p"},"react-native-screens")," ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/software-mansion/react-native-screens/pull/1451"},"were")," using old API, so if you are using ",(0,i.kt)("inlineCode",{parentName:"p"},"StatusBar")," management from ",(0,i.kt)("inlineCode",{parentName:"p"},"react-native-screens")," you'll need to use at least ",(0,i.kt)("inlineCode",{parentName:"p"},"3.14+")," version. Otherwise it will ",(0,i.kt)("strong",{parentName:"p"},"break")," keyboard animations."),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"StatusBar")," component from ",(0,i.kt)("inlineCode",{parentName:"p"},"react-native")," is also using deprecated API. In order to allow better compatibility - ",(0,i.kt)("inlineCode",{parentName:"p"},"react-native-keyboard-controller")," ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30"},"monkey-patches")," this component (hopefully soon they will change an approach and will rewrite this component to new API)."),(0,i.kt)("p",null,"If you know other 3rd party libraries that may be using deprecated API, please open an ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?assignees=kirillzyusko&labels=bug&template=bug_report.md&title="},"issue")," and we'll try to fix it."))}d.isMDXComponent=!0}}]);