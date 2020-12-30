////////////////////////////////////////////////////
////////// SEND ARRAY OF WRAPPER PATH //////////////
////////////////////////////////////////////////////

const sendPaths = svgDom => {
  // let PathsHTMLCollection = svgDom.getElementsByTagName("path");
  let s = new XMLSerializer();
  let SVGstr = s.serializeToString(svgDom);
  // console.log(paths);

  // console.log(paths);
  parent.postMessage(
    {
      pluginMessage: {
        type: "warped-svg",
        data: SVGstr
      }
    },
    "*"
  );
};

export default sendPaths;
