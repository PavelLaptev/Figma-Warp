import * as React from "react";
import PanZoomprovider from "./PanZoomProvider";

interface Props {
  children?: any;
  panSpeedRatio?: number;
  zoomFactor?: {
    max: number;
    min: number;
  };
  test?: boolean;
  zoomScale?: number;
}

interface RefObject {
  getScale: (val) => void;
}

const tetsModeStyles = {
  wrapper: {
    background: "rgba(0,0,0,0.1)"
  },
  container: {
    border: "3px solid #0044ff"
  }
};

const PanZoom = React.forwardRef((props: Props, ref: React.Ref<RefObject>) => {
  const [spacePressed, setSpacePressed] = React.useState(false);
  const [mouseKeyIsDown, setMouseKeyIsDown] = React.useState(false);
  const [transform, setTransform] = React.useState({
    scale: props.zoomScale,
    x: 0,
    y: 0
  });

  const returnZoomMinOrMax = () => {
    let correctionIndex = 0.05;
    if (transform.scale < props.zoomFactor.min) {
      setTransform({
        ...transform,
        scale: props.zoomFactor.min + correctionIndex
      });
    }
    if (transform.scale > props.zoomFactor.max) {
      setTransform({
        ...transform,
        scale: props.zoomFactor.max - correctionIndex
      });
    }
  };

  React.useImperativeHandle(ref, () => ({
    getScale() {
      return transform.scale;
    }
  }));

  const handleOnWheel = (e: any) => {
    // DETECT PAN
    if (e.deltaX !== 0 || e.deltaY !== 0) {
      setTransform(prevState => ({
        ...transform,
        x: prevState.x - e.deltaX / props.panSpeedRatio,
        y: prevState.y - e.deltaY / props.panSpeedRatio
      }));
    }

    // DETECT PINCH
    if (e.ctrlKey || e.metaKey) {
      setTransform(prevState => ({
        ...transform,
        scale: prevState.scale - e.deltaY / 100
      }));
      returnZoomMinOrMax();
    }
  };

  // ON MOUSE MOVE
  const handleOnMouseMove = (e: any) => {
    if (spacePressed && mouseKeyIsDown) {
      if (e.movementX !== 0 || e.movementY > 0) {
        setTransform(prevState => ({
          ...transform,
          x: prevState.x + e.movementX / props.panSpeedRatio,
          y: prevState.y + e.movementY / props.panSpeedRatio
        }));
      }
    }
  };

  // ON SPACE PRESSED
  const handleOnKeyDown = e => {
    // IF SPACE PRESSED
    if (e.keyCode === 32) {
      setSpacePressed(true);
    }

    // PLUS/MINUS KEYS
    let zoomIndex = 0.5;

    // IF MINUS PRESSED
    if (
      e.keyCode === 189 &&
      transform.scale > props.zoomFactor.min &&
      transform.scale < props.zoomFactor.max
    ) {
      setTransform(prevState => ({
        ...transform,
        scale: prevState.scale - zoomIndex
      }));
    }

    // IF PLUS PRESSED
    if (
      e.keyCode === 187 &&
      transform.scale > props.zoomFactor.min &&
      transform.scale < props.zoomFactor.max
    ) {
      setTransform(prevState => ({
        ...transform,
        scale: prevState.scale + zoomIndex
      }));
    }

    // IF ZERO PRESSED
    if (e.keyCode === 48) {
      setTransform({
        x: 0,
        y: 0,
        scale: 1
      });
    }
  };

  const handleOnKeyUp = () => {
    setSpacePressed(false);
    returnZoomMinOrMax();
  };

  // ON MOUSE PRESSED
  const handleOnKeyMouseDown = (e: any) => {
    if (e.which === 1) {
      setMouseKeyIsDown(true);
    }
  };

  const handleOnKeyMouseUp = (e: any) => {
    if (e.which === 1) {
      setMouseKeyIsDown(false);
    }
  };

  // USE EFFECT
  React.useEffect(() => {
    document.addEventListener("mousedown", handleOnKeyMouseDown, false);
    document.addEventListener("mouseup", handleOnKeyMouseUp, false);

    return () => {
      document.removeEventListener("mousedown", handleOnKeyMouseDown, false);
      document.removeEventListener("mouseup", handleOnKeyMouseUp, false);
    };
  });

  return (
    <PanZoomprovider.Provider value={transform.scale}>
      <div
        id="pan-zoom-wrapper"
        style={{
          ...(props.test ? tetsModeStyles.wrapper : {}),
          outline: "none",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--canvas-clr)",
          width: "100%",
          height: "100%",
          cursor: spacePressed ? "grab" : "auto"
        }}
        onWheel={handleOnWheel}
        onMouseMove={handleOnMouseMove}
        onKeyDown={handleOnKeyDown}
        onKeyUp={handleOnKeyUp}
        tabIndex={0}
      >
        <div
          ref={ref as any}
          id="pan-zoom-element"
          data-scale={transform.scale}
          data-pos-x={transform.x}
          data-pos-y={transform.y}
          style={{
            ...(props.test ? tetsModeStyles.container : {}),
            width: "fit-content",
            height: "fit-content",
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
          }}
        >
          {props.children}
        </div>
      </div>
    </PanZoomprovider.Provider>
  );
});

PanZoom.defaultProps = {
  panSpeedRatio: 1.4,
  test: false,
  zoomScale: 1,
  zoomFactor: {
    max: 3,
    min: 0.3
  }
} as Partial<Props>;

export default PanZoom;
