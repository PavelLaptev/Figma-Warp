import React from "react";
import styles from "./style.module.scss";

interface Props {
  checked?: boolean;
  label?: string;
  name?: string;
  msg?: string;
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
    <div className={styles.wrapper}>
      <label className={styles.control} htmlFor={props.name}>
        <span className={styles.label}>{props.label}</span>
        <div
          className={`${styles.toggler} ${
            toggle ? styles.toggler_active : null
          }`}
        >
          <input
            ref={ref as any}
            id={props.name}
            type="checkbox"
            checked={toggle}
            onChange={handleChange}
          />
        </div>
      </label>
      {props.msg ? <p className={styles.msg}>{props.msg}</p> : null}
    </div>
  );
});

Toggler.defaultProps = {
  checked: false,
  label: "label",
  name: "toggler",
  msg: null
} as Partial<Props>;

export default Toggler;
