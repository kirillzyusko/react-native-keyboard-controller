"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3115],{82086:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>a,toc:()=>d});var s=n(74848),r=n(28453);const i={sidebar_position:3},o="Jest testing guide",a={id:"recipes/jest-testing-guide",title:"Jest testing guide",description:"Setting up a mock",source:"@site/versioned_docs/version-1.4.0/recipes/jest-testing-guide.md",sourceDirName:"recipes",slug:"/recipes/jest-testing-guide",permalink:"/react-native-keyboard-controller/pr-preview/pr-746/docs/1.4.0/recipes/jest-testing-guide",draft:!1,unlisted:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.4.0/recipes/jest-testing-guide.md",tags:[],version:"1.4.0",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Platforms capabilities and limitations",permalink:"/react-native-keyboard-controller/pr-preview/pr-746/docs/1.4.0/recipes/platform-differences"},next:{title:"API Reference",permalink:"/react-native-keyboard-controller/pr-preview/pr-746/docs/1.4.0/category/api-reference"}},c={},d=[{value:"Setting up a mock",id:"setting-up-a-mock",level:2},{value:"Test case example",id:"test-case-example",level:2}];function l(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"jest-testing-guide",children:"Jest testing guide"}),"\n",(0,s.jsx)(t.h2,{id:"setting-up-a-mock",children:"Setting up a mock"}),"\n",(0,s.jsxs)(t.p,{children:["This library includes a built in mock for Jest. To use it, add the following code to the ",(0,s.jsx)(t.a,{href:"https://jestjs.io/docs/configuration#setupfiles-array",children:"jest setup"})," file:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-js",children:'jest.mock("react-native-keyboard-controller", () =>\n  require("react-native-keyboard-controller/jest"),\n);\n'})}),"\n",(0,s.jsx)(t.h2,{id:"test-case-example",children:"Test case example"}),"\n",(0,s.jsxs)(t.p,{children:["Once you've set up mock - you can write your first test \ud83d\ude0a. A sample of test case is shown below. For more test cases please see ",(0,s.jsx)(t.a,{href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example/__tests__",children:"this"})," link."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-tsx",children:'import "@testing-library/jest-native/extend-expect";\nimport React from "react";\nimport { Animated } from "react-native";\nimport { render } from "@testing-library/react-native";\n\nimport { useKeyboardAnimation } from "react-native-keyboard-controller";\n\nfunction TestComponent() {\n  const { height } = useKeyboardAnimation();\n\n  return (\n    <Animated.View\n      testID="view"\n      style={{ transform: [{ translateY: height }] }}\n    />\n  );\n}\n\ndescribe("basic keyboard interaction", () => {\n  it("should have different styles depends on position", () => {\n    const { getByTestId, update } = render(<TestComponent />);\n\n    expect(getByTestId("view")).toHaveStyle({ transform: [{ translateY: 0 }] });\n\n    (useKeyboardAnimation as jest.Mock).mockReturnValue({\n      height: new Animated.Value(150),\n      progress: new Animated.Value(0.5),\n    });\n    update(<TestComponent />);\n\n    expect(getByTestId("view")).toHaveStyle({\n      transform: [{ translateY: 150 }],\n    });\n\n    (useKeyboardAnimation as jest.Mock).mockReturnValue({\n      height: new Animated.Value(300),\n      progress: new Animated.Value(1),\n    });\n    update(<TestComponent />);\n\n    expect(getByTestId("view")).toHaveStyle({\n      transform: [{ translateY: 300 }],\n    });\n  });\n});\n'})})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>a});var s=n(96540);const r={},i=s.createContext(r);function o(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);