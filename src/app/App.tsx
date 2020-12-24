import * as React from "react";
import styles from "./app.module.scss";
// import { log } from "../utils";
// import Warp from "warpjs";

// Application
const App = ({}) => {
  // const [inputVal, setInputVal] = React.useState("My text");
  // const [radioState, setRadioState] = React.useState("arc");

  React.useEffect(() => {
    onmessage = event => {
      if (event.data.pluginMessage.type === "svg") {
        let SVGdata = event.data.pluginMessage.data;
        console.log(SVGdata);
      }
    };
  }, []);

  return (
    <section className={styles.app}>
      <div className={styles.preview}></div>
    </section>
  );
};

export default App;
