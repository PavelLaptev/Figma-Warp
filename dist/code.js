!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=14)}({1:function(e,t,r){"use strict";r.d(t,"a",(function(){return n})),r.d(t,"b",(function(){return a})),r.d(t,"e",(function(){return i})),r.d(t,"f",(function(){return c})),r.d(t,"d",(function(){return s})),r.d(t,"c",(function(){return l}));var n=(e,t,r)=>{const n=(e,t)=>e/r*t,o=[...Array(r).keys()];let a=[...o.map((e,r)=>[0,n(t,r)]),...o.map((r,o)=>[n(e,o),t]),...o.map((r,o)=>[e,n(t,++o)]).reverse(),...o.map((t,r)=>[n(e,++r),0]).reverse()];for(let r=0;r<a.length;r++)0===a[r][0]&&(a[r][0]-=10),0===a[r][1]&&(a[r][1]-=10),a[r][0]===e&&(a[r][0]+=10),a[r][1]===t&&(a[r][1]+=10);return a};let o="border-radius: 4px; padding: 2px 4px;";var a={success:(e,t=!0)=>{t&&console.log("%c"+e,"background: rgba(0, 255, 136, 0.14);"+o),figma.notify("🎉 "+e,{timeout:800})},check:(e,t=!0)=>{t&&console.log("%c"+e,"background: rgba(0, 204, 255, 0.14);"+o),figma.notify("✅ "+e,{timeout:800})},neutral:(e,t=!0)=>{t&&console.log("%c"+e,"background: rgba(128, 128, 128, 0.14);"+o),figma.notify(""+e,{timeout:800})},warn:(e,t=!0)=>{t&&console.log("%c"+e,"background: rgba(255, 123, 0, 0.14);"+o),figma.notify("☢️ "+e,{timeout:800})},error:(e,t=!0)=>{t&&console.log("%c"+e,"background: rgba(255,0,0,0.14);"+o),figma.notify("⛔️ "+e,{timeout:800})}};var i=(e,t)=>{e.transform((function(e,r=t){const n=[],o=[],a=[];for(let t=0;t<r.length;t++){const o=(t+1)%r.length,a=r[t],i=r[o],c=Math.sqrt((e[0]-a[0])**2+(e[1]-a[1])**2),s=Math.sqrt((e[0]-i[0])**2+(e[1]-i[1])**2),l=(c**2+s**2-Math.sqrt((a[0]-i[0])**2+(a[1]-i[1])**2)**2)/(2*c*s);n[t]=isNaN(l)?0:Math.acos(Math.max(-1,Math.min(l,1)))}for(let t=0;t<r.length;t++){const a=(t>0?t:r.length)-1,i=r[t],c=Math.sqrt((i[0]-e[0])**2+(i[1]-e[1])**2);o[t]=(Math.tan(n[a]/2)+Math.tan(n[t]/2))/c}const i=o.reduce((e,t)=>e+t,0);for(let e=0;e<r.length;e++)a[e]=o[e]/i;return[...e,...a]}))};var c=(e,t)=>{e.transform(([,,...e],r=t)=>{let n=0,o=0;for(let t=0;t<r.length;t++)n+=e[t]*r[t][0],o+=e[t]*r[t][1];return[n,o,...e]})};var s=(e,t)=>{let r=[`M${t[0][0]} ${t[0][1]}`];for(let e=1;e<t.length;e++)r.push(`L${t[e][0]} ${t[e][1]}`);r.push("Z"),e.current.setAttribute("d",r.join(""))};var l=e=>{let t=(new XMLSerializer).serializeToString(e);parent.postMessage({pluginMessage:{type:"warped-svg",data:t}},"*")}},14:function(e,t,r){"use strict";r.r(t);var n=r(1);figma.showUI(__html__,{width:580,height:480});const o=async e=>{let t=await e.exportAsync({format:"SVG",svgOutlineText:!0});return String.fromCharCode.apply(null,t)},a=async()=>{let e=figma.currentPage.selection[0];if(e)if("VECTOR"===e.type||"TEXT"===e.type||"RECTANGLE"===e.type||"ELLIPSE"===e.type||"POLYGON"===e.type||"STAR"===e.type||"LINE"===e.type){n.b.check("Shape selected");let e=figma.currentPage.selection[0];figma.ui.postMessage({type:"svg-from-figma",data:await o(e)})}else figma.ui.postMessage({type:"svg-from-figma",event:"error"}),n.b.warn("convert element to vector type");else figma.ui.postMessage({type:"svg-from-figma",event:"error"}),n.b.error("Select some vector shape")};a(),figma.on("selectionchange",()=>{console.clear(),console.log("cleared by new section"),a()}),figma.ui.onmessage=async e=>{let t=figma.currentPage.selection[0];if("settings-changes"===e.type&&a(),"warped-svg"===e.type&&t){let r=figma.createNodeFromSvg(e.data),n=figma.flatten(r.children);t.parent.appendChild(n),n.x=t.x,n.y=t.y,n.name=t.name,figma.currentPage.selection=[n],r.remove(),t.remove()}else"warped-svg"!==e.type||t||n.b.error("Select some vector shape")}}});