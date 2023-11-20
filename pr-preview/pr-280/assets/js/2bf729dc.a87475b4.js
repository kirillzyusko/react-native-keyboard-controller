"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3247],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=o.createContext({}),u=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=u(e.components);return o.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=u(n),f=r,m=d["".concat(l,".").concat(f)]||d[f]||c[f]||i;return n?o.createElement(m,a(a({ref:t},p),{},{components:n})):o.createElement(m,a({ref:t},p))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,a[1]=s;for(var u=2;u<i;u++)a[u]=n[u];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7133:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>c,frontMatter:()=>i,metadata:()=>s,toc:()=>u});var o=n(7462),r=(n(7294),n(3905));const i={sidebar_position:2},a="Building own hook",s={unversionedId:"guides/building-own-hook",id:"version-1.4.0/guides/building-own-hook",title:"Building own hook",description:"Default hooks may not perfectly fit in your app, because it changes/restores softInputMode on mount/unmount of the component where it's used. Though in deep stacks sometimes it may be important to have different softInputMode per screen, but by default react-navigation keeps previous screens mounted, so if you are using default useKeyboardAnimation hook, then all following screens will have softInputMode=adjustResize.",source:"@site/versioned_docs/version-1.4.0/guides/building-own-hook.md",sourceDirName:"guides",slug:"/guides/building-own-hook",permalink:"/react-native-keyboard-controller/pr-preview/pr-280/docs/1.4.0/guides/building-own-hook",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.4.0/guides/building-own-hook.md",tags:[],version:"1.4.0",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"First animation",permalink:"/react-native-keyboard-controller/pr-preview/pr-280/docs/1.4.0/guides/first-animation"},next:{title:"Compatibility",permalink:"/react-native-keyboard-controller/pr-preview/pr-280/docs/1.4.0/guides/compatibility"}},l={},u=[],p={toc:u};function c(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"building-own-hook"},"Building own hook"),(0,r.kt)("p",null,"Default hooks may not perfectly fit in your app, because it changes/restores ",(0,r.kt)("inlineCode",{parentName:"p"},"softInputMode")," on mount/unmount of the component where it's used. Though in deep stacks sometimes it may be important to have different ",(0,r.kt)("inlineCode",{parentName:"p"},"softInputMode")," per screen, but by default ",(0,r.kt)("inlineCode",{parentName:"p"},"react-navigation")," keeps previous screens mounted, so if you are using default ",(0,r.kt)("inlineCode",{parentName:"p"},"useKeyboardAnimation")," hook, then all following screens will have ",(0,r.kt)("inlineCode",{parentName:"p"},"softInputMode=adjustResize"),"."),(0,r.kt)("p",null,"To prevent such behavior you can write own hook based on primitives from this library. The implementation may look like:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'import { useContext, useCallback } from "react";\nimport { useFocusEffect } from "@react-navigation/native";\nimport {\n  KeyboardContext,\n  KeyboardController,\n  AndroidSoftInputModes\n} from "react-native-keyboard-controller";\n\nfunction useKeyboardAnimation() {\n  useFocusEffect(\n    useCallback(() => {\n      KeyboardController.setInputMode(\n        AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE\n      );\n\n      return () => KeyboardController.setDefaultMode();\n    }, [])\n  );\n\n  const context = useContext(KeyboardContext);\n\n  return context.animated;\n}\n')),(0,r.kt)("p",null,"In this case when screen becomes invisible hook will restore default ",(0,r.kt)("inlineCode",{parentName:"p"},"softInputMode"),", and ",(0,r.kt)("inlineCode",{parentName:"p"},"softInputMode")," will be set to ",(0,r.kt)("inlineCode",{parentName:"p"},"adjustResize")," only on the screen where it's used."))}c.isMDXComponent=!0}}]);