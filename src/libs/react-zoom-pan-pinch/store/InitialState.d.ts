export declare const initialState: {
  wrapperComponent: any;
  contentComponent: any;
  previousScale: number;
  scale: number;
  positionX: number;
  positionY: number;
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
