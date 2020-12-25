"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var React = require("react");
var React__default = _interopDefault(React);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function(d, b) {
        d.__proto__ = b;
      }) ||
    function(d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype =
    b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}

var __assign = function() {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (
        e.indexOf(p[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(s, p[i])
      )
        t[p[i]] = s[p[i]];
    }
  return t;
}

var initialState = {
  wrapperComponent: null,
  contentComponent: null,
  previousScale: 1,
  scale: 1,
  positionX: 0,
  positionY: 0,
  options: {
    disabled: false,
    transformEnabled: true,
    minPositionX: null,
    maxPositionX: null,
    minPositionY: null,
    maxPositionY: null,
    minScale: 1,
    maxScale: 8,
    limitToBounds: true,
    limitToWrapper: false,
    centerContent: true,
    wrapperClass: "",
    contentClass: ""
  },
  wheel: {
    disabled: false,
    step: 5,
    wheelEnabled: true,
    touchPadEnabled: true,
    limitsOnWheel: false
  },
  pan: {
    disabled: false,
    wheelEnabled: false,
    panAnimationType: "linear",
    lockAxisX: false,
    lockAxisY: false,
    velocity: true,
    velocityEqualToMove: true,
    velocitySensitivity: 2,
    velocityActiveScale: 1,
    velocityMinSpeed: 1,
    velocityBaseTime: 1600,
    velocityAnimationType: "easeOutQuart",
    padding: true,
    paddingSize: 30,
    panReturnAnimationTime: 400,
    panReturnAnimationType: "easeOut",
    disableOnTarget: []
  },
  pinch: {
    disabled: false
  },
  zoomIn: {
    disabled: false,
    step: 20,
    animation: true,
    animationType: "easeOut",
    animationTime: 200
  },
  zoomOut: {
    disabled: false,
    step: 20,
    animation: true,
    animationType: "easeOut",
    animationTime: 200
  },
  doubleClick: {
    disabled: false,
    step: 20,
    mode: "zoomIn",
    animation: true,
    animationType: "easeOut",
    animationTime: 200
  },
  reset: {
    disabled: false,
    animation: true,
    animationType: "easeOut",
    animationTime: 200
  },
  scalePadding: {
    disabled: false,
    size: 0.2,
    animationTime: 200,
    animationType: "easeOut"
  }
};

/**
 * Rounds number to given decimal
 * eg. roundNumber(2.34343, 1) => 2.3
 */
var roundNumber = function(num, decimal) {
  return Number(num.toFixed(decimal));
};
/**
 * Checks if value is number, if not it returns default value
 * 1# eg. checkIsNumber(2, 30) => 2
 * 2# eg. checkIsNumber(null, 30) => 30
 */
var checkIsNumber = function(num, defaultValue) {
  return typeof num === "number" ? num : defaultValue;
};
/**
 * Keeps value between given bounds, used for limiting view to given boundaries
 * 1# eg. boundLimiter(2, 0, 3, true) => 2
 * 2# eg. boundLimiter(4, 0, 3, true) => 3
 * 3# eg. boundLimiter(-2, 0, 3, true) => 0
 * 4# eg. boundLimiter(10, 0, 3, false) => 10
 */
var boundLimiter = function(value, minBound, maxBound, isActive) {
  if (!isActive) return roundNumber(value, 2);
  if (value < minBound) return roundNumber(minBound, 2);
  if (value > maxBound) return roundNumber(maxBound, 2);
  return roundNumber(value, 2);
};
/**
 * Calculate bounding area of zoomed/panned element
 */
var calculateBoundingArea = function(
  wrapperWidth,
  newContentWidth,
  diffWidth,
  wrapperHeight,
  newContentHeight,
  diffHeight,
  limitToWrapper
) {
  var scaleWidthFactor =
    wrapperWidth > newContentWidth ? diffWidth * (limitToWrapper ? 1 : 0.5) : 0;
  var scaleHeightFactor =
    wrapperHeight > newContentHeight
      ? diffHeight * (limitToWrapper ? 1 : 0.5)
      : 0;
  var minPositionX = wrapperWidth - newContentWidth - scaleWidthFactor;
  var maxPositionX = scaleWidthFactor;
  var minPositionY = wrapperHeight - newContentHeight - scaleHeightFactor;
  var maxPositionY = scaleHeightFactor;
  return {
    minPositionX: minPositionX,
    maxPositionX: maxPositionX,
    minPositionY: minPositionY,
    maxPositionY: maxPositionY
  };
};
/**
 * Returns distance between two points x,y
 */
var getDistance = function(firstPoint, secondPoint) {
  return Math.sqrt(
    Math.pow(firstPoint.pageX - secondPoint.pageX, 2) +
      Math.pow(firstPoint.pageY - secondPoint.pageY, 2)
  );
};
/**
 * Delete undefined values from object keys
 * Used for deleting empty props
 */
var deleteUndefinedProps = function(value) {
  var newObject = __assign({}, value);
  Object.keys(newObject).forEach(function(key) {
    return newObject[key] === undefined && delete newObject[key];
  });
  return newObject;
};
/**
 * Fire callback if it's function
 */
var handleCallback = function(callback, props) {
  if (callback && typeof callback === "function") {
    callback(props);
  }
};
var handleWheelStop = function(previousEvent, event, stateProvider) {
  var scale = stateProvider.scale,
    _a = stateProvider.options,
    maxScale = _a.maxScale,
    minScale = _a.minScale;
  if (!previousEvent) return false;
  if (scale < maxScale || scale > minScale) return true;
  if (Math.sign(previousEvent.deltaY) !== Math.sign(event.deltaY)) return true;
  if (previousEvent.deltaY > 0 && previousEvent.deltaY < event.deltaY)
    return true;
  if (previousEvent.deltaY < 0 && previousEvent.deltaY > event.deltaY)
    return true;
  if (Math.sign(previousEvent.deltaY) !== Math.sign(event.deltaY)) return true;
  return false;
};
var mergeProps = function(initialState, dynamicProps) {
  return Object.keys(initialState).reduce(function(acc, curr) {
    if (typeof dynamicProps[curr] === "object" && dynamicProps[curr] !== null) {
      acc[curr] = __assign(
        __assign({}, initialState[curr]),
        dynamicProps[curr]
      );
    } else {
      acc[curr] =
        dynamicProps[curr] === undefined
          ? initialState[curr]
          : dynamicProps[curr];
    }
    return acc;
  }, {});
};
function getWindowScaleY(wrapper) {
  if (!wrapper) return 0;
  return window.innerHeight / wrapper.offsetHeight;
}
function getWindowScaleX(wrapper) {
  if (!wrapper) return 0;
  return window.innerWidth / wrapper.offsetWidth;
}

/**
 * Functions should return denominator of the target value, which is the next animation step.
 * t is a value from 0 to 1, reflecting the percentage of animation status.
 */
var easeOut = function(t) {
  return -Math.cos(t * Math.PI) / 2 + 0.5;
};
// linear
var linear = function(t) {
  return t;
};
// accelerating from zero velocity
var easeInQuad = function(t) {
  return t * t;
};
// decelerating to zero velocity
var easeOutQuad = function(t) {
  return t * (2 - t);
};
// acceleration until halfway, then deceleration
var easeInOutQuad = function(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};
// accelerating from zero velocity
var easeInCubic = function(t) {
  return t * t * t;
};
// decelerating to zero velocity
var easeOutCubic = function(t) {
  return --t * t * t + 1;
};
// acceleration until halfway, then deceleration
var easeInOutCubic = function(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};
// accelerating from zero velocity
var easeInQuart = function(t) {
  return t * t * t * t;
};
// decelerating to zero velocity
var easeOutQuart = function(t) {
  return 1 - --t * t * t * t;
};
// acceleration until halfway, then deceleration
var easeInOutQuart = function(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
};
// accelerating from zero velocity
var easeInQuint = function(t) {
  return t * t * t * t * t;
};
// decelerating to zero velocity
var easeOutQuint = function(t) {
  return 1 + --t * t * t * t * t;
};
// acceleration until halfway, then deceleration
var easeInOutQuint = function(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
};
var availableAnimations = {
  easeOut: easeOut,
  linear: linear,
  easeInQuad: easeInQuad,
  easeOutQuad: easeOutQuad,
  easeInOutQuad: easeInOutQuad,
  easeInCubic: easeInCubic,
  easeOutCubic: easeOutCubic,
  easeInOutCubic: easeInOutCubic,
  easeInQuart: easeInQuart,
  easeOutQuart: easeOutQuart,
  easeInOutQuart: easeInOutQuart,
  easeInQuint: easeInQuint,
  easeOutQuint: easeOutQuint,
  easeInOutQuint: easeInOutQuint
};

function handleDisableAnimation() {
  if (!this.mounted) return;
  if (this.animation) {
    cancelAnimationFrame(this.animation);
  }
  this.animate = false;
  this.animation = false;
  this.velocity = false;
}
function animate(animationName, animationTime, callback) {
  var _this = this;
  if (!this.mounted) return;
  var startTime = new Date().getTime();
  var lastStep = 1;
  // if another animation is active
  handleDisableAnimation.call(this);
  // new animation
  this.animation = function() {
    if (!_this.animation || !_this.mounted) return;
    var frameTime = new Date().getTime() - startTime;
    var animationProgress = frameTime / animationTime;
    var animationType = availableAnimations[animationName];
    var step = animationType(animationProgress);
    if (frameTime >= animationTime) {
      callback(lastStep);
      _this.animation = null;
    } else {
      callback(step);
      requestAnimationFrame(_this.animation);
    }
  };
  requestAnimationFrame(this.animation);
}
function animateComponent(_a) {
  var _this = this;
  var targetState = _a.targetState,
    speed = _a.speed,
    type = _a.type;
  var _b = this.stateProvider,
    scale = _b.scale,
    positionX = _b.positionX,
    positionY = _b.positionY;
  var scaleDiff = targetState.scale - scale;
  var positionXDiff = targetState.positionX - positionX;
  var positionYDiff = targetState.positionY - positionY;
  if (speed === 0) {
    this.stateProvider.previousScale = this.stateProvider.scale;
    this.stateProvider.scale = targetState.scale;
    this.stateProvider.positionX = targetState.positionX;
    this.stateProvider.positionY = targetState.positionY;
    this.applyTransformation();
  } else {
    // animation start timestamp
    animate.call(this, type, speed, function(step) {
      _this.stateProvider.previousScale = _this.stateProvider.scale;
      _this.stateProvider.scale = scale + scaleDiff * step;
      _this.stateProvider.positionX = positionX + positionXDiff * step;
      _this.stateProvider.positionY = positionY + positionYDiff * step;
      // apply animation changes
      _this.applyTransformation();
    });
  }
}

function checkZoomBounds(zoom, minScale, maxScale, zoomPadding, enablePadding) {
  var scalePadding = enablePadding ? zoomPadding : 0;
  var minScaleWithPadding = minScale - scalePadding;
  if (!isNaN(maxScale) && zoom >= maxScale) return maxScale;
  if (!isNaN(minScale) && zoom <= minScaleWithPadding)
    return minScaleWithPadding;
  return zoom;
}
function checkPositionBounds(
  positionX,
  positionY,
  bounds,
  limitToBounds,
  paddingValue,
  wrapperComponent
) {
  var minPositionX = bounds.minPositionX,
    minPositionY = bounds.minPositionY,
    maxPositionX = bounds.maxPositionX,
    maxPositionY = bounds.maxPositionY;
  var paddingX = wrapperComponent
    ? (paddingValue * wrapperComponent.offsetWidth) / 100
    : 0;
  var paddingY = wrapperComponent
    ? (paddingValue * wrapperComponent.offsetHeight) / 100
    : 0;
  var x = boundLimiter(
    positionX,
    minPositionX - paddingX,
    maxPositionX + paddingX,
    limitToBounds
  );
  var y = boundLimiter(
    positionY,
    minPositionY - paddingY,
    maxPositionY + paddingY,
    limitToBounds
  );
  return { x: x, y: y };
}
function getDelta(event, customDelta) {
  var deltaY = event ? (event.deltaY < 0 ? 1 : -1) : 0;
  var delta = checkIsNumber(customDelta, deltaY);
  return delta;
}
function wheelMousePosition(event, contentComponent, scale) {
  var contentRect = contentComponent.getBoundingClientRect();
  // mouse position x, y over wrapper component
  var mouseX = (event.clientX - contentRect.left) / scale;
  var mouseY = (event.clientY - contentRect.top) / scale;
  if (isNaN(mouseX) || isNaN(mouseY))
    console.error("No mouse or touch offset found");
  return {
    mouseX: mouseX,
    mouseY: mouseY
  };
}
function getComponentsSizes(wrapperComponent, contentComponent, newScale) {
  var wrapperWidth = wrapperComponent.offsetWidth;
  var wrapperHeight = wrapperComponent.offsetHeight;
  var contentWidth = contentComponent.offsetWidth;
  var contentHeight = contentComponent.offsetHeight;
  var newContentWidth = contentWidth * newScale;
  var newContentHeight = contentHeight * newScale;
  var newDiffWidth = wrapperWidth - newContentWidth;
  var newDiffHeight = wrapperHeight - newContentHeight;
  return {
    wrapperWidth: wrapperWidth,
    wrapperHeight: wrapperHeight,
    newContentWidth: newContentWidth,
    newDiffWidth: newDiffWidth,
    newContentHeight: newContentHeight,
    newDiffHeight: newDiffHeight
  };
}
function handleCalculatePositions(
  mouseX,
  mouseY,
  newScale,
  bounds,
  limitToBounds
) {
  var _a = this.stateProvider,
    scale = _a.scale,
    positionX = _a.positionX,
    positionY = _a.positionY,
    transformEnabled = _a.options.transformEnabled;
  var scaleDifference = newScale - scale;
  if (typeof mouseX !== "number" || typeof mouseY !== "number")
    return console.error("Mouse X and Y position were not provided!");
  if (!transformEnabled)
    return { newPositionX: positionX, newPositionY: positionY };
  var calculatedPositionX = positionX - mouseX * scaleDifference;
  var calculatedPositionY = positionY - mouseY * scaleDifference;
  // do not limit to bounds when there is padding animation,
  // it causes animation strange behaviour
  var newPositions = checkPositionBounds(
    calculatedPositionX,
    calculatedPositionY,
    bounds,
    limitToBounds,
    0,
    null
  );
  return newPositions;
}

function getClientPosition(event) {
  var touches = event.touches;
  // Mobile points
  if (touches && touches.length === 1) {
    return { clientX: touches[0].clientX, clientY: touches[0].clientY };
  }
  // Desktop points
  if (!touches) {
    return { clientX: event.clientX, clientY: event.clientY };
  }
  return null;
}
function handlePanning(event) {
  var _a = this.stateProvider,
    scale = _a.scale,
    positionX = _a.positionX,
    positionY = _a.positionY,
    _b = _a.options,
    limitToBounds = _b.limitToBounds,
    minScale = _b.minScale,
    _c = _a.pan,
    lockAxisX = _c.lockAxisX,
    lockAxisY = _c.lockAxisY,
    padding = _c.padding,
    paddingSize = _c.paddingSize,
    wrapperComponent = _a.wrapperComponent;
  if (!this.startCoords) return;
  var _d = this.startCoords,
    x = _d.x,
    y = _d.y;
  var positions = getClientPosition(event);
  if (!positions) return console.error("Cannot find mouse client positions");
  var clientX = positions.clientX,
    clientY = positions.clientY;
  // Get Position
  var mouseX = clientX - x;
  var mouseY = clientY - y;
  var newPositionX = lockAxisX ? positionX : mouseX;
  var newPositionY = lockAxisY ? positionY : mouseY;
  // padding
  var paddingValue = padding && scale >= minScale ? paddingSize : 0;
  // If position didn't change
  if (newPositionX === positionX && newPositionY === positionY) return;
  var calculatedPosition = checkPositionBounds(
    newPositionX,
    newPositionY,
    this.bounds,
    limitToBounds,
    paddingValue,
    wrapperComponent
  );
  // Save panned position
  handlePaddingAnimation.call(this, calculatedPosition.x, calculatedPosition.y);
}
function handlePanningUsingWheel(event) {
  var _a = this.stateProvider,
    scale = _a.scale,
    positionX = _a.positionX,
    positionY = _a.positionY,
    _b = _a.options,
    limitToBounds = _b.limitToBounds,
    minScale = _b.minScale,
    _c = _a.pan,
    lockAxisX = _c.lockAxisX,
    lockAxisY = _c.lockAxisY,
    padding = _c.padding,
    paddingSize = _c.paddingSize,
    wrapperComponent = _a.wrapperComponent;
  // Get Position
  var mouseX = positionX - event.deltaX;
  var mouseY = positionY - event.deltaY;
  var newPositionX = lockAxisX ? positionX : mouseX;
  var newPositionY = lockAxisY ? positionY : mouseY;
  // padding
  var paddingValue = padding && scale >= minScale ? paddingSize : 0;
  // If position didn't change
  if (newPositionX === positionX && newPositionY === positionY) return;
  var calculatedPosition = checkPositionBounds(
    newPositionX,
    newPositionY,
    this.bounds,
    limitToBounds,
    paddingValue,
    wrapperComponent
  );
  // Save panned position
  handlePaddingAnimation.call(this, calculatedPosition.x, calculatedPosition.y);
}
function handlePanningAnimation() {
  var _a = this.stateProvider,
    scale = _a.scale,
    minScale = _a.options.minScale,
    _b = _a.pan,
    disabled = _b.disabled,
    padding = _b.padding,
    panReturnAnimationTime = _b.panReturnAnimationTime,
    panReturnAnimationType = _b.panReturnAnimationType;
  var isDisabled = disabled || scale < minScale || !padding;
  if (isDisabled) return;
  var targetState = handlePanToBounds.call(this);
  animateComponent.call(this, {
    targetState: targetState,
    speed: panReturnAnimationTime,
    type: panReturnAnimationType
  });
}
function handlePanToBounds() {
  var _a = this.stateProvider,
    positionX = _a.positionX,
    positionY = _a.positionY,
    scale = _a.scale,
    _b = _a.options,
    disabled = _b.disabled,
    limitToBounds = _b.limitToBounds,
    limitToWrapper = _b.limitToWrapper;
  var wrapperComponent = this.state.wrapperComponent;
  if (disabled) return;
  var _c = this.bounds,
    maxPositionX = _c.maxPositionX,
    minPositionX = _c.minPositionX,
    maxPositionY = _c.maxPositionY,
    minPositionY = _c.minPositionY;
  var xChanged = positionX > maxPositionX || positionX < minPositionX;
  var yChanged = positionY > maxPositionY || positionY < minPositionY;
  var mouseX =
    positionX > maxPositionX
      ? wrapperComponent.offsetWidth
      : this.stateProvider.minPositionX || 0;
  var mouseY =
    positionY > maxPositionY
      ? wrapperComponent.offsetHeight
      : this.stateProvider.minPositionY || 0;
  var mousePosX = mouseX;
  var mousePosY = mouseY;
  var _d = handleCalculatePositions.call(
      this,
      mousePosX,
      mousePosY,
      scale,
      this.bounds,
      limitToBounds || limitToWrapper
    ),
    x = _d.x,
    y = _d.y;
  return {
    scale: scale,
    positionX: xChanged ? x : positionX,
    positionY: yChanged ? y : positionY
  };
}
function handlePaddingAnimation(positionX, positionY) {
  var padding = this.stateProvider.pan.padding;
  if (!padding) return;
  this.stateProvider.positionX = positionX;
  this.stateProvider.positionY = positionY;
  this.applyTransformation();
}

function handleCalculateZoom(
  delta,
  step,
  disablePadding,
  getTarget,
  isBtnFunction
) {
  var _a = this.stateProvider,
    scale = _a.scale,
    _b = _a.options,
    maxScale = _b.maxScale,
    minScale = _b.minScale,
    _c = _a.scalePadding,
    size = _c.size,
    disabled = _c.disabled,
    wrapperComponent = _a.wrapperComponent;
  var targetScale = null;
  if (isBtnFunction) {
    var scaleFactor = window.innerWidth * 0.0001;
    var zoomFactor = delta < 0 ? 30 : 20;
    targetScale =
      scale + (step - step * scaleFactor) * delta * (scale / zoomFactor);
  } else {
    var wrapperToWindowScale =
      2 - window.innerWidth / wrapperComponent.offsetWidth;
    var scaleFactor = Math.max(0.2, Math.min(0.99, wrapperToWindowScale));
    var zoomFactor = 20;
    targetScale =
      scale + step * delta * ((scale - scale * scaleFactor) / zoomFactor);
  }
  if (getTarget) return targetScale;
  var paddingEnabled = disablePadding ? false : !disabled;
  var newScale = checkZoomBounds(
    roundNumber(targetScale, 3),
    minScale,
    maxScale,
    size,
    paddingEnabled
  );
  return newScale;
}
function handleCalculateBounds(newScale, limitToWrapper) {
  var _a = this.stateProvider,
    wrapperComponent = _a.wrapperComponent,
    contentComponent = _a.contentComponent;
  var _b = getComponentsSizes(wrapperComponent, contentComponent, newScale),
    wrapperWidth = _b.wrapperWidth,
    wrapperHeight = _b.wrapperHeight,
    newContentWidth = _b.newContentWidth,
    newDiffWidth = _b.newDiffWidth,
    newContentHeight = _b.newContentHeight,
    newDiffHeight = _b.newDiffHeight;
  var bounds = calculateBoundingArea(
    wrapperWidth,
    newContentWidth,
    newDiffWidth,
    wrapperHeight,
    newContentHeight,
    newDiffHeight,
    limitToWrapper
  );
  // Save bounds
  this.bounds = bounds;
  return bounds;
}
/**
 * Wheel zoom event
 */
function handleWheelZoom(event) {
  var _a = this.stateProvider,
    scale = _a.scale,
    contentComponent = _a.contentComponent,
    limitToBounds = _a.options.limitToBounds,
    _b = _a.scalePadding,
    size = _b.size,
    disabled = _b.disabled,
    _c = _a.wheel,
    step = _c.step,
    limitsOnWheel = _c.limitsOnWheel;
  // event.preventDefault();
  event.stopPropagation();
  var delta = getDelta(event, null);
  var newScale = handleCalculateZoom.call(this, delta, step, !event.ctrlKey);
  // if scale not change
  if (scale === newScale) return;
  var bounds = handleCalculateBounds.call(this, newScale, !limitsOnWheel);
  var _d = wheelMousePosition(event, contentComponent, scale),
    mouseX = _d.mouseX,
    mouseY = _d.mouseY;
  var isLimitedToBounds =
    limitToBounds && (disabled || size === 0 || limitsOnWheel);
  var _e = handleCalculatePositions.call(
      this,
      mouseX,
      mouseY,
      newScale,
      bounds,
      isLimitedToBounds
    ),
    x = _e.x,
    y = _e.y;
  this.bounds = bounds;
  this.stateProvider.previousScale = scale;
  this.stateProvider.scale = newScale;
  this.stateProvider.positionX = x;
  this.stateProvider.positionY = y;
  this.applyTransformation();
}
/**
 * Zoom for animations
 */
function handleZoomToPoint(isDisabled, scale, mouseX, mouseY, event) {
  var _a = this.stateProvider,
    contentComponent = _a.contentComponent,
    _b = _a.options,
    disabled = _b.disabled,
    minScale = _b.minScale,
    maxScale = _b.maxScale,
    limitToBounds = _b.limitToBounds,
    limitToWrapper = _b.limitToWrapper;
  if (disabled || isDisabled) return;
  var newScale = checkZoomBounds(
    roundNumber(scale, 2),
    minScale,
    maxScale,
    null,
    null
  );
  var bounds = handleCalculateBounds.call(this, newScale, limitToWrapper);
  var mousePosX = mouseX;
  var mousePosY = mouseY;
  // if event is present - use it's mouse position
  if (event) {
    var mousePosition = wheelMousePosition(event, contentComponent, scale);
    mousePosX = mousePosition.mouseX;
    mousePosY = mousePosition.mouseY;
  }
  var _c = handleCalculatePositions.call(
      this,
      mousePosX,
      mousePosY,
      newScale,
      bounds,
      limitToBounds
    ),
    x = _c.x,
    y = _c.y;
  return { scale: newScale, positionX: x, positionY: y };
}
function handlePaddingAnimation$1() {
  var _a = this.stateProvider,
    scale = _a.scale,
    wrapperComponent = _a.wrapperComponent,
    _b = _a.options,
    minScale = _b.minScale,
    limitToBounds = _b.limitToBounds,
    _c = _a.scalePadding,
    disabled = _c.disabled,
    animationTime = _c.animationTime,
    animationType = _c.animationType;
  var isDisabled = disabled || scale >= minScale;
  if (scale >= 1 || limitToBounds) {
    // fire fit to bounds animation
    handlePanningAnimation.call(this);
  }
  if (isDisabled) return;
  var mouseX = wrapperComponent.offsetWidth / 2;
  var mouseY = wrapperComponent.offsetHeight / 2;
  var targetState = handleZoomToPoint.call(
    this,
    false,
    minScale,
    mouseX,
    mouseY,
    null
  );
  animateComponent.call(this, {
    targetState: targetState,
    speed: animationTime,
    type: animationType
  });
}
/**
 * Button zoom events
 */
function handleDoubleClick(event) {
  // event.preventDefault();
  event.stopPropagation();
  var _a = this.stateProvider,
    contentComponent = _a.contentComponent,
    scale = _a.scale,
    _b = _a.doubleClick,
    disabled = _b.disabled,
    mode = _b.mode,
    step = _b.step,
    animationTime = _b.animationTime,
    animationType = _b.animationType;
  if (mode === "reset") {
    return resetTransformations.call(this, event, animationTime);
  }
  var delta = mode === "zoomOut" ? -1 : 1;
  var newScale = handleCalculateZoom.call(
    this,
    delta,
    step,
    undefined,
    undefined,
    true
  );
  var _c = wheelMousePosition(event, contentComponent, scale),
    mouseX = _c.mouseX,
    mouseY = _c.mouseY;
  var targetState = handleZoomToPoint.call(
    this,
    disabled,
    newScale,
    mouseX,
    mouseY
  );
  if (targetState.scale === scale) return;
  var targetScale = handleCalculateZoom.call(
    this,
    delta,
    step,
    true,
    undefined,
    true
  );
  var time = getButtonAnimationTime(targetScale, newScale, animationTime);
  animateComponent.call(this, {
    targetState: targetState,
    speed: time,
    type: animationType
  });
}
function handleZoomControls(customDelta, customStep) {
  var _a = this.stateProvider,
    scale = _a.scale,
    positionX = _a.positionX,
    positionY = _a.positionY,
    wrapperComponent = _a.wrapperComponent,
    zoomIn = _a.zoomIn,
    zoomOut = _a.zoomOut;
  var wrapperWidth = wrapperComponent.offsetWidth;
  var wrapperHeight = wrapperComponent.offsetHeight;
  var mouseX = (wrapperWidth / 2 - positionX) / scale;
  var mouseY = (wrapperHeight / 2 - positionY) / scale;
  var newScale = handleCalculateZoom.call(
    this,
    customDelta,
    customStep,
    undefined,
    undefined,
    true
  );
  var isZoomIn = newScale > scale;
  var animationSpeed = isZoomIn ? zoomIn.animationTime : zoomOut.animationTime;
  var animationType = isZoomIn ? zoomIn.animationType : zoomOut.animationType;
  var isDisabled = isZoomIn ? zoomIn.disabled : zoomOut.disabled;
  var targetState = handleZoomToPoint.call(
    this,
    isDisabled,
    newScale,
    mouseX,
    mouseY
  );
  if (targetState.scale === scale) return;
  var targetScale = handleCalculateZoom.call(
    this,
    customDelta,
    customStep,
    true,
    undefined,
    true
  );
  var time = getButtonAnimationTime(targetScale, newScale, animationSpeed);
  animateComponent.call(this, {
    targetState: targetState,
    speed: time,
    type: animationType
  });
}
function resetTransformations(animationSpeed) {
  var _a = this.props.defaultValues,
    defaultScale = _a.defaultScale,
    defaultPositionX = _a.defaultPositionX,
    defaultPositionY = _a.defaultPositionY;
  var _b = this.stateProvider,
    scale = _b.scale,
    positionX = _b.positionX,
    positionY = _b.positionY,
    reset = _b.reset,
    _c = _b.options,
    disabled = _c.disabled,
    limitToBounds = _c.limitToBounds,
    centerContent = _c.centerContent,
    limitToWrapper = _c.limitToWrapper;
  if (disabled || reset.disabled) return;
  if (
    scale === defaultScale &&
    positionX === defaultPositionX &&
    positionY === defaultPositionY
  )
    return;
  var speed =
    typeof animationSpeed === "number" ? animationSpeed : reset.animationTime;
  var targetScale = checkIsNumber(defaultScale, initialState.scale);
  var newPositionX = checkIsNumber(defaultPositionX, initialState.positionX);
  var newPositionY = checkIsNumber(defaultPositionY, initialState.positionY);
  if ((limitToBounds && !limitToWrapper) || centerContent) {
    var bounds = handleCalculateBounds.call(this, targetScale, limitToWrapper);
    newPositionX = bounds.minPositionX;
    newPositionY = bounds.minPositionY;
  }
  var targetState = {
    scale: targetScale,
    positionX: newPositionX,
    positionY: newPositionY
  };
  animateComponent.call(this, {
    targetState: targetState,
    speed: speed,
    type: reset.animationType
  });
}
function getButtonAnimationTime(targetScale, newScale, time) {
  return time * (newScale / targetScale);
}

function round(number, decimal) {
  var roundNumber = Math.pow(10, decimal);
  return Math.round(number * roundNumber) / roundNumber;
}
function getCurrentDistance(event) {
  return getDistance(event.touches[0], event.touches[1]);
}
function checkIfInfinite(number) {
  return number === Infinity || number === -Infinity;
}
function calculatePinchZoom(currentDistance, pinchStartDistance) {
  var _a = this.stateProvider,
    _b = _a.options,
    minScale = _b.minScale,
    maxScale = _b.maxScale,
    _c = _a.scalePadding,
    size = _c.size,
    disabled = _c.disabled;
  if (
    typeof pinchStartDistance !== "number" ||
    typeof currentDistance !== "number"
  )
    return console.error("Pinch touches distance was not provided");
  if (currentDistance < 0) return;
  var touchProportion = currentDistance / pinchStartDistance;
  var scaleDifference = touchProportion * this.pinchStartScale;
  return checkZoomBounds(
    roundNumber(scaleDifference, 2),
    minScale,
    maxScale,
    size,
    !disabled
  );
}
function calculateMidpoint(event, scale, contentComponent) {
  var contentRect = contentComponent.getBoundingClientRect();
  var touches = event.touches;
  var firstPointX = round(touches[0].clientX - contentRect.left, 5);
  var firstPointY = round(touches[0].clientY - contentRect.top, 5);
  var secondPointX = round(touches[1].clientX - contentRect.left, 5);
  var secondPointY = round(touches[1].clientY - contentRect.top, 5);
  return {
    mouseX: (firstPointX + secondPointX) / 2 / scale,
    mouseY: (firstPointY + secondPointY) / 2 / scale
  };
}
function handleZoomPinch(event) {
  var _a = this.stateProvider,
    scale = _a.scale,
    _b = _a.options,
    limitToBounds = _b.limitToBounds,
    limitToWrapper = _b.limitToWrapper,
    _c = _a.scalePadding,
    disabled = _c.disabled,
    size = _c.size,
    limitsOnWheel = _a.wheel.limitsOnWheel,
    pinch = _a.pinch;
  var contentComponent = this.state.contentComponent;
  if (pinch.disabled || this.stateProvider.options.disabled) return;
  if (event.cancelable) {
    // event.preventDefault();
    event.stopPropagation();
  }
  // if one finger starts from outside of wrapper
  if (this.pinchStartDistance === null) return;
  // Position transformation
  var _d = calculateMidpoint(event, scale, contentComponent),
    mouseX = _d.mouseX,
    mouseY = _d.mouseY;
  // if touches goes off of the wrapper element
  if (checkIfInfinite(mouseX) || checkIfInfinite(mouseY)) return;
  var currentDistance = getCurrentDistance(event);
  var newScale = calculatePinchZoom.call(
    this,
    currentDistance,
    this.pinchStartDistance
  );
  if (checkIfInfinite(newScale) || newScale === scale) return;
  // Get new element sizes to calculate bounds
  var bounds = handleCalculateBounds.call(this, newScale, limitToWrapper);
  // Calculate transformations
  var isLimitedToBounds =
    limitToBounds && (disabled || size === 0 || limitsOnWheel);
  var _e = handleCalculatePositions.call(
      this,
      mouseX,
      mouseY,
      newScale,
      bounds,
      isLimitedToBounds
    ),
    x = _e.x,
    y = _e.y;
  this.lastDistance = currentDistance;
  this.stateProvider.positionX = x;
  this.stateProvider.positionY = y;
  this.stateProvider.scale = newScale;
  this.stateProvider.previousScale = scale;
  // update component transformation
  this.applyTransformation();
}

var throttleTime = 30;
function velocityTimeSpeed(speed, animationTime) {
  var velocityEqualToMove = this.stateProvider.pan.velocityEqualToMove;
  if (velocityEqualToMove) {
    return animationTime - animationTime / Math.max(1, speed);
  }
  return animationTime;
}
function handleEnableVelocity() {
  this.setState({ startAnimation: false });
}
function handleFireVelocity() {
  this.setState({ startAnimation: true });
}
function animateVelocity() {
  var _this = this;
  var _a = this.stateProvider,
    positionX = _a.positionX,
    positionY = _a.positionY,
    limitToBounds = _a.options.limitToBounds,
    _b = _a.pan,
    velocityBaseTime = _b.velocityBaseTime,
    lockAxisX = _b.lockAxisX,
    lockAxisY = _b.lockAxisY,
    velocityAnimationType = _b.velocityAnimationType,
    panReturnAnimationTime = _b.panReturnAnimationTime,
    panReturnAnimationType = _b.panReturnAnimationType,
    padding = _b.padding,
    paddingSize = _b.paddingSize,
    wrapperComponent = _a.wrapperComponent;
  if (!this.mounted) return;
  if (!this.velocity || !this.bounds) return handleDisableAnimation.call(this);
  var _c = this.bounds,
    maxPositionX = _c.maxPositionX,
    minPositionX = _c.minPositionX,
    maxPositionY = _c.maxPositionY,
    minPositionY = _c.minPositionY;
  var _d = this.velocity,
    velocityX = _d.velocityX,
    velocityY = _d.velocityY,
    velocity = _d.velocity;
  var animationTime = velocityTimeSpeed.call(this, velocity, velocityBaseTime);
  if (!animationTime) {
    handlePanningAnimation.call(this);
    return;
  }
  var targetX = velocityX;
  var targetY = velocityY;
  // pan return animation
  var newAnimationTime =
    animationTime > panReturnAnimationTime
      ? animationTime
      : panReturnAnimationTime;
  var paddingValue = padding ? paddingSize : 0;
  var paddingX = wrapperComponent
    ? (paddingValue * wrapperComponent.offsetWidth) / 100
    : 0;
  var paddingY = wrapperComponent
    ? (paddingValue * wrapperComponent.offsetHeight) / 100
    : 0;
  var maxTargetX = maxPositionX + paddingX;
  var minTargetX = minPositionX - paddingX;
  var maxTargetY = maxPositionY + paddingY;
  var minTargetY = minPositionY - paddingY;
  var startPosition = checkPositionBounds(
    positionX,
    positionY,
    this.bounds,
    limitToBounds,
    paddingValue,
    wrapperComponent
  );
  var startTime = new Date().getTime();
  // animation start timestamp
  animate.call(this, velocityAnimationType, newAnimationTime, function(step) {
    var frameTime = new Date().getTime() - startTime;
    var animationProgress = frameTime / panReturnAnimationTime;
    var returnAnimation = availableAnimations[panReturnAnimationType];
    var customReturnStep = returnAnimation(animationProgress);
    if (
      frameTime > panReturnAnimationTime ||
      customReturnStep > 1 ||
      customReturnStep === Infinity ||
      customReturnStep === -Infinity
    )
      customReturnStep = 1;
    var currentPositionX = getPosition(
      lockAxisX,
      targetX,
      step,
      customReturnStep,
      minPositionX,
      maxPositionX,
      limitToBounds,
      positionX,
      startPosition.x,
      minTargetX,
      maxTargetX
    );
    var currentPositionY = getPosition(
      lockAxisY,
      targetY,
      step,
      customReturnStep,
      minPositionY,
      maxPositionY,
      limitToBounds,
      positionY,
      startPosition.y,
      minTargetY,
      maxTargetY
    );
    if (positionX !== currentPositionX || positionY !== currentPositionY) {
      // Save panned position
      _this.stateProvider.positionX = currentPositionX;
      _this.stateProvider.positionY = currentPositionY;
      // apply animation changes
      _this.applyTransformation();
    }
  });
}
function calculateVelocityStart(event) {
  var _this = this;
  var _a = this.stateProvider,
    scale = _a.scale,
    disabled = _a.options.disabled,
    _b = _a.pan,
    velocity = _b.velocity,
    velocitySensitivity = _b.velocitySensitivity,
    velocityActiveScale = _b.velocityActiveScale,
    velocityMinSpeed = _b.velocityMinSpeed,
    wrapperComponent = _a.wrapperComponent;
  if (!velocity || velocityActiveScale >= scale || disabled) return;
  handleEnableVelocity.call(this);
  var now = Date.now();
  if (this.lastMousePosition) {
    var position_1 = getClientPosition(event);
    if (!position_1)
      return console.error("No mouse or touch position detected");
    var clientX = position_1.clientX,
      clientY = position_1.clientY;
    var distanceX = clientX - this.lastMousePosition.clientX;
    var distanceY = clientY - this.lastMousePosition.clientY;
    var interval = now - this.velocityTime;
    var wrapperToWindowScaleX =
      2 - wrapperComponent.offsetWidth / window.innerWidth;
    var wrapperToWindowScaleY =
      2 - wrapperComponent.offsetHeight / window.innerHeight;
    var scaledX =
      20 * Math.max(velocityMinSpeed, Math.min(2, wrapperToWindowScaleX));
    var scaledY =
      20 * Math.max(velocityMinSpeed, Math.min(2, wrapperToWindowScaleY));
    var velocityX =
      (distanceX / interval) * velocitySensitivity * scale * scaledX;
    var velocityY =
      (distanceY / interval) * velocitySensitivity * scale * scaledY;
    var speed = distanceX * distanceX + distanceY * distanceY;
    var velocity_1 = (Math.sqrt(speed) / interval) * velocitySensitivity;
    if (this.velocity && velocity_1 < this.velocity.velocity && this.throttle)
      return;
    this.velocity = {
      velocityX: velocityX,
      velocityY: velocityY,
      velocity: velocity_1
    };
    // throttling
    if (this.throttle) clearTimeout(this.throttle);
    this.throttle = setTimeout(function() {
      if (_this.mounted) _this.throttle = false;
    }, throttleTime);
  }
  var position = getClientPosition(event);
  this.lastMousePosition = position;
  this.velocityTime = now;
}
function getPosition(
  isLocked,
  target,
  step,
  panReturnStep,
  minBound,
  maxBound,
  limitToBounds,
  offset,
  startPosition,
  minTarget,
  maxTarget
) {
  if (limitToBounds) {
    if (startPosition > minBound && offset > maxBound) {
      var newPosition =
        startPosition - (startPosition - maxBound) * panReturnStep;
      if (newPosition > maxTarget) return maxTarget;
      if (newPosition < maxBound) return maxBound;
      return newPosition;
    }
    if (startPosition < minBound && offset < minBound) {
      var newPosition =
        startPosition - (startPosition - minBound) * panReturnStep;
      if (newPosition < minTarget) return minTarget;
      if (newPosition > minBound) return minBound;
      return newPosition;
    }
  }
  if (isLocked) return startPosition;
  var offsetPosition = offset + target * step;
  return boundLimiter(offsetPosition, minBound, maxBound, limitToBounds);
}

// We want to make event listeners non-passive, and to do so have to check
function makePassiveEventOption(passive) {
  return passive;
}

var propsList = [
  "previousScale",
  "scale",
  "positionX",
  "positionY",
  "defaultPositionX",
  "defaultPositionY",
  "defaultScale",
  "onWheelStart",
  "onWheel",
  "onWheelStop",
  "onPanningStart",
  "onPanning",
  "onPanningStop",
  "onPinchingStart",
  "onPinching",
  "onPinchingStop",
  "onZoomChange",
  "options",
  "wheel",
  "scalePadding",
  "pan",
  "pinch",
  "zoomIn",
  "zoomOut",
  "doubleClick",
  "reset"
];
var getValidPropsFromObject = function(props) {
  return Object.keys(props).reduce(function(acc, key) {
    if (propsList.includes(key)) {
      acc[key] = props[key];
    }
    return acc;
  }, {});
};

var Context = React__default.createContext({});
var wheelStopEventTimer = null;
var wheelStopEventTime = 180;
var wheelAnimationTimer = null;
var wheelAnimationTime = 100;
var StateProvider = /** @class */ (function(_super) {
  __extends(StateProvider, _super);
  function StateProvider() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.mounted = true;
    _this.state = {
      wrapperComponent: undefined,
      contentComponent: undefined
    };
    _this.stateProvider = __assign(
      __assign(
        __assign(
          __assign({}, initialState),
          mergeProps(initialState, _this.props.dynamicValues)
        ),
        _this.props.defaultValues
      ),
      {
        previousScale:
          _this.props.dynamicValues.scale ||
          _this.props.defaultValues.scale ||
          initialState.scale
      }
    );
    _this.windowToWrapperScaleX = 0;
    _this.windowToWrapperScaleY = 0;
    // panning helpers
    _this.startCoords = null;
    _this.isDown = false;
    // pinch helpers
    _this.pinchStartDistance = null;
    _this.lastDistance = null;
    _this.pinchStartScale = null;
    _this.distance = null;
    _this.bounds = null;
    // velocity helpers
    _this.velocityTime = null;
    _this.lastMousePosition = null;
    _this.velocity = null;
    _this.offsetX = null;
    _this.offsetY = null;
    _this.throttle = false;
    // wheel helpers
    _this.previousWheelEvent = null;
    _this.lastScale = null;
    // animations helpers
    _this.animate = null;
    _this.animation = null;
    _this.maxBounds = null;
    //////////
    // Wheel
    //////////
    _this.handleWheel = function(event) {
      var _a = _this.stateProvider,
        scale = _a.scale,
        _b = _a.wheel,
        disabled = _b.disabled,
        wheelEnabled = _b.wheelEnabled,
        touchPadEnabled = _b.touchPadEnabled;
      var _c = _this.props,
        onWheelStart = _c.onWheelStart,
        onWheel = _c.onWheel,
        onWheelStop = _c.onWheelStop;
      var _d = _this.state,
        wrapperComponent = _d.wrapperComponent,
        contentComponent = _d.contentComponent;
      if (
        _this.isDown ||
        disabled ||
        _this.stateProvider.options.disabled ||
        !wrapperComponent ||
        !contentComponent
      )
        return;
      // ctrlKey detects if touchpad execute wheel or pinch gesture
      if (!wheelEnabled && !event.ctrlKey) return;
      if (!touchPadEnabled && event.ctrlKey) return;
      // Wheel start event
      if (!wheelStopEventTimer) {
        _this.lastScale = scale;
        handleDisableAnimation.call(_this);
        handleCallback(onWheelStart, _this.getCallbackProps());
      }
      // Wheel event
      handleWheelZoom.call(_this, event);
      handleCallback(onWheel, _this.getCallbackProps());
      _this.applyTransformation(null, null, null);
      _this.previousWheelEvent = event;
      // Wheel stop event
      if (
        handleWheelStop(_this.previousWheelEvent, event, _this.stateProvider)
      ) {
        clearTimeout(wheelStopEventTimer);
        wheelStopEventTimer = setTimeout(function() {
          if (!_this.mounted) return;
          handleCallback(onWheelStop, _this.getCallbackProps());
          wheelStopEventTimer = null;
        }, wheelStopEventTime);
      }
      // cancel animation
      _this.animate = false;
      // fire animation
      _this.lastScale = _this.stateProvider.scale;
      clearTimeout(wheelAnimationTimer);
      wheelAnimationTimer = setTimeout(function() {
        if (!_this.mounted) return;
        handlePaddingAnimation$1.call(_this, event);
      }, wheelAnimationTime);
    };
    //////////
    // Panning
    //////////
    _this.checkPanningTarget = function(event) {
      var disableOnTarget = _this.stateProvider.pan.disableOnTarget;
      return (
        disableOnTarget
          .map(function(tag) {
            return tag.toUpperCase();
          })
          .includes(event.target.tagName) ||
        disableOnTarget.find(function(element) {
          return event.target.classList.value.includes(element);
        })
      );
    };
    _this.checkIsPanningActive = function(event) {
      var disabled = _this.stateProvider.pan.disabled;
      var _a = _this.state,
        wrapperComponent = _a.wrapperComponent,
        contentComponent = _a.contentComponent;
      return (
        !_this.isDown ||
        disabled ||
        _this.stateProvider.options.disabled ||
        (event.touches &&
          (event.touches.length !== 1 ||
            Math.abs(_this.startCoords.x - event.touches[0].clientX) < 1 ||
            Math.abs(_this.startCoords.y - event.touches[0].clientY) < 1)) ||
        !wrapperComponent ||
        !contentComponent
      );
    };
    _this.handleSetUpPanning = function(x, y) {
      var _a = _this.stateProvider,
        positionX = _a.positionX,
        positionY = _a.positionY;
      _this.isDown = true;
      _this.startCoords = { x: x - positionX, y: y - positionY };
      handleCallback(_this.props.onPanningStart, _this.getCallbackProps());
    };
    _this.handleStartPanning = function(event) {
      var _a = _this.stateProvider,
        wrapperComponent = _a.wrapperComponent,
        scale = _a.scale,
        _b = _a.options,
        minScale = _b.minScale,
        maxScale = _b.maxScale,
        limitToWrapper = _b.limitToWrapper,
        disabled = _a.pan.disabled;
      var target = event.target,
        touches = event.touches;
      if (
        disabled ||
        _this.stateProvider.options.disabled ||
        (wrapperComponent && !wrapperComponent.contains(target)) ||
        _this.checkPanningTarget(event) ||
        scale < minScale ||
        scale > maxScale
      )
        return;
      handleDisableAnimation.call(_this);
      _this.bounds = handleCalculateBounds.call(_this, scale, limitToWrapper);
      // Mobile points
      if (touches && touches.length === 1) {
        _this.handleSetUpPanning(touches[0].clientX, touches[0].clientY);
      }
      // Desktop points
      if (!touches) {
        _this.handleSetUpPanning(event.clientX, event.clientY);
      }
    };
    _this.handlePanning = function(event) {
      // if (this.isDown) event.preventDefault();
      if (_this.checkIsPanningActive(event)) return;
      event.stopPropagation();
      calculateVelocityStart.call(_this, event);
      handlePanning.call(_this, event);
      handleCallback(_this.props.onPanning, _this.getCallbackProps());
    };
    _this.handleStopPanning = function() {
      if (_this.isDown) {
        _this.isDown = false;
        _this.animate = false;
        _this.animation = false;
        handleFireVelocity.call(_this);
        handleCallback(_this.props.onPanningStop, _this.getCallbackProps());
        var _a = _this.stateProvider,
          velocity = _a.pan.velocity,
          scale = _a.scale;
        // start velocity animation
        if (_this.velocity && velocity && scale > 1) {
          animateVelocity.call(_this);
        } else {
          // fire fit to bounds animation
          handlePanningAnimation.call(_this);
        }
      }
    };
    _this.handleWheelPanning = function(event) {
      var _a = _this.stateProvider,
        _b = _a.pan,
        disabled = _b.disabled,
        wheelEnabled = _b.wheelEnabled,
        wrapperComponent = _a.wrapperComponent,
        contentComponent = _a.contentComponent;
      if (
        _this.isDown ||
        disabled ||
        _this.stateProvider.options.disabled ||
        !wrapperComponent ||
        !contentComponent ||
        !wheelEnabled
      )
        return;
      // event.preventDefault();
      event.stopPropagation();
      handlePanningUsingWheel.call(_this, event);
      handleCallback(_this.props.onPanning, _this.getCallbackProps());
    };
    //////////
    // Pinch
    //////////
    _this.handlePinchStart = function(event) {
      var scale = _this.stateProvider.scale;
      // event.preventDefault();
      event.stopPropagation();
      handleDisableAnimation.call(_this);
      var distance = getDistance(event.touches[0], event.touches[1]);
      _this.pinchStartDistance = distance;
      _this.lastDistance = distance;
      _this.pinchStartScale = scale;
      _this.isDown = false;
      handleCallback(_this.props.onPinchingStart, _this.getCallbackProps());
    };
    _this.handlePinch = function(event) {
      _this.isDown = false;
      handleZoomPinch.call(_this, event);
      handleCallback(_this.props.onPinching, _this.getCallbackProps());
    };
    _this.handlePinchStop = function() {
      if (typeof _this.pinchStartScale === "number") {
        _this.isDown = false;
        _this.velocity = null;
        _this.lastDistance = null;
        _this.pinchStartScale = null;
        _this.pinchStartDistance = null;
        handlePaddingAnimation$1.call(_this);
        handleCallback(_this.props.onPinchingStop, _this.getCallbackProps());
      }
    };
    //////////
    // Touch Events
    //////////
    _this.handleTouchStart = function(event) {
      var _a = _this.stateProvider,
        wrapperComponent = _a.wrapperComponent,
        contentComponent = _a.contentComponent,
        scale = _a.scale,
        _b = _a.options,
        disabled = _b.disabled,
        minScale = _b.minScale;
      var touches = event.touches;
      if (
        disabled ||
        !wrapperComponent ||
        !contentComponent ||
        scale < minScale
      )
        return;
      handleDisableAnimation.call(_this);
      if (touches && touches.length === 1)
        return _this.handleStartPanning(event);
      if (touches && touches.length === 2) return _this.handlePinchStart(event);
    };
    _this.handleTouch = function(event) {
      var _a = _this.stateProvider,
        pan = _a.pan,
        pinch = _a.pinch,
        options = _a.options;
      if (options.disabled) return;
      if (!pan.disabled && event.touches.length === 1)
        return _this.handlePanning(event);
      if (!pinch.disabled && event.touches.length === 2)
        return _this.handlePinch(event);
    };
    _this.handleTouchStop = function() {
      _this.handleStopPanning();
      _this.handlePinchStop();
    };
    //////////
    // Controls
    //////////
    _this.zoomIn = function(event) {
      var _a = _this.stateProvider,
        _b = _a.zoomIn,
        disabled = _b.disabled,
        step = _b.step,
        options = _a.options;
      var _c = _this.state,
        wrapperComponent = _c.wrapperComponent,
        contentComponent = _c.contentComponent;
      if (!event) throw Error("Zoom in function requires event prop");
      if (
        disabled ||
        options.disabled ||
        !wrapperComponent ||
        !contentComponent
      )
        return;
      handleZoomControls.call(_this, 1, step);
    };
    _this.zoomOut = function(event) {
      var _a = _this.stateProvider,
        _b = _a.zoomOut,
        disabled = _b.disabled,
        step = _b.step,
        options = _a.options;
      var _c = _this.state,
        wrapperComponent = _c.wrapperComponent,
        contentComponent = _c.contentComponent;
      if (!event) throw Error("Zoom out function requires event prop");
      if (
        disabled ||
        options.disabled ||
        !wrapperComponent ||
        !contentComponent
      )
        return;
      handleZoomControls.call(_this, -1, step);
    };
    _this.handleDbClick = function(event) {
      var _a = _this.stateProvider,
        options = _a.options,
        _b = _a.doubleClick,
        disabled = _b.disabled,
        step = _b.step;
      var _c = _this.state,
        wrapperComponent = _c.wrapperComponent,
        contentComponent = _c.contentComponent;
      if (!event) throw Error("Double click function requires event prop");
      if (
        disabled ||
        options.disabled ||
        !wrapperComponent ||
        !contentComponent
      )
        return;
      handleDoubleClick.call(_this, event, 1, step);
    };
    _this.setScale = function(newScale, speed, type) {
      if (speed === void 0) {
        speed = 200;
      }
      if (type === void 0) {
        type = "easeOut";
      }
      var _a = _this.stateProvider,
        positionX = _a.positionX,
        positionY = _a.positionY,
        scale = _a.scale,
        disabled = _a.options.disabled;
      var _b = _this.state,
        wrapperComponent = _b.wrapperComponent,
        contentComponent = _b.contentComponent;
      if (disabled || !wrapperComponent || !contentComponent) return;
      var targetState = {
        positionX: positionX,
        positionY: positionY,
        scale: isNaN(newScale) ? scale : newScale
      };
      animateComponent.call(_this, {
        targetState: targetState,
        speed: speed,
        type: type
      });
    };
    _this.setPositionX = function(newPosX, speed, type) {
      if (speed === void 0) {
        speed = 200;
      }
      if (type === void 0) {
        type = "easeOut";
      }
      var _a = _this.stateProvider,
        positionX = _a.positionX,
        positionY = _a.positionY,
        scale = _a.scale,
        _b = _a.options,
        disabled = _b.disabled,
        transformEnabled = _b.transformEnabled;
      var _c = _this.state,
        wrapperComponent = _c.wrapperComponent,
        contentComponent = _c.contentComponent;
      if (
        disabled ||
        !transformEnabled ||
        !wrapperComponent ||
        !contentComponent
      )
        return;
      var targetState = {
        positionX: isNaN(newPosX) ? positionX : newPosX,
        positionY: positionY,
        scale: scale
      };
      animateComponent.call(_this, {
        targetState: targetState,
        speed: speed,
        type: type
      });
    };
    _this.setPositionY = function(newPosY, speed, type) {
      if (speed === void 0) {
        speed = 200;
      }
      if (type === void 0) {
        type = "easeOut";
      }
      var _a = _this.stateProvider,
        positionX = _a.positionX,
        scale = _a.scale,
        positionY = _a.positionY,
        _b = _a.options,
        disabled = _b.disabled,
        transformEnabled = _b.transformEnabled;
      var _c = _this.state,
        wrapperComponent = _c.wrapperComponent,
        contentComponent = _c.contentComponent;
      if (
        disabled ||
        !transformEnabled ||
        !wrapperComponent ||
        !contentComponent
      )
        return;
      var targetState = {
        positionX: positionX,
        positionY: isNaN(newPosY) ? positionY : newPosY,
        scale: scale
      };
      animateComponent.call(_this, {
        targetState: targetState,
        speed: speed,
        type: type
      });
    };
    _this.setTransform = function(newPosX, newPosY, newScale, speed, type) {
      if (speed === void 0) {
        speed = 200;
      }
      if (type === void 0) {
        type = "easeOut";
      }
      var _a = _this.stateProvider,
        positionX = _a.positionX,
        positionY = _a.positionY,
        scale = _a.scale,
        _b = _a.options,
        disabled = _b.disabled,
        transformEnabled = _b.transformEnabled;
      var _c = _this.state,
        wrapperComponent = _c.wrapperComponent,
        contentComponent = _c.contentComponent;
      if (
        disabled ||
        !transformEnabled ||
        !wrapperComponent ||
        !contentComponent
      )
        return;
      var targetState = {
        positionX: isNaN(newPosX) ? positionX : newPosX,
        positionY: isNaN(newPosY) ? positionY : newPosY,
        scale: isNaN(newScale) ? scale : newScale
      };
      animateComponent.call(_this, {
        targetState: targetState,
        speed: speed,
        type: type
      });
    };
    _this.resetTransform = function() {
      var _a = _this.stateProvider.options,
        disabled = _a.disabled,
        transformEnabled = _a.transformEnabled;
      if (disabled || !transformEnabled) return;
      resetTransformations.call(_this);
    };
    _this.setDefaultState = function() {
      _this.animation = null;
      _this.stateProvider = __assign(
        __assign(__assign({}, _this.stateProvider), {
          scale: initialState.scale,
          positionX: initialState.positionX,
          positionY: initialState.positionY
        }),
        _this.props.defaultValues
      );
      _this.forceUpdate();
    };
    //////////
    // Setters
    //////////
    _this.setWrapperComponent = function(wrapperComponent) {
      _this.setState({ wrapperComponent: wrapperComponent });
    };
    _this.setContentComponent = function(contentComponent) {
      _this.setState({ contentComponent: contentComponent }, function() {
        var _a = _this.stateProvider,
          wrapperComponent = _a.wrapperComponent,
          _b = _a.options,
          centerContent = _b.centerContent,
          limitToBounds = _b.limitToBounds,
          limitToWrapper = _b.limitToWrapper,
          scale = _a.scale;
        var _c = _this.props.defaultValues,
          positionX = _c.positionX,
          positionY = _c.positionY;
        if (
          (limitToBounds && !limitToWrapper) ||
          (centerContent && !positionX && !positionY)
        ) {
          var transform = "translate(25%, 25%) scale(" + scale + ")";
          contentComponent.style.transform = transform;
          contentComponent.style.WebkitTransform = transform;
          // force update to inject state to the context
          _this.forceUpdate();
          var startTime_1 = new Date().getTime();
          var maxTimeWait_1 = 2000;
          var interval_1 = setInterval(function() {
            if (wrapperComponent.offsetWidth) {
              var bounds = handleCalculateBounds.call(_this, scale, false);
              _this.stateProvider.positionX = bounds.minPositionX;
              _this.stateProvider.positionY = bounds.minPositionY;
              _this.applyTransformation(null, null, null);
              clearInterval(interval_1);
              interval_1 = null;
            } else if (new Date().getTime() - startTime_1 > maxTimeWait_1) {
              clearInterval(interval_1);
              interval_1 = null;
            }
          }, 20);
        } else {
          _this.applyTransformation(null, null, null);
        }
      });
    };
    _this.applyTransformation = function(newScale, posX, posY) {
      if (!_this.mounted) return;
      var contentComponent = _this.state.contentComponent;
      var onZoomChange = _this.props.onZoomChange;
      var _a = _this.stateProvider,
        previousScale = _a.previousScale,
        scale = _a.scale,
        positionX = _a.positionX,
        positionY = _a.positionY;
      if (!contentComponent)
        return console.error("There is no content component");
      var transform =
        "translate(" +
        (posX || positionX) +
        "px, " +
        (posY || positionY) +
        "px) scale(" +
        (newScale || scale) +
        ")";
      contentComponent.style.transform = transform;
      contentComponent.style.WebkitTransform = transform;
      // force update to inject state to the context
      _this.forceUpdate();
      if (onZoomChange && previousScale !== scale) {
        handleCallback(onZoomChange, _this.getCallbackProps());
      }
    };
    //////////
    // Props
    //////////
    _this.getCallbackProps = function() {
      return getValidPropsFromObject(_this.stateProvider);
    };
    return _this;
  }
  StateProvider.prototype.componentDidMount = function() {
    var passiveOption = makePassiveEventOption(false);
    // Panning on window to allow panning when mouse is out of wrapper
    window.addEventListener("mousemove", this.handlePanning, passiveOption);
  };
  StateProvider.prototype.componentWillUnmount = function() {
    var passiveOption = makePassiveEventOption(false);
    window.removeEventListener("mousemove", this.handlePanning, passiveOption);
    handleDisableAnimation.call(this);
  };
  StateProvider.prototype.componentDidUpdate = function(oldProps, oldState) {
    var _a = this.state,
      wrapperComponent = _a.wrapperComponent,
      contentComponent = _a.contentComponent;
    var dynamicValues = this.props.dynamicValues;
    if (!oldState.contentComponent && contentComponent) {
      this.stateProvider.contentComponent = contentComponent;
    }
    if (
      !oldState.wrapperComponent &&
      wrapperComponent &&
      wrapperComponent !== undefined
    ) {
      this.stateProvider.wrapperComponent = wrapperComponent;
      this.windowToWrapperScaleX = getWindowScaleX(wrapperComponent);
      this.windowToWrapperScaleY = getWindowScaleY(wrapperComponent);
      // Zooming events on wrapper
      var passiveOption = makePassiveEventOption(false);
      window.addEventListener("wheel", this.handleWheel, passiveOption);
      window.addEventListener("wheel", this.handleWheelPanning, passiveOption);
      window.addEventListener("dblclick", this.handleDbClick, passiveOption);
      window.addEventListener(
        "touchstart",
        this.handleTouchStart,
        passiveOption
      );
      window.addEventListener("touchmove", this.handleTouch, passiveOption);
      window.addEventListener("touchend", this.handleTouchStop, passiveOption);
    }
    // set bound for animations
    if (
      (wrapperComponent && contentComponent) ||
      oldProps.dynamicValues !== dynamicValues
    ) {
      this.maxBounds = handleCalculateBounds.call(
        this,
        this.stateProvider.scale,
        this.stateProvider.options.limitToWrapper
      );
    }
    // must be at the end of the update function, updates
    if (oldProps.dynamicValues && oldProps.dynamicValues !== dynamicValues) {
      this.animation = null;
      this.stateProvider = __assign(
        __assign({}, this.stateProvider),
        mergeProps(this.stateProvider, dynamicValues)
      );
      this.applyTransformation(null, null, null);
    }
  };
  StateProvider.prototype.render = function() {
    var _a = this.state,
      wrapperComponent = _a.wrapperComponent,
      contentComponent = _a.contentComponent;
    /**
     * Context provider value
     */
    var value = {
      loaded: Boolean(wrapperComponent && contentComponent),
      state: this.getCallbackProps(),
      dispatch: {
        setScale: this.setScale,
        setPositionX: this.setPositionX,
        setPositionY: this.setPositionY,
        zoomIn: this.zoomIn,
        zoomOut: this.zoomOut,
        setTransform: this.setTransform,
        resetTransform: this.resetTransform,
        setDefaultState: this.setDefaultState
      },
      nodes: {
        setWrapperComponent: this.setWrapperComponent,
        setContentComponent: this.setContentComponent
      }
    };
    var children = this.props.children;
    var content =
      typeof children === "function"
        ? children(__assign(__assign({}, value.state), value.dispatch))
        : children;
    return React__default.createElement(
      Context.Provider,
      { value: value },
      content
    );
  };
  return StateProvider;
})(React.Component);

var TransformWrapper = function(_a) {
  var children = _a.children,
    defaultPositionX = _a.defaultPositionX,
    defaultPositionY = _a.defaultPositionY,
    defaultScale = _a.defaultScale,
    onWheelStart = _a.onWheelStart,
    onWheel = _a.onWheel,
    onWheelStop = _a.onWheelStop,
    onPanningStart = _a.onPanningStart,
    onPanning = _a.onPanning,
    onPanningStop = _a.onPanningStop,
    onPinchingStart = _a.onPinchingStart,
    onPinching = _a.onPinching,
    onPinchingStop = _a.onPinchingStop,
    onZoomChange = _a.onZoomChange,
    rest = __rest(_a, [
      "children",
      "defaultPositionX",
      "defaultPositionY",
      "defaultScale",
      "onWheelStart",
      "onWheel",
      "onWheelStop",
      "onPanningStart",
      "onPanning",
      "onPanningStop",
      "onPinchingStart",
      "onPinching",
      "onPinchingStop",
      "onZoomChange"
    ]);
  var props = __assign({}, rest);
  if (props.options && props.options.limitToWrapper) {
    props.options.limitToBounds = true;
  }
  return React__default.createElement(
    StateProvider,
    {
      defaultValues: deleteUndefinedProps({
        positionX: defaultPositionX,
        positionY: defaultPositionY,
        scale: defaultScale
      }),
      dynamicValues: deleteUndefinedProps(getValidPropsFromObject(props)),
      onWheelStart: onWheelStart,
      onWheel: onWheel,
      onWheelStop: onWheelStop,
      onPanningStart: onPanningStart,
      onPanning: onPanning,
      onPanningStop: onPanningStop,
      onPinchingStart: onPinchingStart,
      onPinching: onPinching,
      onPinchingStop: onPinchingStop,
      onZoomChange: onZoomChange
    },
    children
  );
};

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === "undefined") {
    return;
  }

  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";

  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z =
  ".TransformComponent-module_container__3NwNd {\n  position: relative;\n  width: fit-content;\n  height: fit-content;\n  overflow: hidden;\n  -webkit-touch-callout: none; /* iOS Safari */\n  -webkit-user-select: none; /* Safari */\n  -khtml-user-select: none; /* Konqueror HTML */\n  -moz-user-select: none; /* Firefox */\n  -ms-user-select: none; /* Internet Explorer/Edge */\n  user-select: none;\n  margin: 0;\n  padding: 0;\n}\n.TransformComponent-module_content__TZU5O {\n  display: flex;\n  flex-wrap: wrap;\n  width: fit-content;\n  height: fit-content;\n  margin: 0;\n  padding: 0;\n  transform-origin: 0% 0%;\n}\n.TransformComponent-module_content__TZU5O img {\n  pointer-events: none;\n}\n";
var styles = {
  container: "TransformComponent-module_container__3NwNd",
  content: "TransformComponent-module_content__TZU5O"
};
styleInject(css_248z);

var TransformComponent = /** @class */ (function(_super) {
  __extends(TransformComponent, _super);
  function TransformComponent() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.wrapperRef = React__default.createRef();
    _this.contentRef = React__default.createRef();
    return _this;
  }
  TransformComponent.prototype.componentDidMount = function() {
    var nodes = this.context.nodes;
    nodes.setWrapperComponent(this.wrapperRef.current);
    nodes.setContentComponent(this.contentRef.current);
  };
  TransformComponent.prototype.render = function() {
    var children = this.props.children;
    var _a = this.context.state,
      positionX = _a.positionX,
      positionY = _a.positionY,
      scale = _a.scale,
      _b = _a.options,
      wrapperClass = _b.wrapperClass,
      contentClass = _b.contentClass;
    var style = {
      WebkitTransform:
        "translate(" +
        positionX +
        "px, " +
        positionY +
        "px) scale(" +
        scale +
        ")",
      transform:
        "translate(" +
        positionX +
        "px, " +
        positionY +
        "px) scale(" +
        scale +
        ")"
    };
    return React__default.createElement(
      "div",
      {
        ref: this.wrapperRef,
        className:
          "react-transform-component " + styles.container + " " + wrapperClass
      },
      React__default.createElement(
        "div",
        {
          ref: this.contentRef,
          className:
            "react-transform-element " + styles.content + " " + contentClass,
          style: style
        },
        children
      )
    );
  };
  return TransformComponent;
})(React__default.Component);
TransformComponent.contextType = Context;

exports.TransformComponent = TransformComponent;
exports.TransformWrapper = TransformWrapper;
//# sourceMappingURL=index.js.map
