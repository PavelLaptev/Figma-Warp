import { render } from "node-sass";
import React from "react";

interface Props {
  position: {
    x: number;
    y: number;
  };
  SVGKey?: string;
  onChange?(event: React.FormEvent<HTMLInputElement>): void;
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

  const handlePointerDown = e => {
    const el = e.target;
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    el.setPointerCapture(e.pointerId);
    setPosition({
      ...position,
      active: true,
      offset: {
        x,
        y
      }
    });
  };

  const handlePointerMove = e => {
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    if (position.active) {
      setPosition({
        ...position,
        x: position.x - (position.offset.x - x),
        y: position.y - (position.offset.y - y)
      });
    }
  };

  const handlePointerUp = () => {
    setPosition({
      ...position,
      active: false
    });
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
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      transform={`translate(${position.x}, ${position.y})`}
      fill={position.active ? "blue" : "black"}
    />
  );
};

ControlDot.defaultProps = {
  reset: false
} as Partial<Props>;

export default ControlDot;
