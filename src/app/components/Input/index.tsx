import React from "react";

interface Props {
  value: string;
  onChange?(event: React.FormEvent<HTMLInputElement>): void;
}

const Input: React.FunctionComponent<Props> = props => {
  return <input type="text" value={props.value} onChange={props.onChange} />;
};

Input.defaultProps = {
  value: null
} as Partial<Props>;

export default Input;
