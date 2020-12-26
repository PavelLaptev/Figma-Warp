import React from "react";

interface Props {
  position: {
    x: number;
    y: number;
  };
  reset?: boolean;
  onChange?(event: React.FormEvent<HTMLInputElement>): void;
}

const ControlDot: React.FunctionComponent<Props> = props => {
  const [key, setKey] = React.useState(0);

  const [position, setPosition] = React.useState({
    x: 0,
    y: 0,
    active: false,
    offset: {
      x: 0,
      y: 0
    }
  });

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

  return (
    <circle
      key={key}
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
  reset: true
} as Partial<Props>;

export default ControlDot;
