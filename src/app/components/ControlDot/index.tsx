import * as React from "react";

interface Props {
  position: {
    x: number;
    y: number;
  };
  SVGKey?: string;
  onMove?: (e) => void;
}

const ControlDot: React.FunctionComponent<Props> = props => {
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0,
    active: false,
    offset: {
      x: 0,
      y: 0
    }
  });

  const initialState = {
    x: 0,
    y: 0,
    active: false,
    offset: {
      x: 0,
      y: 0
    }
  };

  React.useEffect(() => {
    return () => {
      // console.log(props.SVGKey);
      setPosition(initialState);
    };
  }, [props.SVGKey]);

  return (
    <circle
      cx={props.position.x}
      cy={props.position.y}
      r={10}
      transform={`translate(${position.x}, ${position.y})`}
      fill={position.active ? "blue" : "black"}
    />
  );
};

ControlDot.defaultProps = {
  reset: false
} as Partial<Props>;

export default ControlDot;
