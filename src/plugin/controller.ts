import { log } from "../utils";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

// Show UI
figma.showUI(__html__, { width: 580, height: 480 });

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const getSVG = async node => {
  let svg = await node.exportAsync({
    format: "SVG",
    svgOutlineText: true
  });

  return String.fromCharCode.apply(null, svg);
};

const init = async () => {
  let node = figma.currentPage.selection[0];

  if (node && node.type === "VECTOR") {
    log.check("Shape selected");

    let node = figma.currentPage.selection[0];

    figma.ui.postMessage({
      type: "svg-from-figma",
      data: await getSVG(node)
    });
  } else if (node && node.type !== "VECTOR") {
    figma.ui.postMessage({
      type: "svg-from-figma",
      event: "error"
    });
    log.warn("convert element to vector type");
  } else {
    figma.ui.postMessage({
      type: "svg-from-figma",
      event: "error"
    });
    log.error("Select some vector shape");
  }
};

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

init();

figma.on("selectionchange", () => {
  console.clear();
  console.log("cleared by new section");
  init();
});

figma.ui.onmessage = async msg => {
  if (msg.type === "complexity") {
    console.clear();
    init();
    log.check(`Complexity: ${msg.data}`);
  }
};

// figma.ui.onmessage = msg => {
//   let node = figma.currentPage.selection[0];
//   if (node) {
//     log("selected");
//   } else {
//     log("not selected");
//   }
// };

// TO-DO
