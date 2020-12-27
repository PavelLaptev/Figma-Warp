//////////////////////////////////////////////////////////
///////////////// CREATE CONTROL PATH ////////////////////
//////////////////////////////////////////////////////////

const updateControlPath = (path, points) => {
  console.log(JSON.stringify(points));
  let d = [`M${points[0][0]} ${points[0][1]}`];

  var i = 0;

  while (i < points.length - 1) {
    i++;
    d.push(`L${points[i][0]} ${points[i][1]}`);
  }

  d.push("Z");
  path.current.setAttribute("d", d.join(""));
  i = 0;
};

export default updateControlPath;

// var i = 1;

// while (i < points.length) {
//   i++;
//   console.log(d);
//   d.push(`L${points[i][0]} ${points[i][1]}`);
// }
