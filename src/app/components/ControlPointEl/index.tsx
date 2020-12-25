import React from "react";

interface Props {
  position: {
    x: number;
    y: number;
  };
  reset?: boolean;
  onChange?(event: React.FormEvent<HTMLInputElement>): void;
}

const ControlPointEl: React.FunctionComponent<Props> = props => {
  const [position, setPosition] = React.useState({
    x: props.position.x,
    y: props.position.y,
    active: false,
    offset: {}
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
  const handlePointerUp = e => {
    setPosition({
      ...position,
      active: false
    });
  };

  return (
    <circle
      cx={position.x}
      cy={position.y}
      r={50}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      fill={position.active ? "blue" : "black"}
    />
  );
};

ControlPointEl.defaultProps = {
  reset: false
} as Partial<Props>;

export default ControlPointEl;
