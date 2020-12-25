import React, { Component } from "react";
import {
  StateContextState,
  StateContextProps
} from "./interfaces/stateContextInterface";
declare const Context: React.Context<{}>;
declare class StateProvider extends Component<
  StateContextProps,
  StateContextState
> {
  mounted: boolean;
  state: {
    wrapperComponent: any;
    contentComponent: any;
  };
  stateProvider: {
    previousScale: number;
    scale: number;
    positionX: number;
    positionY: number;
    wrapperComponent: any;
    contentComponent: any;
    options: {
      disabled: boolean;
      transformEnabled: boolean;
      minPositionX: any;
      maxPositionX: any;
      minPositionY: any;
      maxPositionY: any;
      minScale: number;
      maxScale: number;
      limitToBounds: boolean;
      limitToWrapper: boolean;
      centerContent: boolean;
      wrapperClass: string;
      contentClass: string;
    };
    wheel: {
      disabled: boolean;
      step: number;
      wheelEnabled: boolean;
      touchPadEnabled: boolean;
      limitsOnWheel: boolean;
    };
    pan: {
      disabled: boolean;
      wheelEnabled: boolean;
      panAnimationType: string;
      lockAxisX: boolean;
      lockAxisY: boolean;
      velocity: boolean;
      velocityEqualToMove: boolean;
      velocitySensitivity: number;
      velocityActiveScale: number;
      velocityMinSpeed: number;
      velocityBaseTime: number;
      velocityAnimationType: string;
      padding: boolean;
      paddingSize: number;
      panReturnAnimationTime: number;
      panReturnAnimationType: string;
      disableOnTarget: any[];
    };
    pinch: {
      disabled: boolean;
    };
    zoomIn: {
      disabled: boolean;
      step: number;
      animation: boolean;
      animationType: string;
      animationTime: number;
    };
    zoomOut: {
      disabled: boolean;
      step: number;
      animation: boolean;
      animationType: string;
      animationTime: number;
    };
    doubleClick: {
      disabled: boolean;
      step: number;
      mode: string;
      animation: boolean;
      animationType: string;
      animationTime: number;
    };
    reset: {
      disabled: boolean;
      animation: boolean;
      animationType: string;
      animationTime: number;
    };
    scalePadding: {
      disabled: boolean;
      size: number;
      animationTime: number;
      animationType: string;
    };
  };
  windowToWrapperScaleX: number;
  windowToWrapperScaleY: number;
  startCoords: any;
  isDown: boolean;
  pinchStartDistance: any;
  lastDistance: any;
  pinchStartScale: any;
  distance: any;
  bounds: any;
  velocityTime: any;
  lastMousePosition: any;
  velocity: any;
  offsetX: any;
  offsetY: any;
  throttle: boolean;
  previousWheelEvent: any;
  lastScale: any;
  animate: any;
  animation: any;
  maxBounds: any;
  componentDidMount(): void;
  componentWillUnmount(): void;
  componentDidUpdate(oldProps: any, oldState: any): void;
  handleWheel: (event: any) => void;
  checkPanningTarget: (event: any) => any;
  checkIsPanningActive: (event: any) => boolean;
  handleSetUpPanning: (x: any, y: any) => void;
  handleStartPanning: (event: any) => void;
  handlePanning: (event: any) => void;
  handleStopPanning: () => void;
  handleWheelPanning: (event: any) => void;
  handlePinchStart: (event: any) => void;
  handlePinch: (event: any) => void;
  handlePinchStop: () => void;
  handleTouchStart: (event: any) => void;
  handleTouch: (event: any) => void;
  handleTouchStop: () => void;
  zoomIn: (event: any) => void;
  zoomOut: (event: any) => void;
  handleDbClick: (event: any) => void;
  setScale: (newScale: any, speed?: number, type?: string) => void;
  setPositionX: (newPosX: any, speed?: number, type?: string) => void;
  setPositionY: (newPosY: any, speed?: number, type?: string) => void;
  setTransform: (
    newPosX: any,
    newPosY: any,
    newScale: any,
    speed?: number,
    type?: string
  ) => void;
  resetTransform: () => void;
  setDefaultState: () => void;
  setWrapperComponent: (wrapperComponent: any) => void;
  setContentComponent: (contentComponent: any) => void;
  applyTransformation: (newScale: any, posX: any, posY: any) => void;
  getCallbackProps: () => {};
  render(): JSX.Element;
}
export { Context, StateProvider };
