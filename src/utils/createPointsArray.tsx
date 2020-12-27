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

  let dotsArray = [
    ...leftSideDots,
    ...bottomSideDots,
    ...rightSideDots,
    ...topSideDots
  ];

  const controlBuffer = 5;
  for (let i = 0; i < dotsArray.length; i++) {
    if (dotsArray[i][0] === 0) dotsArray[i][0] -= controlBuffer;
    if (dotsArray[i][1] === 0) dotsArray[i][1] -= controlBuffer;
    if (dotsArray[i][0] === width) dotsArray[i][0] += controlBuffer;
    if (dotsArray[i][1] === height) dotsArray[i][1] += controlBuffer;
  }

  return dotsArray;
};

export default createPointsArray;
