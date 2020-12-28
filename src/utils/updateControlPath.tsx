//////////////////////////////////////////////////////////
///////////////// CREATE CONTROL PATH ////////////////////
//////////////////////////////////////////////////////////

const updateControlPath = (path, points) => {
  let d = [`M${points[0][0]} ${points[0][1]}`];

  for (let i = 1; i < points.length; i++) {
    d.push(`L${points[i][0]} ${points[i][1]}`);
  }

  d.push("Z");
  path.current.setAttribute("d", d.join(""));
};

export default updateControlPath;
