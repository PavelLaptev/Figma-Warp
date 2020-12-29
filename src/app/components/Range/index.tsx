import React from "react";

interface Props {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?(event: React.FormEvent<HTMLInputElement>): void;
}

interface RefObject {
  reset: (val) => void;
}

const Range = React.forwardRef((props: Props, ref: React.Ref<RefObject>) => {
  const [value, setValue] = React.useState(props.value);

  const handleChange = e => {
    setValue(e.target.value);
    props.onChange ? props.onChange(e) : false;
  };

  return (
    <input
      ref={ref as any}
      type="range"
      min={props.min}
      max={props.max}
      step={props.step}
      value={value}
      onChange={handleChange}
    />
  );
});

Range.defaultProps = {
  value: 3,
  min: 1,
  max: 5
} as Partial<Props>;

export default Range;
