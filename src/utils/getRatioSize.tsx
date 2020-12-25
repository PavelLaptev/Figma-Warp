////////////////////////////////////////////////////
/////////////////// GET RATIO //////////////////////
////////////////////////////////////////////////////

const getRatioSize = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio)
  };
};

export default getRatioSize;
