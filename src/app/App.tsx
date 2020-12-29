import * as React from "react";
import styles from "./app.module.scss";
import placeholderSVG from "./assets/placeholderSVG";
import Warp from "warpjs";
import {
  createPointsArray,
  warpIt,
  warpReposition,
  updateControlPath
} from "../utils";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import ControlDot from "./components/ControlDot";
import Range from "./components/Range";
import shortid from "shortid";

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
  const [appKey, setAppKey] = React.useState(shortid.generate());
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
        setAppKey(shortid.generate());

        const isSelectedVectorShape = () => {
          if (event.data.pluginMessage.event === "error") {
            return placeholderSVG;
          } else {
            return event.data.pluginMessage.data;
          }
        };

        // Convert sttring to SVG DOM
        let SVGData = new DOMParser()
          .parseFromString(isSelectedVectorShape(), "image/svg+xml")
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
          points: createPointsArray(
            SVGData.width.baseVal.value,
            SVGData.height.baseVal.value,
            Number(complexity)
          )
        });

        /////////////////////////////////

        const warp = new Warp(SVGElementRef.current);
        warp.interpolate(500);

        warpIt(warp, points);
        warpReposition(warp, points);
        updateControlPath(SVGControlPath, points);

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
              updateControlPath(SVGControlPath, points);
            }
          });
        });
        //////////////////////////////////////////
        // if (event.data.pluginMessage.event === "complexity") {
        //   console.log("initialSVG");
        // }
      }
    };
  }, [SVGfromFigma, complexity]);

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  // console.log(SVGfromFigma);
  const handleComplexity = e => {
    setAppKey(shortid.generate());
    setComplexity(e.target.value);
    parent.postMessage(
      { pluginMessage: { type: "complexity", data: e.target.value } },
      "*"
    );
  };

  ////////////////////////////////////////////////////////////////
  //////////////////////////// RENDER ////////////////////////////
  ////////////////////////////////////////////////////////////////
  return (
    <div className={styles.app} key={appKey}>
      <section className={styles.ui}>
        <Range value={complexity} onChange={handleComplexity} />
      </section>
      <section className={styles.view}>
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
    </div>
  );
};

export default App;
