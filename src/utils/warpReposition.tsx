//////////////////////////////////////////////////////////
/////////////////// WARP REPOSITION //////////////////////
//////////////////////////////////////////////////////////

function warpReposition([x, y, ...W], V) {
  let nx = 0;
  let ny = 0;

  // Recreate the points using mean value coordinates
  for (let i = 0; i < V.length; i++) {
    nx += W[i] * V[i][0];
    ny += W[i] * V[i][1];
  }

  return [nx, ny, ...W];
}

export default warpReposition;
