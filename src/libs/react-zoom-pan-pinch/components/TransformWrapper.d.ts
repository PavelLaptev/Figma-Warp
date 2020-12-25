/// <reference types="react" />
import { PropsList } from "../store/interfaces/propsInterface";
declare const TransformWrapper: ({
  children,
  defaultPositionX,
  defaultPositionY,
  defaultScale,
  onWheelStart,
  onWheel,
  onWheelStop,
  onPanningStart,
  onPanning,
  onPanningStop,
  onPinchingStart,
  onPinching,
  onPinchingStop,
  onZoomChange,
  ...rest
}: PropsList) => JSX.Element;
export { TransformWrapper };
