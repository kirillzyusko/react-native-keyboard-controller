"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5055],{84014:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>s,default:()=>l,frontMatter:()=>a,metadata:()=>i,toc:()=>c});var o=t(74848),r=t(28453);const a={keywords:["react-native-keyboard-controller","useReanimatedFocusedInput","react-native-reanimated","react hook","focused input","layout"]},s="useReanimatedFocusedInput",i={id:"api/hooks/input/use-reanimated-focused-input",title:"useReanimatedFocusedInput",description:"Hook that returns an information about TextInput that currently has a focus. Returns null if no input has focus.",source:"@site/versioned_docs/version-1.13.0/api/hooks/input/use-reanimated-focused-input.md",sourceDirName:"api/hooks/input",slug:"/api/hooks/input/use-reanimated-focused-input",permalink:"/react-native-keyboard-controller/pr-preview/pr-890/docs/1.13.0/api/hooks/input/use-reanimated-focused-input",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.13.0/api/hooks/input/use-reanimated-focused-input.md",tags:[],version:"1.13.0",frontMatter:{keywords:["react-native-keyboard-controller","useReanimatedFocusedInput","react-native-reanimated","react hook","focused input","layout"]},sidebar:"tutorialSidebar",previous:{title:"useFocusedInputHandler",permalink:"/react-native-keyboard-controller/pr-preview/pr-890/docs/1.13.0/api/hooks/input/use-focused-input-handler"},next:{title:"useKeyboardController",permalink:"/react-native-keyboard-controller/pr-preview/pr-890/docs/1.13.0/api/hooks/module/use-keyboard-controller"}},u={},c=[{value:"Event structure",id:"event-structure",level:2},{value:"Example",id:"example",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"usereanimatedfocusedinput",children:"useReanimatedFocusedInput"}),"\n",(0,o.jsxs)(n.p,{children:["Hook that returns an information about ",(0,o.jsx)(n.code,{children:"TextInput"})," that currently has a focus. Returns ",(0,o.jsx)(n.code,{children:"null"})," if no input has focus."]}),"\n",(0,o.jsx)(n.p,{children:"Hook will update its value in next cases:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"when keyboard changes its size (appears, disappears, changes size because of different input mode);"}),"\n",(0,o.jsxs)(n.li,{children:["when focus was changed from one ",(0,o.jsx)(n.code,{children:"TextInput"})," to another;"]}),"\n",(0,o.jsxs)(n.li,{children:["when ",(0,o.jsx)(n.code,{children:"layout"})," of focused input was changed;"]}),"\n",(0,o.jsx)(n.li,{children:"when user types a text;"}),"\n",(0,o.jsx)(n.li,{children:"when text selection was changed."}),"\n"]}),"\n",(0,o.jsx)(n.admonition,{title:"Events order",type:"info",children:(0,o.jsxs)(n.p,{children:["The value from ",(0,o.jsx)(n.code,{children:"useReanimatedFocusedInput"})," will be always updated before keyboard events, so you can safely read values in ",(0,o.jsx)(n.code,{children:"onStart"})," handler and be sure they are up-to-date."]})}),"\n",(0,o.jsx)(n.h2,{id:"event-structure",children:"Event structure"}),"\n",(0,o.jsxs)(n.p,{children:["The ",(0,o.jsx)(n.code,{children:"input"})," property from this hook is returned as ",(0,o.jsx)(n.code,{children:"SharedValue"}),". The returned data has next structure:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-ts",children:"type FocusedInputLayoutChangedEvent = {\n  target: number; // tag of the focused TextInput\n  parentScrollViewTarget: number; // tag of the parent ScrollView\n\n  // layout of the focused TextInput\n  layout: {\n    x: number; // `x` coordinate inside the parent component\n    y: number; // `y` coordinate inside the parent component\n    width: number; // `width` of the TextInput\n    height: number; // `height` of the TextInput\n    absoluteX: number; // `x` coordinate on the screen\n    absoluteY: number; // `y` coordinate on the screen\n  };\n};\n"})}),"\n",(0,o.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-tsx",children:"const { input } = useReanimatedFocusedInput();\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Also have a look on ",(0,o.jsx)(n.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example",children:"example"})," app for more comprehensive usage."]})]})}function l(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>i});var o=t(96540);const r={},a=o.createContext(r);function s(e){const n=o.useContext(a);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(a.Provider,{value:n},e.children)}}}]);