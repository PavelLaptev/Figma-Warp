import * as React from "react";
import styles from "./app.module.scss";
import {
  TransformWrapper,
  TransformComponent
} from "../libs/react-zoom-pan-pinch";
import Warp from "warpjs";
import {
  getRatioSize,
  createPointsArray,
  warpIt,
  warpReposition
} from "../utils";
import ControlDot from "./components/ControlDot";

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
        warp.interpolate(4);

        warpIt(warp, SVGfromFigma.points);

        warpReposition([], SVGfromFigma.points);

        // console.log(SVGfromFigma.points);

        /////////////////////////////////

        // SVGControlContainerRef.current
        //   .getElementsByTagName("circle")
        //   .map(item => {});

        // let circllesCollection = SVGControlContainerRef.current.getElementsByTagName(
        //   "circle"
        // );

        // for (let item of circllesCollection) {
        //   item.transform.baseVal[0].matrix.e = 0;
        //   item.transform.baseVal[0].matrix.f = 0;
        // }
      }
    };
  }, [SVGfromFigma]);

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  console.log(SVGfromFigma);

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
              {SVGfromFigma.points.map((item, i) => {
                return (
                  <ControlDot
                    SVGKey={SVGfromFigma.htmlString}
                    key={`dot-${i}`}
                    position={{ x: item[0], y: item[1] }}
                  />
                );
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
