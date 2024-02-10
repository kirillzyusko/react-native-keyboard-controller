"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6511],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(n),m=i,h=u["".concat(s,".").concat(m)]||u[m]||d[m]||a;return n?r.createElement(h,o(o({ref:t},p),{},{components:n})):r.createElement(h,o({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},6867:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var r=n(7462),i=(n(7294),n(3905));const a={sidebar_position:1,keywords:["react-native-keyboard-controller","architecture","design principles"]},o="Architecture",l={unversionedId:"recipes/architecture",id:"version-1.10.0/recipes/architecture",title:"Architecture",description:"This library requires to wrap an app with KeyboardProvider component. It's needed because it stores animated values in context.",source:"@site/versioned_docs/version-1.10.0/recipes/architecture.md",sourceDirName:"recipes",slug:"/recipes/architecture",permalink:"/react-native-keyboard-controller/pr-preview/pr-346/docs/recipes/architecture",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.10.0/recipes/architecture.md",tags:[],version:"1.10.0",sidebarPosition:1,frontMatter:{sidebar_position:1,keywords:["react-native-keyboard-controller","architecture","design principles"]},sidebar:"tutorialSidebar",previous:{title:"Recipes",permalink:"/react-native-keyboard-controller/pr-preview/pr-346/docs/category/recipes"},next:{title:"Platforms capabilities and limitations",permalink:"/react-native-keyboard-controller/pr-preview/pr-346/docs/recipes/platform-differences"}},s={},c=[{value:"Process overview",id:"process-overview",level:2},{value:"Design principles",id:"design-principles",level:2},{value:"Why custom <code>KeyboardControllerView</code> is needed?",id:"why-custom-keyboardcontrollerview-is-needed",level:2}],p={toc:c};function d(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"architecture"},"Architecture"),(0,i.kt)("p",null,"This library requires to wrap an app with ",(0,i.kt)("inlineCode",{parentName:"p"},"KeyboardProvider")," component. It's needed because it stores animated values in ",(0,i.kt)("inlineCode",{parentName:"p"},"context"),"."),(0,i.kt)("h2",{id:"process-overview"},"Process overview"),(0,i.kt)("p",null,"Library exposes ",(0,i.kt)("inlineCode",{parentName:"p"},"KeyboardControllerView")," with ",(0,i.kt)("inlineCode",{parentName:"p"},"onKeyboardMove")," method. This method is fired when keyboard frame is changed. ",(0,i.kt)("inlineCode",{parentName:"p"},"KeyboardProvider")," automatically maps these events to ",(0,i.kt)("inlineCode",{parentName:"p"},"Animated.Value")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"Reanimated.SharedValue")," and stores it in ",(0,i.kt)("inlineCode",{parentName:"p"},"context"),"."),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"Underhood ",(0,i.kt)("inlineCode",{parentName:"p"},"KeyboardControllerView")," is a simple ",(0,i.kt)("inlineCode",{parentName:"p"},"View")," with one additional ",(0,i.kt)("inlineCode",{parentName:"p"},"onKeyboardMove")," callback method, so it inherits all props from plain ",(0,i.kt)("inlineCode",{parentName:"p"},"View"),", such as ",(0,i.kt)("inlineCode",{parentName:"p"},"style"),", etc.")),(0,i.kt)("p",null,"Thus we have a single source of truth about keyboard position. Since values are stored in ",(0,i.kt)("inlineCode",{parentName:"p"},"context")," we can use it in any component where we need them. Moreover, we can consume ",(0,i.kt)("inlineCode",{parentName:"p"},"context")," values in class components as well as in hooks."),(0,i.kt)("h2",{id:"design-principles"},"Design principles"),(0,i.kt)("p",null,"The library was designed to use a ",(0,i.kt)("inlineCode",{parentName:"p"},"context")," as a global store for animated values and have a single ",(0,i.kt)("inlineCode",{parentName:"p"},"Provider")," across the app. As of now it may be not very obvious, why it was needed to have a single source of data flow, but in future it may significantly simplify the process of the integration new features."),(0,i.kt)("h2",{id:"why-custom-keyboardcontrollerview-is-needed"},"Why custom ",(0,i.kt)("inlineCode",{parentName:"h2"},"KeyboardControllerView")," is needed?"),(0,i.kt)("p",null,"Initially I had a choice which approach to use in order to send events about keyboard frames: ",(0,i.kt)("inlineCode",{parentName:"p"},"EventEmitters")," vs ",(0,i.kt)("inlineCode",{parentName:"p"},"View")," with callbacks. I decided to use ",(0,i.kt)("inlineCode",{parentName:"p"},"View")," with callbacks because of several reasons:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"react-native")," core team uses similar approach for ",(0,i.kt)("inlineCode",{parentName:"li"},"onScroll")," event from ",(0,i.kt)("inlineCode",{parentName:"li"},"ScrollView")," component (also I knew, that it's possible to map events from such callbacks to ",(0,i.kt)("inlineCode",{parentName:"li"},"Animated.Value")," and thus reduce bridge usage);"),(0,i.kt)("li",{parentName:"ul"},"to track keyboard frames on Android we need to enter to ",(0,i.kt)("a",{parentName:"li",href:"https://developer.android.com/training/gestures/edge-to-edge"},"edge-to-edge")," mode and it changes view paddings. Since it's managed through ",(0,i.kt)("inlineCode",{parentName:"li"},"View")," it's easier to change padding of this view."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"reanimated")," allows to intercept ",(0,i.kt)("inlineCode",{parentName:"li"},"view")," events using theirs ",(0,i.kt)("inlineCode",{parentName:"li"},"useEvent")," hook and move the event handling into worklet runtime. Thus sending events via ",(0,i.kt)("inlineCode",{parentName:"li"},"view")," allows to make an integration with ",(0,i.kt)("inlineCode",{parentName:"li"},"reanimated")," package and handle events/animate everything directly on the UI thread.")))}d.isMDXComponent=!0}}]);