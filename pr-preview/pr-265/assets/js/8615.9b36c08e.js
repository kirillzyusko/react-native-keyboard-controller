"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8615],{9047:(n,e,t)=>{t.d(e,{Z:()=>T});var i=t(7294),a=t(5893);function s(n){const{mdxAdmonitionTitle:e,rest:t}=function(n){const e=i.Children.toArray(n),t=e.find((n=>i.isValidElement(n)&&"mdxAdmonitionTitle"===n.type)),s=e.filter((n=>n!==t)),l=t?.props.children;return{mdxAdmonitionTitle:l,rest:s.length>0?(0,a.jsx)(a.Fragment,{children:s}):null}}(n.children),s=n.title??e;return{...n,...s&&{title:s},children:t}}var l=t(512),o=t(5999),r=t(5281);const c={admonition:"admonition_xJq3",admonitionHeading:"admonitionHeading_Gvgb",admonitionIcon:"admonitionIcon_Rf37",admonitionContent:"admonitionContent_BuS1"};function d(n){let{type:e,className:t,children:i}=n;return(0,a.jsx)("div",{className:(0,l.Z)(r.k.common.admonition,r.k.common.admonitionType(e),c.admonition,t),children:i})}function u(n){let{icon:e,title:t}=n;return(0,a.jsxs)("div",{className:c.admonitionHeading,children:[(0,a.jsx)("span",{className:c.admonitionIcon,children:e}),t]})}function m(n){let{children:e}=n;return e?(0,a.jsx)("div",{className:c.admonitionContent,children:e}):null}function h(n){const{type:e,icon:t,title:i,children:s,className:l}=n;return(0,a.jsxs)(d,{type:e,className:l,children:[(0,a.jsx)(u,{title:i,icon:t}),(0,a.jsx)(m,{children:s})]})}function x(n){return(0,a.jsx)("svg",{viewBox:"0 0 14 16",...n,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})})}const f={icon:(0,a.jsx)(x,{}),title:(0,a.jsx)(o.Z,{id:"theme.admonition.note",description:"The default label used for the Note admonition (:::note)",children:"note"})};function j(n){return(0,a.jsx)(h,{...f,...n,className:(0,l.Z)("alert alert--secondary",n.className),children:n.children})}function g(n){return(0,a.jsx)("svg",{viewBox:"0 0 12 16",...n,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})})}const p={icon:(0,a.jsx)(g,{}),title:(0,a.jsx)(o.Z,{id:"theme.admonition.tip",description:"The default label used for the Tip admonition (:::tip)",children:"tip"})};function v(n){return(0,a.jsx)(h,{...p,...n,className:(0,l.Z)("alert alert--success",n.className),children:n.children})}function Z(n){return(0,a.jsx)("svg",{viewBox:"0 0 14 16",...n,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})})}const N={icon:(0,a.jsx)(Z,{}),title:(0,a.jsx)(o.Z,{id:"theme.admonition.info",description:"The default label used for the Info admonition (:::info)",children:"info"})};function b(n){return(0,a.jsx)(h,{...N,...n,className:(0,l.Z)("alert alert--info",n.className),children:n.children})}function C(n){return(0,a.jsx)("svg",{viewBox:"0 0 16 16",...n,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"})})}const _={icon:(0,a.jsx)(C,{}),title:(0,a.jsx)(o.Z,{id:"theme.admonition.warning",description:"The default label used for the Warning admonition (:::warning)",children:"warning"})};function y(n){return(0,a.jsx)("svg",{viewBox:"0 0 12 16",...n,children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"})})}const k={icon:(0,a.jsx)(y,{}),title:(0,a.jsx)(o.Z,{id:"theme.admonition.danger",description:"The default label used for the Danger admonition (:::danger)",children:"danger"})};const w={icon:(0,a.jsx)(C,{}),title:(0,a.jsx)(o.Z,{id:"theme.admonition.caution",description:"The default label used for the Caution admonition (:::caution)",children:"caution"})};const z={...{note:j,tip:v,info:b,warning:function(n){return(0,a.jsx)(h,{..._,...n,className:(0,l.Z)("alert alert--warning",n.className),children:n.children})},danger:function(n){return(0,a.jsx)(h,{...k,...n,className:(0,l.Z)("alert alert--danger",n.className),children:n.children})}},...{secondary:n=>(0,a.jsx)(j,{title:"secondary",...n}),important:n=>(0,a.jsx)(b,{title:"important",...n}),success:n=>(0,a.jsx)(v,{title:"success",...n}),caution:function(n){return(0,a.jsx)(h,{...w,...n,className:(0,l.Z)("alert alert--warning",n.className),children:n.children})}}};function T(n){const e=s(n),t=(i=e.type,z[i]||(console.warn(`No admonition component found for admonition type "${i}". Using Info as fallback.`),z.info));var i;return(0,a.jsx)(t,{...e})}},4881:(n,e,t)=>{t.d(e,{Z:()=>d});t(7294);var i=t(5999),a=t(5281),s=t(3692),l=t(512);const o={iconEdit:"iconEdit_Z9Sw"};var r=t(5893);function c(n){let{className:e,...t}=n;return(0,r.jsx)("svg",{fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,l.Z)(o.iconEdit,e),"aria-hidden":"true",...t,children:(0,r.jsx)("g",{children:(0,r.jsx)("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})})})}function d(n){let{editUrl:e}=n;return(0,r.jsxs)(s.Z,{to:e,className:a.k.common.editThisPage,children:[(0,r.jsx)(c,{}),(0,r.jsx)(i.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page",children:"Edit this page"})]})}},8064:(n,e,t)=>{t.d(e,{Z:()=>E});var i=t(7294);const a={},s=i.createContext(a);function l(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(a):n.components||a:function(n){const e=i.useContext(s);return i.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}(n.components),i.createElement(s.Provider,{value:e},n.children)}var o=t(5742),r=t(9286),c=t(5893);function d(n){return(0,c.jsx)("code",{...n})}var u=t(3692);var m=t(512),h=t(8138),x=t(2389),f=t(6043);const j={details:"details_lb9f",isBrowser:"isBrowser_bmU9",collapsibleContent:"collapsibleContent_i85q"};function g(n){return!!n&&("SUMMARY"===n.tagName||g(n.parentElement))}function p(n,e){return!!n&&(n===e||p(n.parentElement,e))}function v(n){let{summary:e,children:t,...a}=n;(0,h.Z)().collectAnchor(a.id);const s=(0,x.Z)(),l=(0,i.useRef)(null),{collapsed:o,setCollapsed:r}=(0,f.u)({initialState:!a.open}),[d,u]=(0,i.useState)(a.open),v=i.isValidElement(e)?e:(0,c.jsx)("summary",{children:e??"Details"});return(0,c.jsxs)("details",{...a,ref:l,open:d,"data-collapsed":o,className:(0,m.Z)(j.details,s&&j.isBrowser,a.className),onMouseDown:n=>{g(n.target)&&n.detail>1&&n.preventDefault()},onClick:n=>{n.stopPropagation();const e=n.target;g(e)&&p(e,l.current)&&(n.preventDefault(),o?(r(!1),u(!0)):r(!0))},children:[v,(0,c.jsx)(f.z,{lazy:!1,collapsed:o,disableSSRStyle:!0,onCollapseTransitionEnd:n=>{r(n),u(!n)},children:(0,c.jsx)("div",{className:j.collapsibleContent,children:t})})]})}const Z={details:"details_b_Ee"},N="alert alert--info";function b(n){let{...e}=n;return(0,c.jsx)(v,{...e,className:(0,m.Z)(N,Z.details,e.className)})}function C(n){const e=i.Children.toArray(n.children),t=e.find((n=>i.isValidElement(n)&&"summary"===n.type)),a=(0,c.jsx)(c.Fragment,{children:e.filter((n=>n!==t))});return(0,c.jsx)(b,{...n,summary:t,children:a})}var _=t(7955);function y(n){return(0,c.jsx)(_.Z,{...n})}const k={containsTaskList:"containsTaskList_mC6p"};function w(n){if(void 0!==n)return(0,m.Z)(n,n?.includes("contains-task-list")&&k.containsTaskList)}const z={img:"img_ev3q"};var T=t(9047);const M={Head:o.Z,details:C,Details:C,code:function(n){return function(n){return void 0!==n.children&&i.Children.toArray(n.children).every((n=>"string"==typeof n&&!n.includes("\n")))}(n)?(0,c.jsx)(d,{...n}):(0,c.jsx)(r.Z,{...n})},a:function(n){return(0,c.jsx)(u.Z,{...n})},pre:function(n){return(0,c.jsx)(c.Fragment,{children:n.children})},ul:function(n){return(0,c.jsx)("ul",{...n,className:w(n.className)})},li:function(n){return(0,h.Z)().collectAnchor(n.id),(0,c.jsx)("li",{...n})},img:function(n){return(0,c.jsx)("img",{decoding:"async",loading:"lazy",...n,className:(e=n.className,(0,m.Z)(e,z.img))});var e},h1:n=>(0,c.jsx)(y,{as:"h1",...n}),h2:n=>(0,c.jsx)(y,{as:"h2",...n}),h3:n=>(0,c.jsx)(y,{as:"h3",...n}),h4:n=>(0,c.jsx)(y,{as:"h4",...n}),h5:n=>(0,c.jsx)(y,{as:"h5",...n}),h6:n=>(0,c.jsx)(y,{as:"h6",...n}),admonition:T.Z,mermaid:()=>null};function E(n){let{children:e}=n;return(0,c.jsx)(l,{components:M,children:e})}},2244:(n,e,t)=>{t.d(e,{Z:()=>l});t(7294);var i=t(512),a=t(3692),s=t(5893);function l(n){const{permalink:e,title:t,subLabel:l,isNext:o}=n;return(0,s.jsxs)(a.Z,{className:(0,i.Z)("pagination-nav__link",o?"pagination-nav__link--next":"pagination-nav__link--prev"),to:e,children:[l&&(0,s.jsx)("div",{className:"pagination-nav__sublabel",children:l}),(0,s.jsx)("div",{className:"pagination-nav__label",children:t})]})}},3008:(n,e,t)=>{t.d(e,{Z:()=>o});t(7294);var i=t(512),a=t(3692);const s={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};var l=t(5893);function o(n){let{permalink:e,label:t,count:o}=n;return(0,l.jsxs)(a.Z,{href:e,className:(0,i.Z)(s.tag,o?s.tagWithCount:s.tagRegular),children:[t,o&&(0,l.jsx)("span",{children:o})]})}},1526:(n,e,t)=>{t.d(e,{Z:()=>r});t(7294);var i=t(512),a=t(5999),s=t(3008);const l={tags:"tags_jXut",tag:"tag_QGVx"};var o=t(5893);function r(n){let{tags:e}=n;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("b",{children:(0,o.jsx)(a.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list",children:"Tags:"})}),(0,o.jsx)("ul",{className:(0,i.Z)(l.tags,"padding--none","margin-left--sm"),children:e.map((n=>{let{label:e,permalink:t}=n;return(0,o.jsx)("li",{className:l.tag,children:(0,o.jsx)(s.Z,{label:e,permalink:t})},t)}))})]})}}}]);