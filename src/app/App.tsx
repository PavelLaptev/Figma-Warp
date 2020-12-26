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

// Application
const App = ({}) => {
  ////////////////////////////////////////////////////////////////
  //////////////////////////// REFS ////////////////////////////
  ///////////////////////////////////////////////////////////////
  const SVGContainerRef = React.useRef(null);
  const SVGControlContainerRef = React.useRef(null);
  const SVGElementRef = React.useRef(null);
  const SVGControlPath = React.useRef(null);

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

  const [complexity, setComplexity] = React.useState(2);
  const [resetState, setReset] = React.useState(false);

  ////////////////////////////////////////////////////////////////
  ////////////////////////// USE EFFECT //////////////////////////
  ///////////////////////////////////////////////////////////////
  React.useEffect(() => {
    // Check if we recieve Figma's SVG

    onmessage = event => {
      if (event.data.pluginMessage.type === "svg-from-figma") {
        SVGControlContainerRef.current.innerHTML = "";
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

        ///////////////////////////////////

        setSVGfromFigma({
          htmlString: SVGData.innerHTML,
          viewbox: `0 0 ${SVGData.viewBox.baseVal.width} ${SVGData.viewBox.baseVal.height}`,
          currentSize: {
            width: SVGData.width.baseVal.value,
            height: SVGData.height.baseVal.value
          },
          newSize: {
            width: SVGData.width.baseVal.value,
            height: SVGData.height.baseVal.value
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

        // Draw control shape
        const drawControlShape = (
          element = SVGControlContainerRef.current,
          V = pointsPosition
        ) => {
          const controlPath = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          controlPath.setAttributeNS(null, "class", styles.SVG_path);

          const path = [`M${V[0][0]} ${V[0][1]}`];

          for (let i = 1; i < V.length; i++) {
            path.push(`L${V[i][0]} ${V[i][1]}`);
          }

          path.push("Z");
          controlPath.setAttribute("d", path.join(""));
          element.appendChild(controlPath);
        };

        // Draw control point
        const drawPoint = (element, pos = { x: 0, y: 0 }, index) => {
          const point = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          point.setAttributeNS(null, "class", styles.SVG_controlItem);
          point.setAttributeNS(null, "cx", `${pos.x}`);
          point.setAttributeNS(null, "cy", `${pos.y}`);
          point.setAttributeNS(null, "r", "20");

          element.appendChild(point);

          Draggable.create(point, {
            type: "x,y",
            onDrag: function() {
              SVGControlContainerRef.current.innerHTML = "";
              const relativeX =
                this.pointerX -
                SVGContainerRef.current.getBoundingClientRect().left;
              const relativeY =
                this.pointerY -
                SVGContainerRef.current.getBoundingClientRect().top;
              drawControlShape();
              drawControlPoints();
              pointsPosition[index] = [relativeX, relativeY];
              warp.transform(reposition);
            }
          });
        };

        // Draw points
        const drawControlPoints = (
          element = SVGControlContainerRef.current,

          V = pointsPosition
        ) => {
          V.map((i, index) => {
            drawPoint(element, { x: i[0], y: i[1] }, index);
            return null;
          });
        };

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

        drawControlShape();
        drawControlPoints();
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
            <svg
              className={styles.SVG_controls}
              id="svg-control"
              ref={SVGControlContainerRef}
            >
              <path
                ref={SVGControlPath}
                id="control-path"
                className={styles.SVG_path}
              />
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
