import React from "react";

interface Props {
  position: {
    x: number;
    y: number;
  };
  reset?: boolean;
  onChange?(event: React.FormEvent<HTMLInputElement>): void;
}

const ControlPoint: React.FunctionComponent<Props> = props => {
  console.log(props.position);

  const [position, setPosition] = React.useState({
    x: props.position.x,
    y: props.position.y,
    active: false,
    offset: {
      x: props.position.x,
      y: props.position.y
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
      cx={position.x}
      cy={position.y}
      r={10}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      fill={position.active ? "blue" : "black"}
    />
  );
};

ControlPoint.defaultProps = {
  reset: false
} as Partial<Props>;

export default ControlPoint;