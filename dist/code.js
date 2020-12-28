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
        _utils__WEBPACK_IMPORTED_MODULE_0__["log"].warn("convert element to vector type");
    }
    else {
        _utils__WEBPACK_IMPORTED_MODULE_0__["log"].error("Select some vector shape");
    }
};
init();
figma.on("selectionchange", () => {
    console.clear();
    console.log("cleared by new section");
    init();
});
figma.ui.onmessage = msg => {
    if (msg.type === "complexity") {
        console.clear();
        console.log("cleared by msg");
        init();
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
let logTime = 1000;
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
    const reposition = ([x, y, ...W], V = points) => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9jcmVhdGVQb2ludHNBcnJheS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2dldFJhdGlvU2l6ZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2luZGV4LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvbG9nLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvdXBkYXRlQ29udHJvbFBhdGgudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy93YXJwSXQudHN4Iiwid2VicGFjazovLy8uL3NyYy91dGlscy93YXJwUmVwb3NpdGlvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQStCO0FBQy9CLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsMENBQUc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSwwQ0FBRztBQUNYO0FBQ0E7QUFDQSxRQUFRLDBDQUFHO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0JBQXNCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxnRkFBaUIsRUFBQzs7Ozs7Ozs7Ozs7OztBQ2pDakM7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLDJFQUFZLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNQNUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBbUU7QUFDVjtBQUNsQjtBQUNNO0FBQ2dCO0FBQ007Ozs7Ozs7Ozs7Ozs7QUNMbkU7QUFBQSxvQ0FBb0Msa0JBQWtCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLEtBQUssd0NBQXdDLEVBQUUsVUFBVTtBQUN4RjtBQUNBLDJCQUEyQixLQUFLO0FBQ2hDO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsK0JBQStCLEtBQUssd0NBQXdDLEVBQUUsVUFBVTtBQUN4RjtBQUNBLDBCQUEwQixLQUFLO0FBQy9CO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsK0JBQStCLEtBQUssMENBQTBDLEVBQUUsVUFBVTtBQUMxRjtBQUNBLHdCQUF3QixLQUFLO0FBQzdCO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsK0JBQStCLEtBQUssd0NBQXdDLEVBQUUsVUFBVTtBQUN4RjtBQUNBLDJCQUEyQixLQUFLO0FBQ2hDO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsK0JBQStCLEtBQUssbUNBQW1DLEVBQUUsVUFBVTtBQUNuRjtBQUNBLDJCQUEyQixLQUFLO0FBQ2hDO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDZSxrRUFBRyxFQUFDOzs7Ozs7Ozs7Ozs7O0FDNUNuQjtBQUFBO0FBQ0EsaUJBQWlCLGFBQWEsR0FBRyxhQUFhO0FBQzlDLG1CQUFtQixtQkFBbUI7QUFDdEMsbUJBQW1CLGFBQWEsR0FBRyxhQUFhO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsZ0ZBQWlCLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNSakM7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGNBQWM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDZSxxRUFBTSxFQUFDOzs7Ozs7Ozs7Ozs7O0FDN0J0QjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGNBQWM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSw2RUFBYyxFQUFDIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vY29udHJvbGxlci50c1wiKTtcbiIsImltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi91dGlsc1wiO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA1ODAsIGhlaWdodDogNDgwIH0pO1xuY29uc3QgZ2V0U1ZHID0gYXN5bmMgKG5vZGUpID0+IHtcbiAgICBsZXQgc3ZnID0gYXdhaXQgbm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgIGZvcm1hdDogXCJTVkdcIixcbiAgICAgICAgc3ZnT3V0bGluZVRleHQ6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBzdmcpO1xufTtcbmNvbnN0IGluaXQgPSBhc3luYyAoKSA9PiB7XG4gICAgbGV0IG5vZGUgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgaWYgKG5vZGUgJiYgbm9kZS50eXBlID09PSBcIlZFQ1RPUlwiKSB7XG4gICAgICAgIGxvZy5jaGVjayhcIlNoYXBlIHNlbGVjdGVkXCIpO1xuICAgICAgICBsZXQgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogXCJzdmctZnJvbS1maWdtYVwiLFxuICAgICAgICAgICAgZGF0YTogYXdhaXQgZ2V0U1ZHKG5vZGUpXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmIChub2RlICYmIG5vZGUudHlwZSAhPT0gXCJWRUNUT1JcIikge1xuICAgICAgICBsb2cud2FybihcImNvbnZlcnQgZWxlbWVudCB0byB2ZWN0b3IgdHlwZVwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxvZy5lcnJvcihcIlNlbGVjdCBzb21lIHZlY3RvciBzaGFwZVwiKTtcbiAgICB9XG59O1xuaW5pdCgpO1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4ge1xuICAgIGNvbnNvbGUuY2xlYXIoKTtcbiAgICBjb25zb2xlLmxvZyhcImNsZWFyZWQgYnkgbmV3IHNlY3Rpb25cIik7XG4gICAgaW5pdCgpO1xufSk7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjb21wbGV4aXR5XCIpIHtcbiAgICAgICAgY29uc29sZS5jbGVhcigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImNsZWFyZWQgYnkgbXNnXCIpO1xuICAgICAgICBpbml0KCk7XG4gICAgfVxufTtcbiIsImNvbnN0IGNyZWF0ZVBvaW50c0FycmF5ID0gKHdpZHRoLCBoZWlnaHQsIGFtb3VudCkgPT4ge1xuICAgIGNvbnN0IGdldERvdERpc3RhbmNlID0gKGxlbmd0aCwgaW5kZXgpID0+IChsZW5ndGggLyBhbW91bnQpICogaW5kZXg7XG4gICAgY29uc3QgYW1vdW50QXJyYXkgPSBbLi4uQXJyYXkoYW1vdW50KS5rZXlzKCldO1xuICAgIGxldCBsZWZ0U2lkZURvdHMgPSBhbW91bnRBcnJheS5tYXAoKF8sIGkpID0+IFswLCBnZXREb3REaXN0YW5jZShoZWlnaHQsIGkpXSk7XG4gICAgbGV0IGJvdHRvbVNpZGVEb3RzID0gYW1vdW50QXJyYXkubWFwKChfLCBpKSA9PiBbXG4gICAgICAgIGdldERvdERpc3RhbmNlKHdpZHRoLCBpKSxcbiAgICAgICAgaGVpZ2h0XG4gICAgXSk7XG4gICAgbGV0IHJpZ2h0U2lkZURvdHMgPSBhbW91bnRBcnJheVxuICAgICAgICAubWFwKChfLCBpKSA9PiBbd2lkdGgsIGdldERvdERpc3RhbmNlKGhlaWdodCwgKytpKV0pXG4gICAgICAgIC5yZXZlcnNlKCk7XG4gICAgbGV0IHRvcFNpZGVEb3RzID0gYW1vdW50QXJyYXlcbiAgICAgICAgLm1hcCgoXywgaSkgPT4gW2dldERvdERpc3RhbmNlKHdpZHRoLCArK2kpLCAwXSlcbiAgICAgICAgLnJldmVyc2UoKTtcbiAgICBsZXQgZG90c0FycmF5ID0gW1xuICAgICAgICAuLi5sZWZ0U2lkZURvdHMsXG4gICAgICAgIC4uLmJvdHRvbVNpZGVEb3RzLFxuICAgICAgICAuLi5yaWdodFNpZGVEb3RzLFxuICAgICAgICAuLi50b3BTaWRlRG90c1xuICAgIF07XG4gICAgY29uc3QgY29udHJvbEJ1ZmZlciA9IDU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb3RzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGRvdHNBcnJheVtpXVswXSA9PT0gMClcbiAgICAgICAgICAgIGRvdHNBcnJheVtpXVswXSAtPSBjb250cm9sQnVmZmVyO1xuICAgICAgICBpZiAoZG90c0FycmF5W2ldWzFdID09PSAwKVxuICAgICAgICAgICAgZG90c0FycmF5W2ldWzFdIC09IGNvbnRyb2xCdWZmZXI7XG4gICAgICAgIGlmIChkb3RzQXJyYXlbaV1bMF0gPT09IHdpZHRoKVxuICAgICAgICAgICAgZG90c0FycmF5W2ldWzBdICs9IGNvbnRyb2xCdWZmZXI7XG4gICAgICAgIGlmIChkb3RzQXJyYXlbaV1bMV0gPT09IGhlaWdodClcbiAgICAgICAgICAgIGRvdHNBcnJheVtpXVsxXSArPSBjb250cm9sQnVmZmVyO1xuICAgIH1cbiAgICByZXR1cm4gZG90c0FycmF5O1xufTtcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVBvaW50c0FycmF5O1xuIiwiY29uc3QgZ2V0UmF0aW9TaXplID0gKHNyY1dpZHRoLCBzcmNIZWlnaHQsIG1heFdpZHRoLCBtYXhIZWlnaHQpID0+IHtcbiAgICB2YXIgcmF0aW8gPSBNYXRoLm1pbihtYXhXaWR0aCAvIHNyY1dpZHRoLCBtYXhIZWlnaHQgLyBzcmNIZWlnaHQpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKHNyY1dpZHRoICogcmF0aW8pLFxuICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoc3JjSGVpZ2h0ICogcmF0aW8pXG4gICAgfTtcbn07XG5leHBvcnQgZGVmYXVsdCBnZXRSYXRpb1NpemU7XG4iLCJleHBvcnQgeyBkZWZhdWx0IGFzIGNyZWF0ZVBvaW50c0FycmF5IH0gZnJvbSBcIi4vY3JlYXRlUG9pbnRzQXJyYXlcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgZ2V0UmF0aW9TaXplIH0gZnJvbSBcIi4vZ2V0UmF0aW9TaXplXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGxvZyB9IGZyb20gXCIuL2xvZ1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB3YXJwSXQgfSBmcm9tIFwiLi93YXJwSXRcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgd2FycFJlcG9zaXRpb24gfSBmcm9tIFwiLi93YXJwUmVwb3NpdGlvblwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1cGRhdGVDb250cm9sUGF0aCB9IGZyb20gXCIuL3VwZGF0ZUNvbnRyb2xQYXRoXCI7XG4iLCJsZXQgbG9nU3R5bGVzID0gXCJib3JkZXItcmFkaXVzOiA0cHg7IHBhZGRpbmc6IDJweCA0cHg7XCI7XG5sZXQgbG9nVGltZSA9IDEwMDA7XG5jb25zdCBsb2cgPSB7XG4gICAgc3VjY2VzczogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDAsIDI1NSwgMTM2LCAwLjE0KTske2xvZ1N0eWxlc31gKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgZmlnbWEubm90aWZ5KGDwn46JICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgY2hlY2s6ICh0ZXh0LCBzaG93ID0gdHJ1ZSkgPT4ge1xuICAgICAgICBzaG93XG4gICAgICAgICAgICA/IGNvbnNvbGUubG9nKGAlYyR7dGV4dH1gLCBgYmFja2dyb3VuZDogcmdiYSgwLCAyMDQsIDI1NSwgMC4xNCk7JHtsb2dTdHlsZXN9YClcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgIGZpZ21hLm5vdGlmeShg4pyFICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgbmV1dHJhbDogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuMTQpOyR7bG9nU3R5bGVzfWApXG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICBmaWdtYS5ub3RpZnkoYCR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgd2FybjogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMTIzLCAwLCAwLjE0KTske2xvZ1N0eWxlc31gKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgZmlnbWEubm90aWZ5KGDimKLvuI8gJHt0ZXh0fWAsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IGxvZ1RpbWVcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBlcnJvcjogKHRleHQsIHNob3cgPSB0cnVlKSA9PiB7XG4gICAgICAgIHNob3dcbiAgICAgICAgICAgID8gY29uc29sZS5sb2coYCVjJHt0ZXh0fWAsIGBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwwLDAsMC4xNCk7JHtsb2dTdHlsZXN9YClcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgICAgIGZpZ21hLm5vdGlmeShg4puU77iPICR7dGV4dH1gLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBsb2dUaW1lXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBsb2c7XG4iLCJjb25zdCB1cGRhdGVDb250cm9sUGF0aCA9IChwYXRoLCBwb2ludHMpID0+IHtcbiAgICBsZXQgZCA9IFtgTSR7cG9pbnRzWzBdWzBdfSAke3BvaW50c1swXVsxXX1gXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBkLnB1c2goYEwke3BvaW50c1tpXVswXX0gJHtwb2ludHNbaV1bMV19YCk7XG4gICAgfVxuICAgIGQucHVzaChcIlpcIik7XG4gICAgcGF0aC5jdXJyZW50LnNldEF0dHJpYnV0ZShcImRcIiwgZC5qb2luKFwiXCIpKTtcbn07XG5leHBvcnQgZGVmYXVsdCB1cGRhdGVDb250cm9sUGF0aDtcbiIsImNvbnN0IHdhcnBJdCA9ICh3YXJwLCBwb2ludHMpID0+IHtcbiAgICB3YXJwLnRyYW5zZm9ybShmdW5jdGlvbiAodjAsIFYgPSBwb2ludHMpIHtcbiAgICAgICAgY29uc3QgQSA9IFtdO1xuICAgICAgICBjb25zdCBXID0gW107XG4gICAgICAgIGNvbnN0IEwgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBWLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBqID0gKGkgKyAxKSAlIFYubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgdmkgPSBWW2ldO1xuICAgICAgICAgICAgY29uc3QgdmogPSBWW2pdO1xuICAgICAgICAgICAgY29uc3QgcjBpID0gTWF0aC5zcXJ0KCh2MFswXSAtIHZpWzBdKSAqKiAyICsgKHYwWzFdIC0gdmlbMV0pICoqIDIpO1xuICAgICAgICAgICAgY29uc3QgcjBqID0gTWF0aC5zcXJ0KCh2MFswXSAtIHZqWzBdKSAqKiAyICsgKHYwWzFdIC0gdmpbMV0pICoqIDIpO1xuICAgICAgICAgICAgY29uc3QgcmlqID0gTWF0aC5zcXJ0KCh2aVswXSAtIHZqWzBdKSAqKiAyICsgKHZpWzFdIC0gdmpbMV0pICoqIDIpO1xuICAgICAgICAgICAgY29uc3QgZG4gPSAyICogcjBpICogcjBqO1xuICAgICAgICAgICAgY29uc3QgciA9IChyMGkgKiogMiArIHIwaiAqKiAyIC0gcmlqICoqIDIpIC8gZG47XG4gICAgICAgICAgICBBW2ldID0gaXNOYU4ocikgPyAwIDogTWF0aC5hY29zKE1hdGgubWF4KC0xLCBNYXRoLm1pbihyLCAxKSkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgVi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgaSA9IChqID4gMCA/IGogOiBWLmxlbmd0aCkgLSAxO1xuICAgICAgICAgICAgY29uc3QgdmogPSBWW2pdO1xuICAgICAgICAgICAgY29uc3QgciA9IE1hdGguc3FydCgodmpbMF0gLSB2MFswXSkgKiogMiArICh2alsxXSAtIHYwWzFdKSAqKiAyKTtcbiAgICAgICAgICAgIFdbal0gPSAoTWF0aC50YW4oQVtpXSAvIDIpICsgTWF0aC50YW4oQVtqXSAvIDIpKSAvIHI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgV3MgPSBXLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIExbaV0gPSBXW2ldIC8gV3M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsuLi52MCwgLi4uTF07XG4gICAgfSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgd2FycEl0O1xuIiwiY29uc3Qgd2FycFJlcG9zaXRpb24gPSAod2FycCwgcG9pbnRzKSA9PiB7XG4gICAgY29uc3QgcmVwb3NpdGlvbiA9IChbeCwgeSwgLi4uV10sIFYgPSBwb2ludHMpID0+IHtcbiAgICAgICAgbGV0IG54ID0gMDtcbiAgICAgICAgbGV0IG55ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBWLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBueCArPSBXW2ldICogVltpXVswXTtcbiAgICAgICAgICAgIG55ICs9IFdbaV0gKiBWW2ldWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbngsIG55LCAuLi5XXTtcbiAgICB9O1xuICAgIHdhcnAudHJhbnNmb3JtKHJlcG9zaXRpb24pO1xufTtcbmV4cG9ydCBkZWZhdWx0IHdhcnBSZXBvc2l0aW9uO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==