import React from "react";

interface Props {
  checked?: boolean;
  onChange?(event: React.FormEvent<HTMLInputElement>): void;
}

interface RefObject {
  getValue: (val) => void;
}

const Toggler = React.forwardRef((props: Props, ref: React.Ref<RefObject>) => {
  const [toggle, setToggle] = React.useState(props.checked);

  const handleChange = e => {
    setToggle(!toggle);
    props.onChange ? props.onChange(e) : false;
  };

  return (
    <input
      ref={ref as any}
      type="checkbox"
      checked={toggle}
      onChange={handleChange}
    />
  );
});

Toggler.defaultProps = {
  checked: false
} as Partial<Props>;

export default Toggler;
