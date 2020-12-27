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
        warp.interpolate(4);

        warpIt(warp, points);
        warpReposition(warp, points);

        const doOnMove = (e, i) => {
          const relativeX = e.pageX - e.target.cx.baseVal.value;
          const relativeY = e.pageY - e.target.cy.baseVal.value;
          // console.log(
          //   e.pageX - e.target.getBoundingClientRect().left,
          //   e.pageY - e.target.getBoundingClientRect().top
          // );
          points[i] = [relativeX, relativeY];
          console.log(points[i]);
          warpReposition(warp, points);
        };

        console.log(SVGControlDots.current.childNodes);
        [...SVGControlDots.current.childNodes].map((item, i) => {
          // console.log(item);
          item.addEventListener("mousemove", e => doOnMove(e, i), false);
        });
        // SVGControlContainerRef.current.children.map(item => {
        //   console.log(item);
        // });

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

  // const updatePointPosition = (e, i) => {
  //   console.log(e.target.getBoundingClientRect().left, i);
  //   // console.log(SVGfromFigma.points);
  //   // setSVGfromFigma({
  //   //   ...SVGfromFigma,
  //   //   points: [0]
  //   // });

  //   // let newArr = SVGfromFigma.points.map((item, j) => {
  //   //   if (j === i) {
  //   //     return [
  //   //       e.target.getBoundingClientRect().left,
  //   //       e.target.getBoundingClientRect().top
  //   //     ];
  //   //   } else {
  //   //     return item;
  //   //   }
  //   //   // return item;
  //   // });

  //   // setSVGfromFigma({
  //   //   ...SVGfromFigma,
  //   //   points: newArr
  //   // });
  //   // console.log(newArr);
  // };

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
        </TransformComponent>
      </TransformWrapper>
    </section>
  );
};

export default App;
