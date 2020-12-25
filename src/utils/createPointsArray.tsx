////////////////////////////////////////////////////
////////////// CREATE POINTS ARRAY /////////////////
////////////////////////////////////////////////////

const createPointsArray = (width, height, amount) => {
  const getDotDistance = (length, index) => (length / amount) * index;

  const amountArray = [...Array(amount).keys()];

  let leftSideDots = amountArray.map((_, i) => [0, getDotDistance(height, i)]);

  let bottomSideDots = amountArray.map((_, i) => [
    getDotDistance(width, i),
    height
  ]);

  let rightSideDots = amountArray
    .map((_, i) => [width, getDotDistance(height, ++i)])
    .reverse();

  let topSideDots = amountArray
    .map((_, i) => [getDotDistance(width, ++i), 0])
    .reverse();

  return [...leftSideDots, ...bottomSideDots, ...rightSideDots, ...topSideDots];
};

export default createPointsArray;
