"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9716],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=r.createContext({}),c=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(l.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(t),m=o,y=u["".concat(l,".").concat(m)]||u[m]||d[m]||a;return t?r.createElement(y,i(i({ref:n},p),{},{components:t})):r.createElement(y,i({ref:n},p))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},6872:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=t(7462),o=(t(7294),t(3905));const a={},i="useKeyboardAnimation",s={unversionedId:"api/hooks/use-keyboard-animation",id:"version-1.0.0/api/hooks/use-keyboard-animation",title:"useKeyboardAnimation",description:"useKeyboardAnimation is a hook which gives access to two animated values:",source:"@site/versioned_docs/version-1.0.0/api/hooks/use-keyboard-animation.md",sourceDirName:"api/hooks",slug:"/api/hooks/use-keyboard-animation",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/1.0.0/api/hooks/use-keyboard-animation",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.0.0/api/hooks/use-keyboard-animation.md",tags:[],version:"1.0.0",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"API Reference",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/1.0.0/category/api-reference"},next:{title:"useReanimatedKeyboardAnimation",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/1.0.0/api/hooks/use-reanimated-keyboard-animation"}},l={},c=[{value:"Example",id:"example",level:2},{value:"Using with class component",id:"using-with-class-component",level:2}],p={toc:c};function d(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"usekeyboardanimation"},"useKeyboardAnimation"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"useKeyboardAnimation")," is a hook which gives access to two animated values:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"height")," - value which changes between ",(0,o.kt)("strong",{parentName:"li"},"0")," and ",(0,o.kt)("strong",{parentName:"li"},"keyboardHeight"),";"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"progress")," - value which changes between ",(0,o.kt)("strong",{parentName:"li"},"0")," (keyboard closed) and ",(0,o.kt)("strong",{parentName:"li"},"1")," (keyboard opened).")),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'import { useKeyboardAnimation } from "react-native-keyboard-controller";\n\nconst { height, progress } = useKeyboardAnimation();\n')),(0,o.kt)("p",null,"Also have a look on ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example"},"example")," app for more comprehensive usage."),(0,o.kt)("h2",{id:"using-with-class-component"},"Using with class component"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'import {\n  KeyboardController,\n  KeyboardContext,\n  AndroidSoftInputModes,\n} from "react-native-keyboard-controller";\n\nclass KeyboardAnimation extends React.PureComponent {\n  // 1. use context value\n  static contextType = KeyboardContext;\n\n  componentDidMount() {\n    // 2. set input mode for android to `adjustResize`\n    // (can be omitted if you already have `adjustResize` in `AndroidManifest.xml`)\n    KeyboardController.setInputMode(\n      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,\n    );\n  }\n\n  componentWillUnmount() {\n    // 2. return to default input mode (for Android)\n    // in order not to break other part of your app\n    KeyboardController.setDefaultMode();\n  }\n\n  render() {\n    // 3. consume animated values \ud83d\ude0a\n    const { animated } = this.context;\n  }\n}\n')))}d.isMDXComponent=!0}}]);