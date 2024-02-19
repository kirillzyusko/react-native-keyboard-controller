"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7480],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=l(n),m=o,f=d["".concat(c,".").concat(m)]||d[m]||u[m]||a;return n?r.createElement(f,i(i({ref:t},p),{},{components:n})):r.createElement(f,i({ref:t},p))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var l=2;l<a;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6587:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>l});var r=n(7462),o=(n(7294),n(3905));const a={sidebar_position:3},i="Jest testing guide",s={unversionedId:"recipes/jest-testing-guide",id:"version-1.4.0/recipes/jest-testing-guide",title:"Jest testing guide",description:"Setting up a mock",source:"@site/versioned_docs/version-1.4.0/recipes/jest-testing-guide.md",sourceDirName:"recipes",slug:"/recipes/jest-testing-guide",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/1.4.0/recipes/jest-testing-guide",draft:!1,editUrl:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/versioned_docs/version-1.4.0/recipes/jest-testing-guide.md",tags:[],version:"1.4.0",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Platforms capabilities and limitations",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/1.4.0/recipes/platform-differences"},next:{title:"API Reference",permalink:"/react-native-keyboard-controller/pr-preview/pr-347/docs/1.4.0/category/api-reference"}},c={},l=[{value:"Setting up a mock",id:"setting-up-a-mock",level:2},{value:"Test case example",id:"test-case-example",level:2}],p={toc:l};function u(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"jest-testing-guide"},"Jest testing guide"),(0,o.kt)("h2",{id:"setting-up-a-mock"},"Setting up a mock"),(0,o.kt)("p",null,"This library includes a built in mock for Jest. To use it, add the following code to the ",(0,o.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/configuration#setupfiles-array"},"jest setup")," file:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'jest.mock("react-native-keyboard-controller", () =>\n  require("react-native-keyboard-controller/jest"),\n);\n')),(0,o.kt)("h2",{id:"test-case-example"},"Test case example"),(0,o.kt)("p",null,"Once you've set up mock - you can write your first test \ud83d\ude0a. A sample of test case is shown below. For more test cases please see ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example/__tests__"},"this")," link."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'import "@testing-library/jest-native/extend-expect";\nimport React from "react";\nimport { Animated } from "react-native";\nimport { render } from "@testing-library/react-native";\n\nimport { useKeyboardAnimation } from "react-native-keyboard-controller";\n\nfunction TestComponent() {\n  const { height } = useKeyboardAnimation();\n\n  return (\n    <Animated.View\n      testID="view"\n      style={{ transform: [{ translateY: height }] }}\n    />\n  );\n}\n\ndescribe("basic keyboard interaction", () => {\n  it("should have different styles depends on position", () => {\n    const { getByTestId, update } = render(<TestComponent />);\n\n    expect(getByTestId("view")).toHaveStyle({ transform: [{ translateY: 0 }] });\n\n    (useKeyboardAnimation as jest.Mock).mockReturnValue({\n      height: new Animated.Value(150),\n      progress: new Animated.Value(0.5),\n    });\n    update(<TestComponent />);\n\n    expect(getByTestId("view")).toHaveStyle({\n      transform: [{ translateY: 150 }],\n    });\n\n    (useKeyboardAnimation as jest.Mock).mockReturnValue({\n      height: new Animated.Value(300),\n      progress: new Animated.Value(1),\n    });\n    update(<TestComponent />);\n\n    expect(getByTestId("view")).toHaveStyle({\n      transform: [{ translateY: 300 }],\n    });\n  });\n});\n')))}u.isMDXComponent=!0}}]);