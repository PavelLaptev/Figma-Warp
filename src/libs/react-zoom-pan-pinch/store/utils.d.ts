/**
 * Rounds number to given decimal
 * eg. roundNumber(2.34343, 1) => 2.3
 */
export declare const roundNumber: (num: any, decimal: any) => number;
/**
 * Checks if value is number, if not it returns default value
 * 1# eg. checkIsNumber(2, 30) => 2
 * 2# eg. checkIsNumber(null, 30) => 30
 */
export declare const checkIsNumber: (num: any, defaultValue: any) => any;
/**
 * Keeps value between given bounds, used for limiting view to given boundaries
 * 1# eg. boundLimiter(2, 0, 3, true) => 2
 * 2# eg. boundLimiter(4, 0, 3, true) => 3
 * 3# eg. boundLimiter(-2, 0, 3, true) => 0
 * 4# eg. boundLimiter(10, 0, 3, false) => 10
 */
export declare const boundLimiter: (
  value: any,
  minBound: any,
  maxBound: any,
  isActive: any
) => number;
/**
 * Returns relative coords of mouse on wrapper element, and provides
 * info about it's width, height, with same info about its content(zoomed component) element
 */
export declare const relativeCoords: (
  event: any,
  wrapperComponent: any,
  contentComponent: any,
  panningCase: any
) => {
  x: any;
  y: any;
  wrapperWidth: any;
  wrapperHeight: any;
  contentWidth: any;
  contentHeight: any;
  diffHeight: number;
  diffWidth: number;
  contentLeft: any;
  contentRight: any;
};
/**
 * Calculate bounding area of zoomed/panned element
 */
export declare const calculateBoundingArea: (
  wrapperWidth: any,
  newContentWidth: any,
  diffWidth: any,
  wrapperHeight: any,
  newContentHeight: any,
  diffHeight: any,
  limitToWrapper: any
) => {
  minPositionX: number;
  maxPositionX: number;
  minPositionY: number;
  maxPositionY: number;
};
/**
 * Returns middle coordinates x,y of two points
 * Used to get middle point of two fingers pinch
 */
export declare const getMiddleCoords: (
  firstPoint: any,
  secondPoint: any,
  contentComponent: any,
  scale: any
) => {
  x: number;
  y: number;
};
/**
 * Returns middle position of PageX for touch events
 */
export declare const getMidPagePosition: (
  firstPoint: any,
  secondPoint: any
) => void | {
  x: number;
  y: number;
};
/**
 * Returns distance between two points x,y
 */
export declare const getDistance: (firstPoint: any, secondPoint: any) => number;
/**
 * Delete undefined values from object keys
 * Used for deleting empty props
 */
export declare const deleteUndefinedProps: (value: any) => any;
/**
 * Returns center zoom position, for computations, based on the relative center to content node
 */
export declare const getRelativeZoomCoords: ({
  wrapperComponent,
  contentComponent,
  scale,
  positionX,
  positionY
}: {
  wrapperComponent: any;
  contentComponent: any;
  scale: any;
  positionX: any;
  positionY: any;
}) => {
  x: number;
  y: number;
};
/**
 * Fire callback if it's function
 */
export declare const handleCallback: (callback: any, props: any) => void;
export declare const handleWheelStop: (
  previousEvent: any,
  event: any,
  stateProvider: any
) => boolean;
export declare const mergeProps: (initialState: any, dynamicProps: any) => {};
export declare function getWindowScaleY(wrapper: any): number;
export declare function getWindowScaleX(wrapper: any): number;
