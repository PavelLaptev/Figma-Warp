import * as React from "react";
import appstyles from "./app.module.scss";
import uistyles from "./uistyles.module.scss";
import placeholderSVG from "./assets/placeholderSVG";
import PanZoom from "./components/PanZoom/";
import Warp from "warpjs";
import {
  createPointsArray,
  warpIt,
  warpReposition,
  updateControlPath,
  sendPaths
} from "../utils";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import ControlDot from "./components/ControlDot";
import Range from "./components/Range";
import Toggler from "./components/Toggler";
import shortid from "shortid";

gsap.registerPlugin(Draggable);

// Application
const App = ({}) => {
  ////////////////////////////////////////////////////////////////
  //////////////////////////// REFS ////////////////////////////
  ///////////////////////////////////////////////////////////////
  const SVGContainerRef = React.useRef(null);
  const SVGElementRef = React.useRef(null);
  const SVGControlPath = React.useRef(null);
  const SVGControlDots = React.useRef(null);
  //
  const panZommRef = React.useRef(null);
  const realTimeChangesRef = React.useRef(null);

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
  const [Interpolation, setInterpolation] = React.useState(1);
  const [realtimeChanges, setRealtimeChanges] = React.useState(false);

  ////////////////////////////////////////////////////////////////
  ////////////////////////// USE EFFECT //////////////////////////
  ///////////////////////////////////////////////////////////////
  React.useEffect(() => {
    // panZommRef.current.getTransform();
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

        const convertInterpolationValue = value => {
          let numValue = Number(value);
          if (numValue === 1) {
            return 500;
          } else if (numValue === 2) {
            return 100;
          } else if (numValue === 3) {
            return 10;
          }
        };

        const warp = new Warp(SVGElementRef.current);
        warp.interpolate(convertInterpolationValue(Interpolation));

        warpIt(warp, points);
        warpReposition(warp, points);
        updateControlPath(SVGControlPath, points);

        [...SVGControlDots.current.childNodes].map((item, i) => {
          Draggable.create(item, {
            type: "x,y",
            onDrag: function() {
              let relativeX =
                (this.pointerX -
                  SVGContainerRef.current.getBoundingClientRect().left) /
                panZommRef.current.getScale();
              let relativeY =
                (this.pointerY -
                  SVGContainerRef.current.getBoundingClientRect().top) /
                panZommRef.current.getScale();
              points[i] = [relativeX, relativeY];

              warpReposition(warp, points);
              updateControlPath(SVGControlPath, points);

              realTimeChangesRef.current.checked
                ? sendPaths(warp.element)
                : false;
            }
          });
        });
        //////////////////////////////////////////
      }
    };
  }, [SVGfromFigma, complexity, Interpolation]);

  ////////////////////////////////////////////////////////////////
  ////////////////////// HANDLE FUNCTIONS ////////////////////////
  ////////////////////////////////////////////////////////////////

  const handleSettingsChanged = (value, setState) => {
    setAppKey(shortid.generate());
    setState(value);
    parent.postMessage(
      { pluginMessage: { type: "settings-changes", data: value } },
      "*"
    );
  };

  const handleComplexity = (e, setState) => {
    handleSettingsChanged(e.target.value, setState);
  };

  const handleInterpolation = (e, setState) => {
    handleSettingsChanged(e.target.value, setState);
  };

  const handleRealtimeChanges = e => {
    setRealtimeChanges(e.target.checked);
  };

  const applyResults = () => {
    sendPaths(SVGElementRef.current);
  };

  ////////////////////////////////////////////////////////////////
  ///////////////////////// UI CONTROLS //////////////////////////
  ////////////////////////////////////////////////////////////////

  const UIcontrols = () => {
    return (
      <section className={uistyles.wrapper}>
        <section className={uistyles.settings}>
          <header className={uistyles.header}>
            <h4>Settings</h4>
          </header>
          <Range
            value={complexity}
            onChange={e => handleComplexity(e, setComplexity)}
            max={5}
            valuesName={[
              "4 pooints",
              "8 points",
              "12 points",
              "16 points",
              "20 points"
            ]}
            name="Complexity"
          />
          <Range
            value={Interpolation}
            onChange={e => handleInterpolation(e, setInterpolation)}
            max={3}
            valuesName={["Low", "Middle", "High"]}
            name="Interpolation"
            errMsg={"High interpolation lowers performance"}
          />
          <Toggler
            ref={realTimeChangesRef}
            checked={realtimeChanges}
            onChange={handleRealtimeChanges}
          />
        </section>
        <button
          onClick={applyResults}
          style={{
            display: realtimeChanges ? "none" : "block"
          }}
        >
          Apply
        </button>
      </section>
    );
  };

  ////////////////////////////////////////////////////////////////
  //////////////////////////// RENDER ////////////////////////////
  ////////////////////////////////////////////////////////////////
  return (
    <div className={appstyles.app} key={appKey}>
      <UIcontrols />
      <PanZoom ref={panZommRef}>
        <section className={appstyles.view}>
          <div
            className={appstyles.SVG_wrapper}
            ref={SVGContainerRef}
            style={{
              width: `${SVGfromFigma.currentSize.width}px`,
              height: `${SVGfromFigma.currentSize.height}px`
            }}
          >
            <div
              ref={SVGControlDots}
              className={appstyles.SVG_dotsContainer}
              id="svg-dot-container"
            >
              {SVGfromFigma.points.map((item, i) => {
                return (
                  <ControlDot
                    key={`dot-${i}`}
                    position={{ x: item[0], y: item[1] }}
                  />
                );
              })}
            </div>

            <svg
              className={appstyles.SVG_container}
              viewBox={SVGfromFigma.viewbox}
              ref={SVGElementRef}
              dangerouslySetInnerHTML={{ __html: SVGfromFigma.htmlString }}
            />

            <svg className={appstyles.SVG_controlPath}>
              <path
                ref={SVGControlPath}
                id="control-path"
                className={appstyles.SVG_path}
              />
            </svg>
          </div>
        </section>
      </PanZoom>
    </div>
  );
};

export default App;
