import React from "react";

interface Props {
  value: string;
  checked: boolean;
  onChange?(event: React.FormEvent<HTMLInputElement>): void;
}

const Radio: React.FunctionComponent<Props> = props => {
  return (
    <input
      type="radio"
      id={props.value}
      name={props.value}
      value={props.value}
      onChange={props.onChange}
      checked={props.checked}
    />
  );
};

Radio.defaultProps = {
  value: null,
  checked: false
} as Partial<Props>;

export default Radio;
