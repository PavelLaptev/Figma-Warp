import * as React from "react";
import { TweenLite } from "gsap";

interface Props {
  position: {
    x: number;
    y: number;
  };
  SVGKey?: string;
  onMove?: (e) => void;
}

const ControlDot: React.FunctionComponent<Props> = props => {
  const dotRef = React.useRef(null);

  React.useEffect(() => {
    if (dotRef.current.transform.baseVal.length > 0) {
      TweenLite.set(dotRef.current, { x: 0, y: 0 });
    }
  }, [props.SVGKey]);

  return (
    <circle ref={dotRef} cx={props.position.x} cy={props.position.y} r={10} />
  );
};

ControlDot.defaultProps = {
  reset: false
} as Partial<Props>;

export default ControlDot;
