import * as React from "react";
import PanZoomprovider from "./PanZoomProvider";

interface Props {
  children?: any;
  panSpeedRatio?: number;
}

interface RefObject {
  getScale: (val) => void;
}

const round = (num, decimalPlaces = 0) => {
  let p = Math.pow(10, decimalPlaces);
  let m = num * p * (1 + Number.EPSILON);
  return Math.round(m) / p;
};

const PanZoom = React.forwardRef((props: Props, ref: React.Ref<RefObject>) => {
  const [spacePressed, setSpacePressed] = React.useState(false);
  const [mouseKeyIsDown, setMouseKeyIsDown] = React.useState(false);
  const [transform, setTransform] = React.useState({ scale: 1, x: 0, y: 0 });

  React.useImperativeHandle(ref, () => ({
    getScale() {
      return transform.scale;
    }
  }));

  // HANDLE ON MOUSE WHEEL (FOR TOUCHBAR)
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
    if (e.ctrlKey) {
      if (transform.scale > 0.4 && transform.scale < 2) {
        setTransform(prevState => ({
          ...transform,
          scale: round(prevState.scale - e.deltaY / 100, 3)
        }));
      } else if (transform.scale <= 0.4) {
        setTransform({
          ...transform,
          scale: 0.41
        });
      } else if (transform.scale >= 2) {
        setTransform({
          ...transform,
          scale: 1.95
        });
      }
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
  const handleOnKeyDown = (e: any) => {
    if (e.keyCode === 32) {
      setSpacePressed(true);
    }
  };

  const handleOnKeyUp = () => {
    setSpacePressed(false);
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
    document.addEventListener("keydown", handleOnKeyDown, false);
    document.addEventListener("keyup", handleOnKeyUp, false);
    document.addEventListener("mousedown", handleOnKeyMouseDown, false);
    document.addEventListener("mouseup", handleOnKeyMouseUp, false);

    return () => {
      document.removeEventListener("keydown", handleOnKeyDown, false);
      document.removeEventListener("keyup", handleOnKeyUp, false);
      document.removeEventListener("mousedown", handleOnKeyMouseDown, false);
      document.removeEventListener("mouseup", handleOnKeyMouseUp, false);
    };
  });

  return (
    <PanZoomprovider.Provider value={transform.scale}>
      <div
        id="pan-zoom-wrapper"
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          // background: "rgba(0,0,0,0.1)",
          width: "100%",
          height: "100%"
        }}
        onWheel={handleOnWheel}
        onMouseMove={handleOnMouseMove}
      >
        <div
          ref={ref as any}
          id="pan-zoom-element"
          data-scale={transform.scale}
          data-pos-x={transform.x}
          data-pos-y={transform.y}
          style={{
            // border: "3px solid #0044ff",
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
  panSpeedRatio: 1.4
} as Partial<Props>;

export default PanZoom;
