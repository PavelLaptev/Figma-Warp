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
  const [darkThemeState, setDarkThemeState] = React.useState(false);
  const [showSettingsState, setShowSettingsState] = React.useState(false);

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
        <section
          className={uistyles.settings}
          style={{ display: showSettingsState ? "flex" : "none" }}
        >
          <header className={uistyles.header}>
            <h4>Settings</h4>
            <div
              onClick={() => {
                setShowSettingsState(!showSettingsState);
              }}
              className={uistyles.closeButton}
            ></div>
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
            label="Complexity"
          />
          <Range
            value={Interpolation}
            onChange={e => handleInterpolation(e, setInterpolation)}
            max={3}
            valuesName={["Low", "Middle", "High"]}
            label="Interpolation"
            msg={"⚠ High interpolation lowers performance speed"}
          />
          <Toggler
            name={"darkmode"}
            label={"Dark Mode"}
            checked={darkThemeState}
            onChange={(e: any) => {
              setDarkThemeState(e.target.checked);
            }}
          />
          <Toggler
            name={"realtime-changes"}
            label={"Realtime changes"}
            ref={realTimeChangesRef}
            checked={realtimeChanges}
            onChange={handleRealtimeChanges}
            msg={
              "⚠ The plugin will reflect all changes in real-time. Complex shapes could cause low performance."
            }
          />
        </section>
        <button
          onClick={applyResults}
          className={uistyles.button}
          style={{
            marginRight: "6px",
            display: realtimeChanges ? "none" : "block"
          }}
        >
          Apply results
        </button>
        <button
          onClick={() => {
            setShowSettingsState(!showSettingsState);
          }}
          className={`${uistyles.button} ${
            showSettingsState ? uistyles.button_active : null
          }`}
        >
          <svg
            className={uistyles.settingsIcon}
            viewBox="0 0 20 19"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.259 2.72282V0H8.18689V2.72285L4.30707 5.00742L1.81436 3.51855L0.222965 6.08467L2.77548 7.60926V11.3919L0.222961 12.9165L1.81435 15.4826L4.30773 13.9933L8.18689 16.2775V19H11.259V16.2775L15.1382 13.9933L17.6316 15.4826L19.223 12.9165L16.6705 11.3919V7.60924L19.223 6.08467L17.6316 3.51855L15.1389 5.00741L11.259 2.72282ZM5.84759 7.6035L9.72297 5.32155L13.5984 7.6035V11.3969L9.72297 13.6788L5.84759 11.3969V7.6035Z"
            />
          </svg>
        </button>
      </section>
    );
  };

  ////////////////////////////////////////////////////////////////
  //////////////////////////// RENDER ////////////////////////////
  ////////////////////////////////////////////////////////////////
  return (
    <div
      className={`${appstyles.app} ${
        darkThemeState ? appstyles.darkTheme : appstyles.lightTheme
      }`}
      key={appKey}
    >
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
