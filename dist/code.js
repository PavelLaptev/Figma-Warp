/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/controller.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.tsx");

figma.showUI(__html__, { width: 580, height: 480 });
const getSVG = async (node) => {
    let svg = await node.exportAsync({
        format: "SVG",
        svgOutlineText: true
    });
    return String.fromCharCode.apply(null, svg);
};
const init = async () => {
    let node = figma.currentPage.selection[0];
    if (node && node.type === "VECTOR") {
        _utils__WEBPACK_IMPORTED_MODULE_0__["log"].check("Shape selected");
        let node = figma.currentPage.selection[0];
        figma.ui.postMessage({
            type: "svg-from-figma",
            data: await getSVG(node)
        });
    }
    else if (node && node.type !== "VECTOR") {
        figma.ui.postMessage({
            type: "svg-from-figma",
            event: "error"
        });
        _utils__WEBPACK_IMPORTED_MODULE_0__["log"].warn("convert element to vector type");
    }
    else {
        figma.ui.postMessage({
            type: "svg-from-figma",
            event: "error"
        });
        _utils__WEBPACK_IMPORTED_MODULE_0__["log"].error("Select some vector shape");
    }
};
init();
figma.on("selectionchange", () => {
    console.clear();
    console.log("cleared by new section");
    init();
});
figma.ui.onmessage = async (msg) => {
    let node = figma.currentPage.selection[0];
    if (msg.type === "settings-changes") {
        init();
    }
    if (msg.type === "warped-svg" && node) {
        let nodeFromSVG = figma.createNodeFromSvg(msg.data);
        node.vectorPaths = figma.flatten(nodeFromSVG.children).vectorPaths;
        nodeFromSVG.remove();
    }
    else if (msg.type === "warped-svg" && !node) {
        _utils__WEBPACK_IMPORTED_MODULE_0__["log"].error("Select some vector shape");
    }
};


/***/ }),

/***/ "./src/utils/createPointsArray.tsx":
/*!*****************************************!*\
  !*** ./src/utils/createPointsArray.tsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const createPointsArray = (width, height, amount) => {
    const getDotDistance = (length, index) => (length / amount) * index;
    const amountArray = [...Array(amount).keys()];
    let leftSideDots = amountArray.map((_, i) => [0, getDotDistance(height, i)]);
    let bottomSideDots = amountArray.map((_, i) => [
        getDotDistance(width, i),
        height
    ]);
    let rightSideDots = amountArray
        .map((_, i) => [width, getDotDistance(height, ++i)])
        .reverse();
    let topSideDots = amountArray
        .map((_, i) => [getDotDistance(width, ++i), 0])
        .reverse();
    let dotsArray = [
        ...leftSideDots,
        ...bottomSideDots,
        ...rightSideDots,
        ...topSideDots
    ];
    const controlBuffer = 10;
    for (let i = 0; i < dotsArray.length; i++) {
        if (dotsArray[i][0] === 0)
            dotsArray[i][0] -= controlBuffer;
        if (dotsArray[i][1] === 0)
            dotsArray[i][1] -= controlBuffer;
        if (dotsArray[i][0] === width)
            dotsArray[i][0] += controlBuffer;
        if (dotsArray[i][1] === height)
            dotsArray[i][1] += controlBuffer;
    }
    return dotsArray;
};
/* harmony default export */ __webpack_exports__["default"] = (createPointsArray);


/***/ }),

/***/ "./src/utils/getRatioSize.tsx":
/*!************************************!*\
  !*** ./src/utils/getRatioSize.tsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const getRatioSize = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
        width: Math.round(srcWidth * ratio),
        height: Math.round(srcHeight * ratio)
    };
};
/* harmony default export */ __webpack_exports__["default"] = (getRatioSize);


/***/ }),

/***/ "./src/utils/index.tsx":
/*!*****************************!*\
  !*** ./src/utils/index.tsx ***!
  \*****************************/
/*! exports provided: createPointsArray, getRatioSize, log, warpIt, warpReposition, updateControlPath, sendPaths */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createPointsArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createPointsArray */ "./src/utils/createPointsArray.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createPointsArray", function() { return _createPointsArray__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _getRatioSize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getRatioSize */ "./src/utils/getRatioSize.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRatioSize", function() { return _getRatioSize__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./log */ "./src/utils/log.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "log", function() { return _log__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _warpIt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./warpIt */ "./src/utils/warpIt.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "warpIt", function() { return _warpIt__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _warpReposition__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./warpReposition */ "./src/utils/warpReposition.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "warpReposition", function() { return _warpReposition__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _updateControlPath__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./updateControlPath */ "./src/utils/updateControlPath.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "updateControlPath", function() { return _updateControlPath__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _sendPaths__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sendPaths */ "./src/utils/sendPaths.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sendPaths", function() { return _sendPaths__WEBPACK_IMPORTED_MODULE_6__["default"]; });










/***/ }),

/***/ "./src/utils/log.tsx":
/*!***************************!*\
  !*** ./src/utils/log.tsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
let logStyles = "border-radius: 4px; padding: 2px 4px;";
let logTime = 800;
const log = {
    success: (text, show = true) => {
        show
            ? console.log(`%c${text}`, `background: rgba(0, 255, 136, 0.14);${logStyles}`)
            : false;
        figma.notify(`🎉 ${text}`, {
            timeout: logTime
        });
    },
    check: (text, show = true) => {
        show
            ? console.log(`%c${text}`, `background: rgba(0, 204, 255, 0.14);${logStyles}`)
            : false;
        figma.notify(`✅ ${text}`, {
            timeout: logTime
        });
    },
    neutral: (text, show = true) => {
        show
            ? console.log(`%c${text}`, `background: rgba(128, 128, 128, 0.14);${logStyles}`)
            : false;
        figma.notify(`${text}`, {
            timeout: logTime
        });
    },
    warn: (text, show = true) => {
        show
            ? console.log(`%c${text}`, `background: rgba(255, 123, 0, 0.14);${logStyles}`)
            : false;
        figma.notify(`☢️ ${text}`, {
            timeout: logTime
        });
    },
    error: (text, show = true) => {
        show
            ? console.log(`%c${text}`, `background: rgba(255,0,0,0.14);${logStyles}`)
            : false;
        figma.notify(`⛔️ ${text}`, {
            timeout: logTime
        });
    }
};
/* harmony default export */ __webpack_exports__["default"] = (log);


/***/ }),

/***/ "./src/utils/sendPaths.tsx":
/*!*********************************!*\
  !*** ./src/utils/sendPaths.tsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const sendPaths = svgDom => {
    let s = new XMLSerializer();
    let SVGstr = s.serializeToString(svgDom);
    parent.postMessage({
        pluginMessage: {
            type: "warped-svg",
            data: SVGstr
        }
    }, "*");
};
/* harmony default export */ __webpack_exports__["default"] = (sendPaths);


/***/ }),

/***/ "./src/utils/updateControlPath.tsx":
/*!*****************************************!*\
  !*** ./src/utils/updateControlPath.tsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const updateControlPath = (path, points) => {
    let d = [`M${points[0][0]} ${points[0][1]}`];
    for (let i = 1; i < points.length; i++) {
        d.push(`L${points[i][0]} ${points[i][1]}`);
    }
    d.push("Z");
    path.current.setAttribute("d", d.join(""));
};
/* harmony default export */ __webpack_exports__["default"] = (updateControlPath);


/***/ }),

/***/ "./src/utils/warpIt.tsx":
/*!******************************!*\
  !*** ./src/utils/warpIt.tsx ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const warpIt = (warp, points) => {
    warp.transform(function (v0, V = points) {
        const A = [];
        const W = [];
        const L = [];
        for (let i = 0; i < V.length; i++) {
            const j = (i + 1) % V.length;
            const vi = V[i];
            const vj = V[j];
            const r0i = Math.sqrt((v0[0] - vi[0]) ** 2 + (v0[1] - vi[1]) ** 2);
            const r0j = Math.sqrt((v0[0] - vj[0]) ** 2 + (v0[1] - vj[1]) ** 2);
            const rij = Math.sqrt((vi[0] - vj[0]) ** 2 + (vi[1] - vj[1]) ** 2);
            const dn = 2 * r0i * r0j;
            const r = (r0i ** 2 + r0j ** 2 - rij ** 2) / dn;
            A[i] = isNaN(r) ? 0 : Math.acos(Math.max(-1, Math.min(r, 1)));
        }
        for (let j = 0; j < V.length; j++) {
            const i = (j > 0 ? j : V.length) - 1;
            const vj = V[j];
            const r = Math.sqrt((vj[0] - v0[0]) ** 2 + (vj[1] - v0[1]) ** 2);
            W[j] = (Math.tan(A[i] / 2) + Math.tan(A[j] / 2)) / r;
        }
        const Ws = W.reduce((a, b) => a + b, 0);
        for (let i = 0; i < V.length; i++) {
            L[i] = W[i] / Ws;
        }
        return [...v0, ...L];
    });
};
/* harmony default export */ __webpack_exports__["default"] = (warpIt);


/***/ }),

/***/ "./src/utils/warpReposition.tsx":
/*!**************************************!*\
  !*** ./src/utils/warpReposition.tsx ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const warpReposition = (warp, points) => {
    const reposition = ([, , ...W], V = points) => {
        let nx = 0;
        let ny = 0;
        for (let i = 0; i < V.length; i++) {
            nx += W[i] * V[i][0];
            ny += W[i] * V[i][1];
        }
        return [nx, ny, ...W];
    };
    warp.transform(reposition);
};
/* harmony default export */ __webpack_exports__["default"] = (warpReposition);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9jcmVhdGVQb2ludHNBcnJheS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2dldFJhdGlvU2l6ZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2luZGV4LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvbG9nLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc2VuZFBhdGhzLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvdXBkYXRlQ29udHJvbFBhdGgudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy93YXJwSXQudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy93YXJwUmVwb3NpdGlvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFF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QUs7QUFDTDtBQUNlLHFFQUFNLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUM3QnRCO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLDZFQUFjLEVBQUMiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzXCIpO1xuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDU4MCwgaGVpZ2h0OiA0ODAgfSk7XG5jb25zdCBnZXRTVkcgPSBhc3luYyAobm9kZSkgPT4ge1xuICAgIGxldCBzdmcgPSBhd2FpdCBub2RlLmV4cG9ydEFzeW5jKHtcbiAgICAgICAgZm9ybWF0OiBcIlNWR1wiLFxuICAgICAgICBzdmdPdXRsaW5lVGV4dDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHN2Zyk7XG59O1xuY29uc3QgaW5pdCA9IGFzeW5jICgpID0+IHtcbiAgICBsZXQgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBpZiAobm9kZSAmJiBub2RlLnR5cGUgPT09IFwiVkVDVE9SXCIpIHtcbiAgICAgICAgbG9nLmNoZWNrKFwiU2hhcGUgc2VsZWN0ZWRcIik7XG4gICAgICAgIGxldCBub2RlID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcInN2Zy1mcm9tLWZpZ21hXCIsXG4gICAgICAgICAgICBkYXRhOiBhd2FpdCBnZXRTVkcobm9kZSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUgJiYgbm9kZS50eXBlICE9PSBcIlZFQ1RPUlwiKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwic3ZnLWZyb20tZmlnbWFcIixcbiAgICAgICAgICAgIGV2ZW50OiBcImVycm9yXCJcbiAgICAgICAgfSk7XG4gICAgICAgIGxvZy53YXJuKFwiY29udmVydCBlbGVtZW50IHRvIHZlY3RvciB0eXBlXCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogXCJzdmctZnJvbS1maWdtYVwiLFxuICAgICAgICAgICAgZXZlbnQ6IFwiZXJyb3JcIlxuICAgICAgICB9KTtcbiAgICAgICAgbG9nLmVycm9yKFwiU2VsZWN0IHNvbWUgdmVjdG9yIHNoYXBlXCIpO1xuICAgIH1cbn07XG5pbml0KCk7XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5jbGVhcigpO1xuICAgIGNvbnNvbGUubG9nKFwiY2xlYXJlZCBieSBuZXcgc2VjdGlvblwiKTtcbiAgICBpbml0KCk7XG59KTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGFzeW5jIChtc2cpID0+IHtcbiAgICBsZXQgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBpZiAobXNnLnR5cGUgPT09IFwic2V0dGluZ3MtY2hhbmdlc1wiKSB7XG4gICAgICAgIGluaXQoKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcIndhcnBlZC1zdmdcIiAmJiBub2RlKSB7XG4gICAgICAgIGxldCBub2RlRnJvbVNWRyA9IGZpZ21hLmNyZWF0ZU5vZGVGcm9tU3ZnKG1zZy5kYXRhKTtcbiAgICAgICAgbm9kZS52ZWN0b3JQYXRocyA9IGZpZ21hLmZsYXR0ZW4obm9kZUZyb21TVkcuY2hpbGRyZW4pLnZlY3RvclBhdGhzO1xuICAgICAgICBub2RlRnJvbVNWRy5yZW1vdmUoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobXNnLnR5cGUgPT09IFwid2FycGVkLXN2Z1wiICYmICFub2RlKSB7XG4gICAgICAgIGxvZy5lcnJvcihcIlNlbGVjdCBzb21lIHZlY3RvciBzaGFwZVwiKTtcbiAgICB9XG59O1xuIiwiY29uc3QgY3JlYXRlUG9pbnRzQXJyYXkgPSAod2lkdGgsIGhlaWdodCwgYW1vdW50KSA9PiB7XG4gICAgY29uc3QgZ2V0RG90RGlzdGFuY2UgPSAobGVuZ3RoLCBpbmRleCkgPT4gKGxlbmd0aCAvIGFtb3VudCkgKiBpbmRleDtcbiAgICBjb25zdCBhbW91bnRBcnJheSA9IFsuLi5BcnJheShhbW91bnQpLmtleXMoKV07XG4gICAgbGV0IGxlZnRTaWRlRG90cyA9IGFtb3VudEFycmF5Lm1hcCgoXywgaSkgPT4gWzAsIGdldERvdERpc3RhbmNlKGhlaWdodCwgaSldKTtcbiAgICBsZXQgYm90dG9tU2lkZURvdHMgPSBhbW91bnRBcnJheS5tYXAoKF8sIGkpID0+IFtcbiAgICAgICAgZ2V0RG90RGlzdGFuY2Uod2lkdGgsIGkpLFxuICAgICAgICBoZWlnaHRcbiAgICBdKTtcbiAgICBsZXQgcmlnaHRTaWRlRG90cyA9IGFtb3VudEFycmF5XG4gICAgICAgIC5tYXAoKF8sIGkpID0+IFt3aWR0aCwgZ2V0RG90RGlzdGFuY2UoaGVpZ2h0LCArK2kpXSlcbiAgICAgICAgLnJldmVyc2UoKTtcbiAgICBsZXQgdG9wU2lkZURvdHMgPSBhbW91bnRBcnJheVxuICAgICAgICAubWFwKChfLCBpKSA9PiBbZ2V0RG90RGlzdGFuY2Uod2lkdGgsICsraSksIDBdKVxuICAgICAgICAucmV2ZXJzZSgpO1xuICAgIGxldCBkb3RzQXJyYXkgPSBbXG4gICAgICAgIC4uLmxlZnRTaWRlRG90cyxcbiAgICAgICAgLi4uYm90dG9tU2lkZURvdHMsXG4gICAgICAgIC4uLnJpZ2h0U2lkZURvdHMsXG4gICAgICAgIC4uLnRvcFNpZGVEb3RzXG4gICAgXTtcbiAgICBjb25zdCBjb250cm9sQnVmZmVyID0gMTA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb3RzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGRvdHNBcnJheVtpXVswXSA9PT0gMClcbiAgICAgICAgICAgIGRvdHNBcnJheVtpXVswXSAtPSBjb250cm9sQnVmZmVyO1xuICAgICAgICBpZiAoZG90c0FycmF5W2ldWzFdID09PSAwKVxuICAgICAgICAgICAgZG90c0FycmF5W2ldWzFdIC09IGNvbnRyb2xCdWZmZXI7XG4gICAgICAgIGlmIChkb3RzQXJyYXlbaV1bMF0gPT09IHdpZHRoKVxuICAgICAgICAgICAgZG90c0FycmF5W2ldWzBdICs9IGNvbnRyb2xCdWZmZXI7XG4gICAgICAgIGlmIChkb3RzQXJyYXlbaV1bMV0gPT09IGhlaWdodClcbiAgICAgICAgICAgIGRvdHNBcnJheVtpXVsxXSArPSBjb250cm9sQnVmZmVyO1xuICAgIH1cbiAgICByZXR1cm4gZG90c0FycmF5O1xufTtcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBvaW50c0FycmF5O1xuIiwiY29uc3QgZ2V0UmF0aW9TaXplID0gKHNyY1dpZHRoLCBzcmNIZWlnaHQsIG1heFdpZHRoLCBtYXhIZWlnaHQpID0+IHtcbiAgICB2YXIgcmF0aW8gPSBNYXRoLm1pbihtYXhXaWR0aCAvIHNyY1dpZHRoLCBtYXhIZWlnaHQgLyBzcmNIZWlnaHQpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKHNyY1dpZHRoICogcmF0aW8pLFxuICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoc3JjSGVpZ2h0ICogcmF0aW8pXG4gICAgfTtcbn07XG5leHBvcnQgZGVmYXVsdCBnZXRSYXRpb1NpemU7XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIGNyZWF0ZVBvaW50c0FycmF5IH0gZnJvbSBcIi4vY3JlYXRlUG9pbnRzQXJyYXlcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0UmF0aW9TaXplIH0gZnJvbSBcIi4vZ2V0UmF0aW9TaXplXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxvZyB9IGZyb20gXCIuL2xvZ1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB3YXJwSXQgfSBmcm9tIFwiLi93YXJwSXRcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgd2FycFJlcG9zaXRpb24gfSBmcm9tIFwiLi93YXJwUmVwb3NpdGlvblwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1cGRhdGVDb250cm9sUGF0aCB9IGZyb20gXCIuL3VwZGF0ZUNvbnRyb2xQYXRoXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNlbmRQYXRocyB9IGZyb20gXCIuL3NlbmRQYXRoc1wiO1xuIiwibGV0IGxvZ1N0eWxlcyA9IFwiYm9yZGVyLXJhZGl1czogNHB4OyBwYWRkaW5nOiAycHggNHB4O1wiO1xubGV0IGxvZ1RpbWUgPSA4MDA7XG5jb25zdCBsb2cgPSB7XG4gICAgc3VjY2VzczogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDAsIDI1NSwgMTM2LCAwLjE0KTske2xvZ1N0eWxlc31gKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgZmlnbWEubm90aWZ5KGDwn46JICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgY2hlY2s6ICh0ZXh0LCBzaG93ID0gdHJ1ZSkgPT4ge1xuICAgICAgICBzaG93XG4gICAgICAgICAgICA/IGNvbnNvbGUubG9nKGAlYyR7dGV4dH1gLCBgYmFja2dyb3VuZDogcmdiYSgwLCAyMDQsIDI1NSwgMC4xNCk7JHtsb2dTdHlsZXN9YClcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgIGZpZ21hLm5vdGlmeShg4pyFICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbmV1dHJhbDogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuMTQpOyR7bG9nU3R5bGVzfWApXG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICBmaWdtYS5ub3RpZnkoYCR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgd2FybjogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMTIzLCAwLCAwLjE0KTske2xvZ1N0eWxlc31gKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgZmlnbWEubm90aWZ5KGDimKLvuI8gJHt0ZXh0fWAsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IGxvZ1RpbWVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBlcnJvcjogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwwLDAsMC4xNCk7JHtsb2dTdHlsZXN9YClcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgIGZpZ21hLm5vdGlmeShg4puU77iPICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBsb2c7XG4iLCJjb25zdCBzZW5kUGF0aHMgPSBzdmdEb20gPT4ge1xuICAgIGxldCBzID0gbmV3IFhNTFNlcmlhbGl6ZXIoKTtcbiAgICBsZXQgU1ZHc3RyID0gcy5zZXJpYWxpemVUb1N0cmluZyhzdmdEb20pO1xuICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHBsdWdpbk1lc3NhZ2U6IHtcbiAgICAgICAgICAgIHR5cGU6IFwid2FycGVkLXN2Z1wiLFxuICAgICAgICAgICAgZGF0YTogU1ZHc3RyXG4gICAgICAgIH1cbiAgICB9LCBcIipcIik7XG59O1xuZXhwb3J0IGRlZmF1bHQgc2VuZFBhdGhzO1xuIiwiY29uc3QgdXBkYXRlQ29udHJvbFBhdGggPSAocGF0aCwgcG9pbnRzKSA9PiB7XG4gICAgbGV0IGQgPSBbYE0ke3BvaW50c1swXVswXX0gJHtwb2ludHNbMF1bMV19YF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZC5wdXNoKGBMJHtwb2ludHNbaV1bMF19ICR7cG9pbnRzW2ldWzFdfWApO1xuICAgIH1cbiAgICBkLnB1c2goXCJaXCIpO1xuICAgIHBhdGguY3VycmVudC5zZXRBdHRyaWJ1dGUoXCJkXCIsIGQuam9pbihcIlwiKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ29udHJvbFBhdGg7XG4iLCJjb25zdCB3YXJwSXQgPSAod2FycCwgcG9pbnRzKSA9PiB7XG4gICAgd2FycC50cmFuc2Zvcm0oZnVuY3Rpb24gKHYwLCBWID0gcG9pbnRzKSB7XG4gICAgICAgIGNvbnN0IEEgPSBbXTtcbiAgICAgICAgY29uc3QgVyA9IFtdO1xuICAgICAgICBjb25zdCBMID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgVi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaiA9IChpICsgMSkgJSBWLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IHZpID0gVltpXTtcbiAgICAgICAgICAgIGNvbnN0IHZqID0gVltqXTtcbiAgICAgICAgICAgIGNvbnN0IHIwaSA9IE1hdGguc3FydCgodjBbMF0gLSB2aVswXSkgKiogMiArICh2MFsxXSAtIHZpWzFdKSAqKiAyKTtcbiAgICAgICAgICAgIGNvbnN0IHIwaiA9IE1hdGguc3FydCgodjBbMF0gLSB2alswXSkgKiogMiArICh2MFsxXSAtIHZqWzFdKSAqKiAyKTtcbiAgICAgICAgICAgIGNvbnN0IHJpaiA9IE1hdGguc3FydCgodmlbMF0gLSB2alswXSkgKiogMiArICh2aVsxXSAtIHZqWzFdKSAqKiAyKTtcbiAgICAgICAgICAgIGNvbnN0IGRuID0gMiAqIHIwaSAqIHIwajtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAocjBpICoqIDIgKyByMGogKiogMiAtIHJpaiAqKiAyKSAvIGRuO1xuICAgICAgICAgICAgQVtpXSA9IGlzTmFOKHIpID8gMCA6IE1hdGguYWNvcyhNYXRoLm1heCgtMSwgTWF0aC5taW4ociwgMSkpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFYubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSAoaiA+IDAgPyBqIDogVi5sZW5ndGgpIC0gMTtcbiAgICAgICAgICAgIGNvbnN0IHZqID0gVltqXTtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBNYXRoLnNxcnQoKHZqWzBdIC0gdjBbMF0pICoqIDIgKyAodmpbMV0gLSB2MFsxXSkgKiogMik7XG4gICAgICAgICAgICBXW2pdID0gKE1hdGgudGFuKEFbaV0gLyAyKSArIE1hdGgudGFuKEFbal0gLyAyKSkgLyByO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFdzID0gVy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBWLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBMW2ldID0gV1tpXSAvIFdzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbLi4udjAsIC4uLkxdO1xuICAgIH0pO1xufTtcbmV4cG9ydCBkZWZhdWx0IHdhcnBJdDtcbiIsImNvbnN0IHdhcnBSZXBvc2l0aW9uID0gKHdhcnAsIHBvaW50cykgPT4ge1xuICAgIGNvbnN0IHJlcG9zaXRpb24gPSAoWywgLCAuLi5XXSwgViA9IHBvaW50cykgPT4ge1xuICAgICAgICBsZXQgbnggPSAwO1xuICAgICAgICBsZXQgbnkgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG54ICs9IFdbaV0gKiBWW2ldWzBdO1xuICAgICAgICAgICAgbnkgKz0gV1tpXSAqIFZbaV1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtueCwgbnksIC4uLlddO1xuICAgIH07XG4gICAgd2FycC50cmFuc2Zvcm0ocmVwb3NpdGlvbik7XG59O1xuZXhwb3J0IGRlZmF1bHQgd2FycFJlcG9zaXRpb247XG4iXSwic291cmNlUm9vdCI6IiJ9