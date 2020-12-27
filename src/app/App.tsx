import * as React from "react";
import styles from "./app.module.scss";
import Warp from "warpjs";
import { createPointsArray, warpIt, warpReposition } from "../utils";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import ControlDot from "./components/ControlDot";

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
  const SVGControlDots = React.useRef(null);

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
    points: []
  });

  const [complexity, setComplexity] = React.useState(2);

  ////////////////////////////////////////////////////////////////
  ////////////////////////// USE EFFECT //////////////////////////
  ///////////////////////////////////////////////////////////////
  React.useEffect(() => {
    // Check if we recieve Figma's SVG

    onmessage = event => {
      if (event.data.pluginMessage.type === "svg-from-figma") {
        // Convert sttring to SVG DOM
        let SVGData = new DOMParser()
          .parseFromString(event.data.pluginMessage.data, "image/svg+xml")
          .getElementsByTagName("svg")[0];

        ///////////////////////////////////

        let points = createPointsArray(
          SVGData.width.baseVal.value,
          SVGData.height.baseVal.value,
          Number(complexity)
        );

        setSVGfromFigma({
          htmlString: SVGData.innerHTML,
          viewbox: `0 0 ${SVGData.viewBox.baseVal.width} ${SVGData.viewBox.baseVal.height}`,
          currentSize: {
            width: SVGData.width.baseVal.value,
            height: SVGData.height.baseVal.value
          },
          points: points
        });

        /////////////////////////////////

        const warp = new Warp(SVGElementRef.current);
        warp.interpolate(2);

        warpIt(warp, points);
        warpReposition(warp, points);

        [...SVGControlDots.current.childNodes].map((item, i) => {
          Draggable.create(item, {
            type: "x,y",
            onDrag: function() {
              let relativeX =
                this.pointerX -
                SVGContainerRef.current.getBoundingClientRect().left;
              let relativeY =
                this.pointerY -
                SVGContainerRef.current.getBoundingClientRect().top;
              points[i] = [relativeX, relativeY];
              warpReposition(warp, points);
            }
          });
        });

        //////////////////////////////////////////
      }
    };
  }, [SVGfromFigma]);

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  console.log(SVGfromFigma);

  const createNewPath = points => {
    let path = [`M${points[0][0]} ${points[0][1]}`];

    for (let i = 1; i < points.length; i++) {
      path.push(`L${points[i][0]} ${points[i][1]}`);
    }

    path.push("Z");
    return path;
  };

  ////////////////////////////////////////////////////////////////
  //////////////////////////// RENDER ////////////////////////////
  ////////////////////////////////////////////////////////////////
  return (
    <section className={styles.app}>
      <div
        className={styles.SVG_wrapper}
        ref={SVGContainerRef}
        style={{
          width: `${SVGfromFigma.currentSize.width}px`,
          height: `${SVGfromFigma.currentSize.height}px`
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
          <g ref={SVGControlDots}>
            {SVGfromFigma.points.map((item, i) => {
              return (
                <ControlDot
                  SVGKey={SVGfromFigma.htmlString}
                  key={`dot-${i}`}
                  position={{ x: item[0], y: item[1] }}
                />
              );
            })}
          </g>
        </svg>
        <svg
          className={styles.SVG_container}
          viewBox={SVGfromFigma.viewbox}
          ref={SVGElementRef}
          dangerouslySetInnerHTML={{ __html: SVGfromFigma.htmlString }}
        />
      </div>
    </section>
  );
};

export default App;
