import * as React from "react";
import styles from "./app.module.scss";
import {
  TransformWrapper,
  TransformComponent
} from "../libs/react-zoom-pan-pinch";
import { getRatioSize, createPointsArray } from "../utils";
import Warp from "warpjs";
import { gsap, TweenLite } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const ControlElement = props => {
  // console.log(props.resetState);
  const controlRef = React.useRef(null);

  React.useEffect(() => {
    Draggable.create(controlRef.current, {
      type: "x,y",
      onDrag: () => {
        console.log(props.warp);
        props.warp.transform(reposition);
      }
    });
  });

  if (props.resetState) {
    console.log(true);
    TweenLite.set(controlRef.current, { x: 0, y: 0 });
  }

  return (
    <circle
      ref={controlRef}
      className={props.className}
      cx={props.x}
      cy={props.y}
      r="20"
    />
  );
};

const drawControlElements = (pointsArray, resetState, warp) => {
  return pointsArray.map((item, i) => {
    return (
      <ControlElement
        key={`controlEl-${i}`}
        className={styles.SVG_controlItem}
        x={item[0]}
        y={item[1]}
        resetState={resetState}
        warp={warp}
      />
    );
  });
};

//////////////////////////////////////////////

// const initWarp = (SVG, complexity, setControlElements, resetState) => {
//   if (SVG) {
//     const warp = new Warp(SVG);
//     warp.interpolate(4);

//     let pointsPosition = createPointsArray(
//       SVG.width.baseVal.value,
//       SVG.height.baseVal.value,
//       Number(complexity)
//     );

//     setControlElements(drawControlElements(pointsPosition, resetState, warp));

//     warp.transform(function(v0, V = pointsPosition) {
//       const A = [];
//       const W = [];
//       const L = [];

//       // Find angles
//       for (let i = 0; i < V.length; i++) {
//         const j = (i + 1) % V.length;

//         const vi = V[i];
//         const vj = V[j];

//         const r0i = Math.sqrt((v0[0] - vi[0]) ** 2 + (v0[1] - vi[1]) ** 2);
//         const r0j = Math.sqrt((v0[0] - vj[0]) ** 2 + (v0[1] - vj[1]) ** 2);
//         const rij = Math.sqrt((vi[0] - vj[0]) ** 2 + (vi[1] - vj[1]) ** 2);

//         const dn = 2 * r0i * r0j;
//         const r = (r0i ** 2 + r0j ** 2 - rij ** 2) / dn;

//         A[i] = isNaN(r) ? 0 : Math.acos(Math.max(-1, Math.min(r, 1)));
//       }

//       // Find weights
//       for (let j = 0; j < V.length; j++) {
//         const i = (j > 0 ? j : V.length) - 1;

//         // const vi = V[i];
//         const vj = V[j];

//         const r = Math.sqrt((vj[0] - v0[0]) ** 2 + (vj[1] - v0[1]) ** 2);

//         W[j] = (Math.tan(A[i] / 2) + Math.tan(A[j] / 2)) / r;
//       }

//       // Normalise weights
//       const Ws = W.reduce((a, b) => a + b, 0);
//       for (let i = 0; i < V.length; i++) {
//         L[i] = W[i] / Ws;
//       }

//       // Save weights to the point for use when transforming
//       return [...v0, ...L];
//     });

//     // Warp function
//     function reposition([x, y, ...W], V = pointsPosition) {
//       let nx = 0;
//       let ny = 0;

//       // Recreate the points using mean value coordinates
//       for (let i = 0; i < V.length; i++) {
//         nx += W[i] * V[i][0];
//         ny += W[i] * V[i][1];
//       }

//       return [nx, ny, ...W];
//     }

//     warp.transform(reposition);
//   }
//   return;
// };

// Application
const App = ({}) => {
  ////////////////////////////////////////////////////////////////
  //////////////////////////// REFS ////////////////////////////
  ///////////////////////////////////////////////////////////////
  const SVGContainerRef = React.useRef(null);
  const SVGElementRef = React.useRef(null);

  ////////////////////////////////////////////////////////////////
  //////////////////////////// STATES ////////////////////////////
  ///////////////////////////////////////////////////////////////
  const [SVGfromFigma, setSVGfromFigma] = React.useState({
    htmlString: null as any,
    viewbox: "0 0 0 0" as string,
    currentSize: {
      width: 0 as number,
      height: 0 as number
    },
    newSize: {
      width: 0 as number,
      height: 0 as number
    }
  });
  const [newSVG, setNewSVG] = React.useState(null);
  const [controlElements, setControlElements] = React.useState([]);
  const [complexity, setComplexity] = React.useState(2);
  const [resetState, setReset] = React.useState(false);

  ////////////////////////////////////////////////////////////////
  ////////////////////////// USE EFFECT //////////////////////////
  ///////////////////////////////////////////////////////////////
  React.useEffect(() => {
    // Check if we recieve Figma's SVG

    onmessage = event => {
      if (event.data.pluginMessage.type === "svg-from-figma") {
        setReset(true);
        // Convert sttring to SVG DOM
        let SVGData = new DOMParser()
          .parseFromString(event.data.pluginMessage.data, "image/svg+xml")
          .getElementsByTagName("svg")[0];

        let newSVGSize = getRatioSize(
          SVGData.width.baseVal.value,
          SVGData.height.baseVal.value,
          500,
          400
        );

        console.log(newSVGSize);

        setSVGfromFigma({
          htmlString: SVGData.innerHTML,
          viewbox: `0 0 ${SVGData.viewBox.baseVal.width} ${SVGData.viewBox.baseVal.height}`,
          currentSize: {
            width: SVGData.width.baseVal.value,
            height: SVGData.height.baseVal.value
          },
          newSize: {
            width: newSVGSize.width,
            height: newSVGSize.height
          }
        });

        /////////////////////////////////

        const warp = new Warp(SVGElementRef.current);
        warp.interpolate(4);

        let pointsPosition = createPointsArray(
          SVGElementRef.current.width.baseVal.value,
          SVGElementRef.current.height.baseVal.value,
          Number(complexity)
        );

        setControlElements(
          drawControlElements(pointsPosition, resetState, warp)
        );

        warp.transform(function(v0, V = pointsPosition) {
          const A = [];
          const W = [];
          const L = [];

          // Find angles
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

          // Find weights
          for (let j = 0; j < V.length; j++) {
            const i = (j > 0 ? j : V.length) - 1;

            // const vi = V[i];
            const vj = V[j];

            const r = Math.sqrt((vj[0] - v0[0]) ** 2 + (vj[1] - v0[1]) ** 2);

            W[j] = (Math.tan(A[i] / 2) + Math.tan(A[j] / 2)) / r;
          }

          // Normalise weights
          const Ws = W.reduce((a, b) => a + b, 0);
          for (let i = 0; i < V.length; i++) {
            L[i] = W[i] / Ws;
          }

          // Save weights to the point for use when transforming
          return [...v0, ...L];
        });

        // Warp function
        function reposition([x, y, ...W], V = pointsPosition) {
          let nx = 0;
          let ny = 0;

          // Recreate the points using mean value coordinates
          for (let i = 0; i < V.length; i++) {
            nx += W[i] * V[i][0];
            ny += W[i] * V[i][1];
          }

          return [nx, ny, ...W];
        }

        warp.transform(reposition);
      }
    };
  }, [SVGfromFigma, resetState]);

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  // console.log(controlElements);
  // setReset(false);

  ////////////////////////////////////////////////////////////////
  //////////////////////////// RENDER ////////////////////////////
  ////////////////////////////////////////////////////////////////
  return (
    <section className={styles.app}>
      <TransformWrapper
        wheel={{ wheelEnabled: false }}
        options={{ limitToBounds: false, minScale: 0.4, maxScale: 2 }}
        pan={{ wheelEnabled: true }}
      >
        <TransformComponent>
          <div
            className={styles.SVG_wrapper}
            ref={SVGContainerRef}
            style={{
              width: `${SVGfromFigma.newSize.width}px`,
              height: `${SVGfromFigma.newSize.height}px`
            }}
          >
            <svg className={styles.SVG_controls} id="svg-control">
              <path id="control-path" />
              {controlElements.map(item => {
                return item;
              })}
            </svg>
            <svg
              className={styles.SVG_container}
              viewBox={SVGfromFigma.viewbox}
              ref={SVGElementRef}
              dangerouslySetInnerHTML={{ __html: SVGfromFigma.htmlString }}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </section>
  );
};

export default App;
