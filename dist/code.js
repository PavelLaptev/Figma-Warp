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
    if (msg.type === "complexity") {
        console.clear();
        init();
        _utils__WEBPACK_IMPORTED_MODULE_0__["log"].check(`Complexity: ${msg.data}`);
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
    const controlBuffer = 5;
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
/*! exports provided: createPointsArray, getRatioSize, log, warpIt, warpReposition, updateControlPath */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9jcmVhdGVQb2ludHNBcnJheS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2dldFJhdGlvU2l6ZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2luZGV4LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvbG9nLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvdXBkYXRlQ29udHJvbFBhdGgudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy93YXJwSXQudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy93YXJwUmVwb3NpdGlvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtB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dC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzXCIpO1xuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDU4MCwgaGVpZ2h0OiA0ODAgfSk7XG5jb25zdCBnZXRTVkcgPSBhc3luYyAobm9kZSkgPT4ge1xuICAgIGxldCBzdmcgPSBhd2FpdCBub2RlLmV4cG9ydEFzeW5jKHtcbiAgICAgICAgZm9ybWF0OiBcIlNWR1wiLFxuICAgICAgICBzdmdPdXRsaW5lVGV4dDogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHN2Zyk7XG59O1xuY29uc3QgaW5pdCA9IGFzeW5jICgpID0+IHtcbiAgICBsZXQgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBpZiAobm9kZSAmJiBub2RlLnR5cGUgPT09IFwiVkVDVE9SXCIpIHtcbiAgICAgICAgbG9nLmNoZWNrKFwiU2hhcGUgc2VsZWN0ZWRcIik7XG4gICAgICAgIGxldCBub2RlID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcInN2Zy1mcm9tLWZpZ21hXCIsXG4gICAgICAgICAgICBkYXRhOiBhd2FpdCBnZXRTVkcobm9kZSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUgJiYgbm9kZS50eXBlICE9PSBcIlZFQ1RPUlwiKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwic3ZnLWZyb20tZmlnbWFcIixcbiAgICAgICAgICAgIGV2ZW50OiBcImVycm9yXCJcbiAgICAgICAgfSk7XG4gICAgICAgIGxvZy53YXJuKFwiY29udmVydCBlbGVtZW50IHRvIHZlY3RvciB0eXBlXCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogXCJzdmctZnJvbS1maWdtYVwiLFxuICAgICAgICAgICAgZXZlbnQ6IFwiZXJyb3JcIlxuICAgICAgICB9KTtcbiAgICAgICAgbG9nLmVycm9yKFwiU2VsZWN0IHNvbWUgdmVjdG9yIHNoYXBlXCIpO1xuICAgIH1cbn07XG5pbml0KCk7XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7XG4gICAgY29uc29sZS5jbGVhcigpO1xuICAgIGNvbnNvbGUubG9nKFwiY2xlYXJlZCBieSBuZXcgc2VjdGlvblwiKTtcbiAgICBpbml0KCk7XG59KTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGFzeW5jIChtc2cpID0+IHtcbiAgICBpZiAobXNnLnR5cGUgPT09IFwiY29tcGxleGl0eVwiKSB7XG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgICBsb2cuY2hlY2soYENvbXBsZXhpdHk6ICR7bXNnLmRhdGF9YCk7XG4gICAgfVxufTtcbiIsImNvbnN0IGNyZWF0ZVBvaW50c0FycmF5ID0gKHdpZHRoLCBoZWlnaHQsIGFtb3VudCkgPT4ge1xuICAgIGNvbnN0IGdldERvdERpc3RhbmNlID0gKGxlbmd0aCwgaW5kZXgpID0+IChsZW5ndGggLyBhbW91bnQpICogaW5kZXg7XG4gICAgY29uc3QgYW1vdW50QXJyYXkgPSBbLi4uQXJyYXkoYW1vdW50KS5rZXlzKCldO1xuICAgIGxldCBsZWZ0U2lkZURvdHMgPSBhbW91bnRBcnJheS5tYXAoKF8sIGkpID0+IFswLCBnZXREb3REaXN0YW5jZShoZWlnaHQsIGkpXSk7XG4gICAgbGV0IGJvdHRvbVNpZGVEb3RzID0gYW1vdW50QXJyYXkubWFwKChfLCBpKSA9PiBbXG4gICAgICAgIGdldERvdERpc3RhbmNlKHdpZHRoLCBpKSxcbiAgICAgICAgaGVpZ2h0XG4gICAgXSk7XG4gICAgbGV0IHJpZ2h0U2lkZURvdHMgPSBhbW91bnRBcnJheVxuICAgICAgICAubWFwKChfLCBpKSA9PiBbd2lkdGgsIGdldERvdERpc3RhbmNlKGhlaWdodCwgKytpKV0pXG4gICAgICAgIC5yZXZlcnNlKCk7XG4gICAgbGV0IHRvcFNpZGVEb3RzID0gYW1vdW50QXJyYXlcbiAgICAgICAgLm1hcCgoXywgaSkgPT4gW2dldERvdERpc3RhbmNlKHdpZHRoLCArK2kpLCAwXSlcbiAgICAgICAgLnJldmVyc2UoKTtcbiAgICBsZXQgZG90c0FycmF5ID0gW1xuICAgICAgICAuLi5sZWZ0U2lkZURvdHMsXG4gICAgICAgIC4uLmJvdHRvbVNpZGVEb3RzLFxuICAgICAgICAuLi5yaWdodFNpZGVEb3RzLFxuICAgICAgICAuLi50b3BTaWRlRG90c1xuICAgIF07XG4gICAgY29uc3QgY29udHJvbEJ1ZmZlciA9IDU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb3RzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGRvdHNBcnJheVtpXVswXSA9PT0gMClcbiAgICAgICAgICAgIGRvdHNBcnJheVtpXVswXSAtPSBjb250cm9sQnVmZmVyO1xuICAgICAgICBpZiAoZG90c0FycmF5W2ldWzFdID09PSAwKVxuICAgICAgICAgICAgZG90c0FycmF5W2ldWzFdIC09IGNvbnRyb2xCdWZmZXI7XG4gICAgICAgIGlmIChkb3RzQXJyYXlbaV1bMF0gPT09IHdpZHRoKVxuICAgICAgICAgICAgZG90c0FycmF5W2ldWzBdICs9IGNvbnRyb2xCdWZmZXI7XG4gICAgICAgIGlmIChkb3RzQXJyYXlbaV1bMV0gPT09IGhlaWdodClcbiAgICAgICAgICAgIGRvdHNBcnJheVtpXVsxXSArPSBjb250cm9sQnVmZmVyO1xuICAgIH1cbiAgICByZXR1cm4gZG90c0FycmF5O1xufTtcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBvaW50c0FycmF5O1xuIiwiY29uc3QgZ2V0UmF0aW9TaXplID0gKHNyY1dpZHRoLCBzcmNIZWlnaHQsIG1heFdpZHRoLCBtYXhIZWlnaHQpID0+IHtcbiAgICB2YXIgcmF0aW8gPSBNYXRoLm1pbihtYXhXaWR0aCAvIHNyY1dpZHRoLCBtYXhIZWlnaHQgLyBzcmNIZWlnaHQpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKHNyY1dpZHRoICogcmF0aW8pLFxuICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoc3JjSGVpZ2h0ICogcmF0aW8pXG4gICAgfTtcbn07XG5leHBvcnQgZGVmYXVsdCBnZXRSYXRpb1NpemU7XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIGNyZWF0ZVBvaW50c0FycmF5IH0gZnJvbSBcIi4vY3JlYXRlUG9pbnRzQXJyYXlcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0UmF0aW9TaXplIH0gZnJvbSBcIi4vZ2V0UmF0aW9TaXplXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxvZyB9IGZyb20gXCIuL2xvZ1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB3YXJwSXQgfSBmcm9tIFwiLi93YXJwSXRcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgd2FycFJlcG9zaXRpb24gfSBmcm9tIFwiLi93YXJwUmVwb3NpdGlvblwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1cGRhdGVDb250cm9sUGF0aCB9IGZyb20gXCIuL3VwZGF0ZUNvbnRyb2xQYXRoXCI7XG4iLCJsZXQgbG9nU3R5bGVzID0gXCJib3JkZXItcmFkaXVzOiA0cHg7IHBhZGRpbmc6IDJweCA0cHg7XCI7XG5sZXQgbG9nVGltZSA9IDgwMDtcbmNvbnN0IGxvZyA9IHtcbiAgICBzdWNjZXNzOiAodGV4dCwgc2hvdyA9IHRydWUpID0+IHtcbiAgICAgICAgc2hvd1xuICAgICAgICAgICAgPyBjb25zb2xlLmxvZyhgJWMke3RleHR9YCwgYGJhY2tncm91bmQ6IHJnYmEoMCwgMjU1LCAxMzYsIDAuMTQpOyR7bG9nU3R5bGVzfWApXG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICBmaWdtYS5ub3RpZnkoYPCfjokgJHt0ZXh0fWAsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IGxvZ1RpbWVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBjaGVjazogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDAsIDIwNCwgMjU1LCAwLjE0KTske2xvZ1N0eWxlc31gKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgZmlnbWEubm90aWZ5KGDinIUgJHt0ZXh0fWAsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IGxvZ1RpbWVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBuZXV0cmFsOiAodGV4dCwgc2hvdyA9IHRydWUpID0+IHtcbiAgICAgICAgc2hvd1xuICAgICAgICAgICAgPyBjb25zb2xlLmxvZyhgJWMke3RleHR9YCwgYGJhY2tncm91bmQ6IHJnYmEoMTI4LCAxMjgsIDEyOCwgMC4xNCk7JHtsb2dTdHlsZXN9YClcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgIGZpZ21hLm5vdGlmeShgJHt0ZXh0fWAsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IGxvZ1RpbWVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB3YXJuOiAodGV4dCwgc2hvdyA9IHRydWUpID0+IHtcbiAgICAgICAgc2hvd1xuICAgICAgICAgICAgPyBjb25zb2xlLmxvZyhgJWMke3RleHR9YCwgYGJhY2tncm91bmQ6IHJnYmEoMjU1LCAxMjMsIDAsIDAuMTQpOyR7bG9nU3R5bGVzfWApXG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICBmaWdtYS5ub3RpZnkoYOKYou+4jyAke3RleHR9YCwge1xuICAgICAgICAgICAgdGltZW91dDogbG9nVGltZVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGVycm9yOiAodGV4dCwgc2hvdyA9IHRydWUpID0+IHtcbiAgICAgICAgc2hvd1xuICAgICAgICAgICAgPyBjb25zb2xlLmxvZyhgJWMke3RleHR9YCwgYGJhY2tncm91bmQ6IHJnYmEoMjU1LDAsMCwwLjE0KTske2xvZ1N0eWxlc31gKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgZmlnbWEubm90aWZ5KGDim5TvuI8gJHt0ZXh0fWAsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IGxvZ1RpbWVcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IGxvZztcbiIsImNvbnN0IHVwZGF0ZUNvbnRyb2xQYXRoID0gKHBhdGgsIHBvaW50cykgPT4ge1xuICAgIGxldCBkID0gW2BNJHtwb2ludHNbMF1bMF19ICR7cG9pbnRzWzBdWzFdfWBdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGQucHVzaChgTCR7cG9pbnRzW2ldWzBdfSAke3BvaW50c1tpXVsxXX1gKTtcbiAgICB9XG4gICAgZC5wdXNoKFwiWlwiKTtcbiAgICBwYXRoLmN1cnJlbnQuc2V0QXR0cmlidXRlKFwiZFwiLCBkLmpvaW4oXCJcIikpO1xufTtcbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZUNvbnRyb2xQYXRoO1xuIiwiY29uc3Qgd2FycEl0ID0gKHdhcnAsIHBvaW50cykgPT4ge1xuICAgIHdhcnAudHJhbnNmb3JtKGZ1bmN0aW9uICh2MCwgViA9IHBvaW50cykge1xuICAgICAgICBjb25zdCBBID0gW107XG4gICAgICAgIGNvbnN0IFcgPSBbXTtcbiAgICAgICAgY29uc3QgTCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSAoaSArIDEpICUgVi5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCB2aSA9IFZbaV07XG4gICAgICAgICAgICBjb25zdCB2aiA9IFZbal07XG4gICAgICAgICAgICBjb25zdCByMGkgPSBNYXRoLnNxcnQoKHYwWzBdIC0gdmlbMF0pICoqIDIgKyAodjBbMV0gLSB2aVsxXSkgKiogMik7XG4gICAgICAgICAgICBjb25zdCByMGogPSBNYXRoLnNxcnQoKHYwWzBdIC0gdmpbMF0pICoqIDIgKyAodjBbMV0gLSB2alsxXSkgKiogMik7XG4gICAgICAgICAgICBjb25zdCByaWogPSBNYXRoLnNxcnQoKHZpWzBdIC0gdmpbMF0pICoqIDIgKyAodmlbMV0gLSB2alsxXSkgKiogMik7XG4gICAgICAgICAgICBjb25zdCBkbiA9IDIgKiByMGkgKiByMGo7XG4gICAgICAgICAgICBjb25zdCByID0gKHIwaSAqKiAyICsgcjBqICoqIDIgLSByaWogKiogMikgLyBkbjtcbiAgICAgICAgICAgIEFbaV0gPSBpc05hTihyKSA/IDAgOiBNYXRoLmFjb3MoTWF0aC5tYXgoLTEsIE1hdGgubWluKHIsIDEpKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBWLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gKGogPiAwID8gaiA6IFYubGVuZ3RoKSAtIDE7XG4gICAgICAgICAgICBjb25zdCB2aiA9IFZbal07XG4gICAgICAgICAgICBjb25zdCByID0gTWF0aC5zcXJ0KCh2alswXSAtIHYwWzBdKSAqKiAyICsgKHZqWzFdIC0gdjBbMV0pICoqIDIpO1xuICAgICAgICAgICAgV1tqXSA9IChNYXRoLnRhbihBW2ldIC8gMikgKyBNYXRoLnRhbihBW2pdIC8gMikpIC8gcjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBXcyA9IFcucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgVi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgTFtpXSA9IFdbaV0gLyBXcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWy4uLnYwLCAuLi5MXTtcbiAgICB9KTtcbn07XG5leHBvcnQgZGVmYXVsdCB3YXJwSXQ7XG4iLCJjb25zdCB3YXJwUmVwb3NpdGlvbiA9ICh3YXJwLCBwb2ludHMpID0+IHtcbiAgICBjb25zdCByZXBvc2l0aW9uID0gKFssICwgLi4uV10sIFYgPSBwb2ludHMpID0+IHtcbiAgICAgICAgbGV0IG54ID0gMDtcbiAgICAgICAgbGV0IG55ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBWLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBueCArPSBXW2ldICogVltpXVswXTtcbiAgICAgICAgICAgIG55ICs9IFdbaV0gKiBWW2ldWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbngsIG55LCAuLi5XXTtcbiAgICB9O1xuICAgIHdhcnAudHJhbnNmb3JtKHJlcG9zaXRpb24pO1xufTtcbmV4cG9ydCBkZWZhdWx0IHdhcnBSZXBvc2l0aW9uO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==