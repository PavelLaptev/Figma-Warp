export declare function checkZoomBounds(
  zoom: any,
  minScale: any,
  maxScale: any,
  zoomPadding: any,
  enablePadding: any
): any;
export declare function checkPositionBounds(
  positionX: any,
  positionY: any,
  bounds: any,
  limitToBounds: any,
  paddingValue: any,
  wrapperComponent: any
): {
  x: number;
  y: number;
};
export declare function getDelta(event: any, customDelta: any): any;
export declare function wheelMousePosition(
  event: any,
  contentComponent: any,
  scale: any
): {
  mouseX: number;
  mouseY: number;
};
export declare function getComponentsSizes(
  wrapperComponent: any,
  contentComponent: any,
  newScale: any
): {
  wrapperWidth: any;
  wrapperHeight: any;
  newContentWidth: number;
  newDiffWidth: number;
  newContentHeight: number;
  newDiffHeight: number;
};
export declare function handleCalculatePositions(
  mouseX: any,
  mouseY: any,
  newScale: any,
  bounds: any,
  limitToBounds: any
):
  | void
  | {
      x: number;
      y: number;
    }
  | {
      newPositionX: any;
      newPositionY: any;
    };
