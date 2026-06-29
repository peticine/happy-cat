(function(){"use strict";/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=([e,t,o])=>{const n=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(t).forEach(r=>{n.setAttribute(r,String(t[r]))}),o!=null&&o.length&&o.forEach(r=>{const a=l(r);n.appendChild(a)}),n},w=(e,t={})=>{const n={...i,...t};return l(["svg",n,e])};/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(...e)=>e.filter((t,o,n)=>!!t&&t.trim()!==""&&n.indexOf(t)===o).join(" ").trim();/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,o,n)=>n?n.toUpperCase():o.toLowerCase());/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=e=>{const t=A(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=e=>Array.from(e.attributes).reduce((t,o)=>(t[o.name]=o.value,t),{}),u=e=>typeof e=="string"?e:!e||!e.class?"":e.class&&typeof e.class=="string"?e.class.split(" "):e.class&&Array.isArray(e.class)?e.class:"",d=(e,{nameAttr:t,icons:o,attrs:n})=>{var m;const r=e.getAttribute(t);if(r==null)return;const a=v(r),s=o[a];if(!s)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);const c=b(e),j=g(c)?{}:{"aria-hidden":"true"},p={...i,"data-lucide":r,...j,...n,...c},x=u(c),N=u(n),f=y("lucide",`lucide-${r}`,...x,...N);f&&Object.assign(p,{class:f});const S=w(s,p);return(m=e.parentNode)==null?void 0:m.replaceChild(S,e)};/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"}]];/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["path",{d:"M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18"}],["path",{d:"M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"}]];/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"}],["path",{d:"M7 2v20"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"}]];/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15"}]];/**
 * @license lucide v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=({icons:e={},nameAttr:t="data-lucide",attrs:o={},root:n=document,inTemplates:r}={})=>{if(!Object.values(e).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof n>"u")throw new Error("`createIcons()` only works in a browser environment.");if(Array.from(n.querySelectorAll(`[${t}]`)).forEach(s=>d(s,{nameAttr:t,icons:e,attrs:o})),r&&Array.from(n.querySelectorAll("template")).forEach(c=>h({icons:e,nameAttr:t,attrs:o,root:c.content,inTemplates:r})),t==="data-lucide"){const s=n.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(c=>d(c,{nameAttr:"icon-name",icons:e,attrs:o})))}};h({icons:{Utensils:k,Moon:C,Toilet:E,VolumeX:M},attrs:{width:28,height:28,strokeWidth:1.5}})})();
