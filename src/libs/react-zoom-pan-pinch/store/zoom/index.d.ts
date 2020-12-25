export declare function handleCalculateBounds(
  newScale: any,
  limitToWrapper: any
): {
  minPositionX: number;
  maxPositionX: number;
  minPositionY: number;
  maxPositionY: number;
};
/**
 * Wheel zoom event
 */
export declare function handleWheelZoom(event: any): void;
/**
 * Zoom for animations
 */
export declare function handleZoomToPoint(
  isDisabled: any,
  scale: any,
  mouseX: any,
  mouseY: any,
  event: any
): {
  scale: any;
  positionX: any;
  positionY: any;
};
export declare function handlePaddingAnimation(): void;
/**
 * Button zoom events
 */
export declare function handleDoubleClick(event: any): any;
export declare function handleZoomControls(
  customDelta: any,
  customStep: any
): void;
export declare function resetTransformations(animationSpeed: any): void;
