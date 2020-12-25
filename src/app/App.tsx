import * as React from "react";
import styles from "./app.module.scss";
import {
  TransformWrapper,
  TransformComponent
} from "../libs/react-zoom-pan-pinch";
import { getRatioSize, createPointsArray } from "../utils";
import Warp from "warpjs";
import ControlPointEl from "./components/ControlPointEl";

const drawControlElements = pointsArray => {
  return pointsArray.map((item, i) => {
    return (
      <ControlPointEl
        key={`point-${i}`}
        position={{ x: item[0], y: item[1] }}
      />
    );
  });
};

const initWarp = (SVG, complexity, setState) => {
  if (SVG) {
    const warp = new Warp(SVG);
    warp.interpolate(4);

    let pointsPosition = createPointsArray(
      SVG.width.baseVal.value,
      SVG.height.baseVal.value,
      Number(complexity)
    );

    // console.log(pointsPosition);
    setState(drawControlElements(pointsPosition));

    return new XMLSerializer().serializeToString(warp.element);
  }
  return;
};

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
  const [controlElements, setControlElements] = React.useState([]);
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
      }
    };

    initWarp(SVGElementRef.current, complexity, setControlElements);
  }, [SVGfromFigma]);

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  // console.log(controlElements);

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
