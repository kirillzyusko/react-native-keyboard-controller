"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4095],{64936:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var t=o(74848),r=o(28453);const i={sidebar_position:1,keywords:["react-native-keyboard-controller","keyboard animation","keyboard handling","keyboard movement"]},a="First animation",s={id:"guides/first-animation",title:"First animation",description:"To build your first animation you will need to use two hooks: useKeyboardAnimation or useReanimatedKeyboardAnimation.",source:"@site/versioned_docs/version-1.10.0/guides/first-animation.md",sourceDirName:"guides",slug:"/guides/first-animation",permalink:"/react-native-keyboard-controller/pr-preview/pr-728/docs/1.10.0/guides/first-animation",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.10.0/guides/first-animation.md",tags:[],version:"1.10.0",sidebarPosition:1,frontMatter:{sidebar_position:1,keywords:["react-native-keyboard-controller","keyboard animation","keyboard handling","keyboard movement"]},sidebar:"tutorialSidebar",previous:{title:"Guides",permalink:"/react-native-keyboard-controller/pr-preview/pr-728/docs/1.10.0/category/guides"},next:{title:"Building own hook",permalink:"/react-native-keyboard-controller/pr-preview/pr-728/docs/1.10.0/guides/building-own-hook"}},d={},c=[{value:"Example",id:"example",level:2}];function l(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"first-animation",children:"First animation"}),"\n",(0,t.jsxs)(n.p,{children:["To build your first animation you will need to use two hooks: ",(0,t.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-728/docs/1.10.0/api/hooks/keyboard/use-keyboard-animation",children:"useKeyboardAnimation"})," or ",(0,t.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-728/docs/1.10.0/api/hooks/keyboard/use-reanimated-keyboard-animation",children:"useReanimatedKeyboardAnimation"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["Both of them return an object with two properties: ",(0,t.jsx)(n.code,{children:"progress"})," and ",(0,t.jsx)(n.code,{children:"height"})," (depends on the hook used, values will be ",(0,t.jsx)(n.code,{children:"Animated.Value"})," or ",(0,t.jsx)(n.code,{children:"Reanimated.SharedValue"}),")."]}),"\n",(0,t.jsx)(n.admonition,{type:"info",children:(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"useKeyboardAnimation"})," returns Animated values with enabled ",(0,t.jsx)(n.strong,{children:"Native Driver"})," (",(0,t.jsx)(n.code,{children:"useNativeDriver: true"}),"). Thus some properties can not be animated, such as ",(0,t.jsx)(n.code,{children:"height"}),", ",(0,t.jsx)(n.code,{children:"backgroundColor"}),", etc."]})}),"\n",(0,t.jsx)(n.admonition,{type:"caution",children:(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"useReanimatedKeyboardAnimation"})," works only with ",(0,t.jsx)(n.code,{children:"SharedValues"}),", i.e. it is not compatible with Reanimated v1 API."]})}),"\n",(0,t.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,t.jsxs)(n.p,{children:["To see how to use these hooks let's consider example below (for more comprehensive usage you may find an ",(0,t.jsx)(n.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example",children:"example"})," app useful):"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:'import React from "react";\nimport { Animated, StyleSheet, TextInput, View } from "react-native";\nimport { useKeyboardAnimation } from "react-native-keyboard-controller";\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    alignItems: "center",\n    justifyContent: "flex-end",\n  },\n  box: {\n    width: 60,\n    height: 60,\n    marginVertical: 20,\n  },\n  row: {\n    flexDirection: "row",\n  },\n});\n\nexport default function KeyboardAnimation() {\n  // 1. we need to use hook to get an access to animated values\n  const { height, progress } = useKeyboardAnimation();\n\n  const scale = progress.interpolate({\n    inputRange: [0, 1],\n    outputRange: [1, 2],\n  });\n\n  return (\n    <View style={styles.container}>\n      <View style={styles.row}>\n        <Animated.View\n          style={{\n            width: 50,\n            height: 50,\n            backgroundColor: "#17fc03",\n            borderRadius: 15,\n            // 2. we can apply any transformations we want\n            transform: [{ translateY: height }, { scale }],\n          }}\n        />\n      </View>\n      <TextInput\n        style={{\n          width: "100%",\n          marginTop: 50,\n          height: 50,\n          backgroundColor: "yellow",\n        }}\n      />\n    </View>\n  );\n}\n'})}),"\n",(0,t.jsx)(n.admonition,{type:"info",children:(0,t.jsxs)(n.p,{children:["If you are going to use these Animated values in class components (i.e. without hooks) - you can easily ",(0,t.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-728/docs/1.10.0/api/hooks/keyboard/use-keyboard-animation",children:"do"})," it. Check out ",(0,t.jsx)(n.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/blob/cf27eb00877db34b860a04cf52a026110e44b4b3/src/animated.tsx#L46-L51",children:"source"})," code - this hook simply changes ",(0,t.jsx)(n.code,{children:"softInputMode"})," and consumes ",(0,t.jsx)(n.code,{children:"Context"}),". Also you may read ",(0,t.jsx)(n.a,{href:"/react-native-keyboard-controller/pr-preview/pr-728/docs/1.10.0/recipes/architecture",children:"architecture"})," deep dive to understand more about how this library works."]})})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},28453:(e,n,o)=>{o.d(n,{R:()=>a,x:()=>s});var t=o(96540);const r={},i=t.createContext(r);function a(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);