/////////////////////////////////////////////////////////
/////////////////// WARP TRANSFORM //////////////////////
/////////////////////////////////////////////////////////

const warpIt = (warp, points) => {
  warp.transform(function(v0, V = points) {
    const A = [];
    const W = [];
    const L = [];

    // Find angles
    for (let i = 0; i < V.length; i++) {
      const j = (i + 1) % V.length;

      const vi = V[i];
      const vj = V[j];

      const r0i = Math.sqrt((v0[0] - vi[0]) ** 2 + (v0[1] - vi[1]) ** 2);
      const r0j = Math.sqrt((v0[0] - vj[0]) ** 2 + (v0[1] - vj[1]) ** 2);
      const rij = Math.sqrt((vi[0] - vj[0]) ** 2 + (vi[1] - vj[1]) ** 2);

      const dn = 2 * r0i * r0j;
      const r = (r0i ** 2 + r0j ** 2 - rij ** 2) / dn;

      A[i] = isNaN(r) ? 0 : Math.acos(Math.max(-1, Math.min(r, 1)));
    }

    // Find weights
    for (let j = 0; j < V.length; j++) {
      const i = (j > 0 ? j : V.length) - 1;

      // const vi = V[i];
      const vj = V[j];

      const r = Math.sqrt((vj[0] - v0[0]) ** 2 + (vj[1] - v0[1]) ** 2);

      W[j] = (Math.tan(A[i] / 2) + Math.tan(A[j] / 2)) / r;
    }

    // Normalise weights
    const Ws = W.reduce((a, b) => a + b, 0);
    for (let i = 0; i < V.length; i++) {
      L[i] = W[i] / Ws;
    }

    // Save weights to the point for use when transforming

    return [...v0, ...L];
  });
};

export default warpIt;
