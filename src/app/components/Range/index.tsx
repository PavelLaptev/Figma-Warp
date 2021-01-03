import React from "react";
import styles from "./style.module.scss";

interface Props {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  valuesName?: string[];
  msg?: string;
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

  const isValueNameMatch = (names: string[]) => {
    return names.filter((item, i) => {
      if (i === Number(value - 1)) {
        return item;
      }
    })[0];
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={props.label}>
        <span style={{ opacity: 0.4 }}>{props.label}:</span>{" "}
        <span>{`${isValueNameMatch(props.valuesName)}`}</span>
      </label>
      <div className={styles.input}>
        <div className={styles.segments}>
          {Array(props.max)
            .fill(0)
            .map((_, i) => {
              return (
                <div
                  key={`segment-${i}`}
                  className={styles.segments_item}
                  style={{
                    left: `${(100 / (props.max - 1)) * i}%`
                  }}
                ></div>
              );
            })}
        </div>
        <input
          id={props.label}
          ref={ref as any}
          type="range"
          min={props.min}
          max={props.max}
          step={props.step}
          value={value}
          onChange={handleChange}
        />
      </div>
      {props.msg ? <p className={styles.msg}>{props.msg}</p> : null}
    </div>
  );
});

Range.defaultProps = {
  value: 3,
  min: 1,
  max: 4,
  label: "Label",
  valuesName: ["value 1", "value 2", "value 3", "value 4"],
  msg: null
} as Partial<Props>;

export default Range;
