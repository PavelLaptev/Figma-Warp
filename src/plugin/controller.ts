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

  if (node) {
    if (
      node.type === "VECTOR" ||
      node.type === "TEXT" ||
      node.type === "RECTANGLE" ||
      node.type === "ELLIPSE" ||
      node.type === "POLYGON" ||
      node.type === "STAR" ||
      node.type === "LINE"
    ) {
      log.check("Shape selected");

      let node = figma.currentPage.selection[0];

      figma.ui.postMessage({
        type: "svg-from-figma",
        data: await getSVG(node)
      });
    } else {
      figma.ui.postMessage({
        type: "svg-from-figma",
        event: "error"
      });
      log.warn("convert element to vector type");
    }
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
  let selectedNode = figma.currentPage.selection[0] as VectorNode;

  if (msg.type === "settings-changes") {
    init();
  }

  if (msg.type === "warped-svg" && selectedNode) {
    let nodeFromSVG = figma.createNodeFromSvg(msg.data);

    let flatten = figma.flatten(nodeFromSVG.children);
    selectedNode.parent.appendChild(flatten);

    flatten.x = selectedNode.x;
    flatten.y = selectedNode.y;
    flatten.name = selectedNode.name;

    figma.currentPage.selection = [flatten];

    nodeFromSVG.remove();

    selectedNode.remove();
  } else if (msg.type === "warped-svg" && !selectedNode) {
    log.error("Select some vector shape");
  }
};
