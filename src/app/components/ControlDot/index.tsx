import * as React from "react";
import styles from "./style.module.scss";
import PanZoomprovider from "../PanZoom/PanZoomProvider";

interface Props {
  position: {
    x: number;
    y: number;
  };
}

const ControlDot: React.FunctionComponent<Props> = props => {
  return (
    <PanZoomprovider.Consumer>
      {scale => (
        <div
          className={styles.dot_wrapper}
          style={{
            left: `${props.position.x}px`,
            top: `${props.position.y}px`
          }}
        >
          <svg
            className={styles.dot_svg}
            viewBox="0 0 24 24"
            fill="none"
            transform={`scale(${1 / (-scale / 2.6)})`}
          >
            <path
              className={styles.dot_svg_thumb}
              d="M0 17V7L7 0H17L24 7V17L17 24H7L0 17Z"
            />
            <g>
              <path d="M19 5L5 19" className={styles.dot_svg_cross} />
              <path d="M5 5L19 19" className={styles.dot_svg_cross} />
            </g>
          </svg>
        </div>
      )}
    </PanZoomprovider.Consumer>
  );
};

ControlDot.defaultProps = {} as Partial<Props>;

export default ControlDot;
