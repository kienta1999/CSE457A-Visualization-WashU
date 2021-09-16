/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

function staircase() {
  // ****** TODO: PART II ******
  const svgs = $(".barChart");
  svgs.each((index) => {
    const svg = svgs[index];
    let sortedChildren = [...svg.children].sort((c1, c2) => {
      return $(c1).attr("width") - $(c2).attr("width");
    });
    sortedY = sortedChildren
      .map((c) => $(c).attr("y"))
      .sort((w1, w2) => w1 - w2);
    sortedChildren.forEach((c, index) => {
      return $(c).attr("y", sortedY[index]);
    });
    $(svg).html(sortedChildren);
  });
}

function update(data) {
  // D3 loads all CSV data as strings;
  // while Javascript is pretty smart
  // about interpreting strings as
  // numbers when you do things like
  // multiplication, it will still
  // treat them as strings where it makes
  // sense (e.g. adding strings will
  // concatenate them, not add the values
  // together, or comparing strings
  // will do string comparison, not
  // numeric comparison).

  // We need to explicitly convert values
  // to numbers so that comparisons work
  // when we call d3.max()
  data.forEach(function (d) {
    d.a = parseInt(d.a);
    d.b = parseFloat(d.b);
  });
  // Set up the scales
  var aScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.a;
      }),
    ])
    .range([0, 150]);
  var bScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.b;
      }),
    ])
    .range([0, 150]);
  var iScale = d3.scaleLinear().domain([0, data.length]).range([0, 110]);

  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  const barChartA = d3
    .select("#barChartA")
    .selectAll("rect")
    .data(data.map((d) => d.a));
  barChartA
    .enter()
    .append("rect")
    .merge(barChartA)
    .attr("x", 0)
    .attr("y", (_a, i) => iScale(i))
    .attr("width", (a) => aScale(a))
    .attr("height", 110 / data.length)
    .on("mouseover", (event) => {
      $(event.target).css("fill", "yellow");
    })
    .on("mouseout", (event) => {
      $(event.target).css("fill", "steelblue");
    });
  barChartA.exit().remove();
  // TODO: Select and update the 'b' bar chart bars
  const barChartB = d3
    .select("#barChartB")
    .selectAll("rect")
    .data(data.map((d) => d.b));
  barChartB
    .enter()
    .append("rect")
    .merge(barChartB)
    .attr("x", 0)
    .attr("y", (_b, i) => iScale(i))
    .attr("width", (b) => bScale(b))
    .attr("height", 110 / data.length)
    .on("mouseover", (event) => {
      $(event.target).css("fill", "yellow");
    })
    .on("mouseout", (event) => {
      $(event.target).css("fill", "steelblue");
    });
  barChartB.exit().remove();
  // TODO: Select and update the 'a' line chart path using this line generator
  var aLineGenerator = d3
    .line()
    .x(function (d, i) {
      return iScale(i);
    })
    .y(function (d) {
      return parseFloat(d3.select("#lineA").attr("height")) - aScale(d.a);
    });
  d3.select("#lineA").html("").append("path").attr("d", aLineGenerator(data));
  // TODO: Select and update the 'b' line chart path (create your own generator)
  var bLineGenerator = d3
    .line()
    .x(function (d, i) {
      return iScale(i);
    })
    .y(function (d) {
      return parseFloat(d3.select("#lineB").attr("height")) - bScale(d.b);
    });
  d3.select("#lineB").html("").append("path").attr("d", bLineGenerator(data));

  // UPSIDE DOWN?????
  // TODO: Select and update the 'a' area chart path using this line generator
  var aAreaGenerator = d3
    .area()
    .x(function (d, i) {
      return iScale(i);
    })
    .y0(200)
    .y1(function (d) {
      return parseFloat(d3.select("#areaA").attr("height")) - aScale(d.a);
    });
  d3.select("#areaA").html("").append("path").attr("d", aAreaGenerator(data));

  // TODO: Select and update the 'b' area chart path (create your own generator)
  var bAreaGenerator = d3
    .area()
    .x(function (d, i) {
      return iScale(i);
    })
    .y0(200)
    .y1(function (d) {
      return parseFloat(d3.select("#areaB").attr("height")) - bScale(d.b);
    });
  d3.select("#areaB").html("").append("path").attr("d", bAreaGenerator(data));

  // TODO: Select and update the scatterplot points

  // ****** TODO: PART IV ******
  const scatter = d3.select("#scatter").selectAll("circle").data(data);
  scatter
    .enter()
    .append("circle")
    .merge(scatter)
    .attr("cx", (d) => aScale(d.a))
    .attr("cy", (d) => d3.select("#scatter").attr("height") - bScale(d.b))
    .attr("r", 4);
  scatter.exit().remove();
  d3.select("#scatter").on("mousedown", (event) => {
    console.log(d3.pointer(event));
  });
}

function changeData() {
  // // Load the file indicated by the select menu
  var dataFile = document.getElementById("dataset").value;
  if (document.getElementById("random").checked) {
    randomSubset();
  } else {
    d3.csv("data/" + dataFile + ".csv").then(update);
  }
}

function randomSubset() {
  // Load the file indicated by the select menu,
  // and then slice out a random chunk before
  // passing the data to update()
  var dataFile = document.getElementById("dataset").value;
  if (document.getElementById("random").checked) {
    d3.csv("data/" + dataFile + ".csv").then(function (data) {
      var subset = [];
      data.forEach(function (d) {
        if (Math.random() > 0.5) {
          subset.push(d);
        }
      });
      update(subset);
    });
  } else {
    changeData();
  }
}

window.onload = changeData;
