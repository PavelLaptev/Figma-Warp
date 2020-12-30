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
    if (msg.type === "complexity") {
        console.clear();
        init();
        _utils__WEBPACK_IMPORTED_MODULE_0__["log"].check(`Complexity: ${msg.data}`);
    }
    if (msg.type === "warped-svg" && node) {
        let nodeFromSVG = figma.createNodeFromSvg(msg.data);
        node.vectorPaths = figma.flatten(nodeFromSVG.children).vectorPaths;
        nodeFromSVG.remove();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9jcmVhdGVQb2ludHNBcnJheS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2dldFJhdGlvU2l6ZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2luZGV4LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvbG9nLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvc2VuZFBhdGhzLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvdXBkYXRlQ29udHJvbFBhdGgudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy93YXJwSXQudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy93YXJwUmVwb3NpdGlvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFF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O0FBQ0EsS0FBSztBQUNMO0FBQ2UscUVBQU0sRUFBQzs7Ozs7Ozs7Ozs7OztBQzdCdEI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixjQUFjO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsNkVBQWMsRUFBQyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIik7XG4iLCJpbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNTgwLCBoZWlnaHQ6IDQ4MCB9KTtcbmNvbnN0IGdldFNWRyA9IGFzeW5jIChub2RlKSA9PiB7XG4gICAgbGV0IHN2ZyA9IGF3YWl0IG5vZGUuZXhwb3J0QXN5bmMoe1xuICAgICAgICBmb3JtYXQ6IFwiU1ZHXCIsXG4gICAgICAgIHN2Z091dGxpbmVUZXh0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgc3ZnKTtcbn07XG5jb25zdCBpbml0ID0gYXN5bmMgKCkgPT4ge1xuICAgIGxldCBub2RlID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIGlmIChub2RlICYmIG5vZGUudHlwZSA9PT0gXCJWRUNUT1JcIikge1xuICAgICAgICBsb2cuY2hlY2soXCJTaGFwZSBzZWxlY3RlZFwiKTtcbiAgICAgICAgbGV0IG5vZGUgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwic3ZnLWZyb20tZmlnbWFcIixcbiAgICAgICAgICAgIGRhdGE6IGF3YWl0IGdldFNWRyhub2RlKVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZSAmJiBub2RlLnR5cGUgIT09IFwiVkVDVE9SXCIpIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogXCJzdmctZnJvbS1maWdtYVwiLFxuICAgICAgICAgICAgZXZlbnQ6IFwiZXJyb3JcIlxuICAgICAgICB9KTtcbiAgICAgICAgbG9nLndhcm4oXCJjb252ZXJ0IGVsZW1lbnQgdG8gdmVjdG9yIHR5cGVcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcInN2Zy1mcm9tLWZpZ21hXCIsXG4gICAgICAgICAgICBldmVudDogXCJlcnJvclwiXG4gICAgICAgIH0pO1xuICAgICAgICBsb2cuZXJyb3IoXCJTZWxlY3Qgc29tZSB2ZWN0b3Igc2hhcGVcIik7XG4gICAgfVxufTtcbmluaXQoKTtcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmNsZWFyKCk7XG4gICAgY29uc29sZS5sb2coXCJjbGVhcmVkIGJ5IG5ldyBzZWN0aW9uXCIpO1xuICAgIGluaXQoKTtcbn0pO1xuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICAgIGxldCBub2RlID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjb21wbGV4aXR5XCIpIHtcbiAgICAgICAgY29uc29sZS5jbGVhcigpO1xuICAgICAgICBpbml0KCk7XG4gICAgICAgIGxvZy5jaGVjayhgQ29tcGxleGl0eTogJHttc2cuZGF0YX1gKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcIndhcnBlZC1zdmdcIiAmJiBub2RlKSB7XG4gICAgICAgIGxldCBub2RlRnJvbVNWRyA9IGZpZ21hLmNyZWF0ZU5vZGVGcm9tU3ZnKG1zZy5kYXRhKTtcbiAgICAgICAgbm9kZS52ZWN0b3JQYXRocyA9IGZpZ21hLmZsYXR0ZW4obm9kZUZyb21TVkcuY2hpbGRyZW4pLnZlY3RvclBhdGhzO1xuICAgICAgICBub2RlRnJvbVNWRy5yZW1vdmUoKTtcbiAgICB9XG59O1xuIiwiY29uc3QgY3JlYXRlUG9pbnRzQXJyYXkgPSAod2lkdGgsIGhlaWdodCwgYW1vdW50KSA9PiB7XG4gICAgY29uc3QgZ2V0RG90RGlzdGFuY2UgPSAobGVuZ3RoLCBpbmRleCkgPT4gKGxlbmd0aCAvIGFtb3VudCkgKiBpbmRleDtcbiAgICBjb25zdCBhbW91bnRBcnJheSA9IFsuLi5BcnJheShhbW91bnQpLmtleXMoKV07XG4gICAgbGV0IGxlZnRTaWRlRG90cyA9IGFtb3VudEFycmF5Lm1hcCgoXywgaSkgPT4gWzAsIGdldERvdERpc3RhbmNlKGhlaWdodCwgaSldKTtcbiAgICBsZXQgYm90dG9tU2lkZURvdHMgPSBhbW91bnRBcnJheS5tYXAoKF8sIGkpID0+IFtcbiAgICAgICAgZ2V0RG90RGlzdGFuY2Uod2lkdGgsIGkpLFxuICAgICAgICBoZWlnaHRcbiAgICBdKTtcbiAgICBsZXQgcmlnaHRTaWRlRG90cyA9IGFtb3VudEFycmF5XG4gICAgICAgIC5tYXAoKF8sIGkpID0+IFt3aWR0aCwgZ2V0RG90RGlzdGFuY2UoaGVpZ2h0LCArK2kpXSlcbiAgICAgICAgLnJldmVyc2UoKTtcbiAgICBsZXQgdG9wU2lkZURvdHMgPSBhbW91bnRBcnJheVxuICAgICAgICAubWFwKChfLCBpKSA9PiBbZ2V0RG90RGlzdGFuY2Uod2lkdGgsICsraSksIDBdKVxuICAgICAgICAucmV2ZXJzZSgpO1xuICAgIGxldCBkb3RzQXJyYXkgPSBbXG4gICAgICAgIC4uLmxlZnRTaWRlRG90cyxcbiAgICAgICAgLi4uYm90dG9tU2lkZURvdHMsXG4gICAgICAgIC4uLnJpZ2h0U2lkZURvdHMsXG4gICAgICAgIC4uLnRvcFNpZGVEb3RzXG4gICAgXTtcbiAgICBjb25zdCBjb250cm9sQnVmZmVyID0gMTA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb3RzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGRvdHNBcnJheVtpXVswXSA9PT0gMClcbiAgICAgICAgICAgIGRvdHNBcnJheVtpXVswXSAtPSBjb250cm9sQnVmZmVyO1xuICAgICAgICBpZiAoZG90c0FycmF5W2ldWzFdID09PSAwKVxuICAgICAgICAgICAgZG90c0FycmF5W2ldWzFdIC09IGNvbnRyb2xCdWZmZXI7XG4gICAgICAgIGlmIChkb3RzQXJyYXlbaV1bMF0gPT09IHdpZHRoKVxuICAgICAgICAgICAgZG90c0FycmF5W2ldWzBdICs9IGNvbnRyb2xCdWZmZXI7XG4gICAgICAgIGlmIChkb3RzQXJyYXlbaV1bMV0gPT09IGhlaWdodClcbiAgICAgICAgICAgIGRvdHNBcnJheVtpXVsxXSArPSBjb250cm9sQnVmZmVyO1xuICAgIH1cbiAgICByZXR1cm4gZG90c0FycmF5O1xufTtcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBvaW50c0FycmF5O1xuIiwiY29uc3QgZ2V0UmF0aW9TaXplID0gKHNyY1dpZHRoLCBzcmNIZWlnaHQsIG1heFdpZHRoLCBtYXhIZWlnaHQpID0+IHtcbiAgICB2YXIgcmF0aW8gPSBNYXRoLm1pbihtYXhXaWR0aCAvIHNyY1dpZHRoLCBtYXhIZWlnaHQgLyBzcmNIZWlnaHQpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKHNyY1dpZHRoICogcmF0aW8pLFxuICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoc3JjSGVpZ2h0ICogcmF0aW8pXG4gICAgfTtcbn07XG5leHBvcnQgZGVmYXVsdCBnZXRSYXRpb1NpemU7XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIGNyZWF0ZVBvaW50c0FycmF5IH0gZnJvbSBcIi4vY3JlYXRlUG9pbnRzQXJyYXlcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0UmF0aW9TaXplIH0gZnJvbSBcIi4vZ2V0UmF0aW9TaXplXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxvZyB9IGZyb20gXCIuL2xvZ1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB3YXJwSXQgfSBmcm9tIFwiLi93YXJwSXRcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgd2FycFJlcG9zaXRpb24gfSBmcm9tIFwiLi93YXJwUmVwb3NpdGlvblwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1cGRhdGVDb250cm9sUGF0aCB9IGZyb20gXCIuL3VwZGF0ZUNvbnRyb2xQYXRoXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNlbmRQYXRocyB9IGZyb20gXCIuL3NlbmRQYXRoc1wiO1xuIiwibGV0IGxvZ1N0eWxlcyA9IFwiYm9yZGVyLXJhZGl1czogNHB4OyBwYWRkaW5nOiAycHggNHB4O1wiO1xubGV0IGxvZ1RpbWUgPSA4MDA7XG5jb25zdCBsb2cgPSB7XG4gICAgc3VjY2VzczogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDAsIDI1NSwgMTM2LCAwLjE0KTske2xvZ1N0eWxlc31gKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgZmlnbWEubm90aWZ5KGDwn46JICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgY2hlY2s6ICh0ZXh0LCBzaG93ID0gdHJ1ZSkgPT4ge1xuICAgICAgICBzaG93XG4gICAgICAgICAgICA/IGNvbnNvbGUubG9nKGAlYyR7dGV4dH1gLCBgYmFja2dyb3VuZDogcmdiYSgwLCAyMDQsIDI1NSwgMC4xNCk7JHtsb2dTdHlsZXN9YClcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgIGZpZ21hLm5vdGlmeShg4pyFICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbmV1dHJhbDogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuMTQpOyR7bG9nU3R5bGVzfWApXG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICBmaWdtYS5ub3RpZnkoYCR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgd2FybjogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMTIzLCAwLCAwLjE0KTske2xvZ1N0eWxlc31gKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgZmlnbWEubm90aWZ5KGDimKLvuI8gJHt0ZXh0fWAsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IGxvZ1RpbWVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBlcnJvcjogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwwLDAsMC4xNCk7JHtsb2dTdHlsZXN9YClcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgIGZpZ21hLm5vdGlmeShg4puU77iPICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBsb2c7XG4iLCJjb25zdCBzZW5kUGF0aHMgPSBzdmdEb20gPT4ge1xuICAgIGxldCBzID0gbmV3IFhNTFNlcmlhbGl6ZXIoKTtcbiAgICBsZXQgU1ZHc3RyID0gcy5zZXJpYWxpemVUb1N0cmluZyhzdmdEb20pO1xuICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHBsdWdpbk1lc3NhZ2U6IHtcbiAgICAgICAgICAgIHR5cGU6IFwid2FycGVkLXN2Z1wiLFxuICAgICAgICAgICAgZGF0YTogU1ZHc3RyXG4gICAgICAgIH1cbiAgICB9LCBcIipcIik7XG59O1xuZXhwb3J0IGRlZmF1bHQgc2VuZFBhdGhzO1xuIiwiY29uc3QgdXBkYXRlQ29udHJvbFBhdGggPSAocGF0aCwgcG9pbnRzKSA9PiB7XG4gICAgbGV0IGQgPSBbYE0ke3BvaW50c1swXVswXX0gJHtwb2ludHNbMF1bMV19YF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZC5wdXNoKGBMJHtwb2ludHNbaV1bMF19ICR7cG9pbnRzW2ldWzFdfWApO1xuICAgIH1cbiAgICBkLnB1c2goXCJaXCIpO1xuICAgIHBhdGguY3VycmVudC5zZXRBdHRyaWJ1dGUoXCJkXCIsIGQuam9pbihcIlwiKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgdXBkYXRlQ29udHJvbFBhdGg7XG4iLCJjb25zdCB3YXJwSXQgPSAod2FycCwgcG9pbnRzKSA9PiB7XG4gICAgd2FycC50cmFuc2Zvcm0oZnVuY3Rpb24gKHYwLCBWID0gcG9pbnRzKSB7XG4gICAgICAgIGNvbnN0IEEgPSBbXTtcbiAgICAgICAgY29uc3QgVyA9IFtdO1xuICAgICAgICBjb25zdCBMID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgVi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaiA9IChpICsgMSkgJSBWLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IHZpID0gVltpXTtcbiAgICAgICAgICAgIGNvbnN0IHZqID0gVltqXTtcbiAgICAgICAgICAgIGNvbnN0IHIwaSA9IE1hdGguc3FydCgodjBbMF0gLSB2aVswXSkgKiogMiArICh2MFsxXSAtIHZpWzFdKSAqKiAyKTtcbiAgICAgICAgICAgIGNvbnN0IHIwaiA9IE1hdGguc3FydCgodjBbMF0gLSB2alswXSkgKiogMiArICh2MFsxXSAtIHZqWzFdKSAqKiAyKTtcbiAgICAgICAgICAgIGNvbnN0IHJpaiA9IE1hdGguc3FydCgodmlbMF0gLSB2alswXSkgKiogMiArICh2aVsxXSAtIHZqWzFdKSAqKiAyKTtcbiAgICAgICAgICAgIGNvbnN0IGRuID0gMiAqIHIwaSAqIHIwajtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAocjBpICoqIDIgKyByMGogKiogMiAtIHJpaiAqKiAyKSAvIGRuO1xuICAgICAgICAgICAgQVtpXSA9IGlzTmFOKHIpID8gMCA6IE1hdGguYWNvcyhNYXRoLm1heCgtMSwgTWF0aC5taW4ociwgMSkpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFYubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSAoaiA+IDAgPyBqIDogVi5sZW5ndGgpIC0gMTtcbiAgICAgICAgICAgIGNvbnN0IHZqID0gVltqXTtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBNYXRoLnNxcnQoKHZqWzBdIC0gdjBbMF0pICoqIDIgKyAodmpbMV0gLSB2MFsxXSkgKiogMik7XG4gICAgICAgICAgICBXW2pdID0gKE1hdGgudGFuKEFbaV0gLyAyKSArIE1hdGgudGFuKEFbal0gLyAyKSkgLyByO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFdzID0gVy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBWLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBMW2ldID0gV1tpXSAvIFdzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbLi4udjAsIC4uLkxdO1xuICAgIH0pO1xufTtcbmV4cG9ydCBkZWZhdWx0IHdhcnBJdDtcbiIsImNvbnN0IHdhcnBSZXBvc2l0aW9uID0gKHdhcnAsIHBvaW50cykgPT4ge1xuICAgIGNvbnN0IHJlcG9zaXRpb24gPSAoWywgLCAuLi5XXSwgViA9IHBvaW50cykgPT4ge1xuICAgICAgICBsZXQgbnggPSAwO1xuICAgICAgICBsZXQgbnkgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG54ICs9IFdbaV0gKiBWW2ldWzBdO1xuICAgICAgICAgICAgbnkgKz0gV1tpXSAqIFZbaV1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtueCwgbnksIC4uLlddO1xuICAgIH07XG4gICAgd2FycC50cmFuc2Zvcm0ocmVwb3NpdGlvbik7XG59O1xuZXhwb3J0IGRlZmF1bHQgd2FycFJlcG9zaXRpb247XG4iXSwic291cmNlUm9vdCI6IiJ9