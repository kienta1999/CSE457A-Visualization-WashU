/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function ElectoralVoteChart(brushSelection) {
  var self = this;
  this.brushSelection = brushSelection;
  self.init();
}

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function () {
  var self = this;
  self.margin = { top: 30, right: 20, bottom: 30, left: 50 };

  //Gets access to the div element created for this chart from HTML
  var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
  self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
  self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
  self.svgHeight = 150;

  //creates svg element within the div
  self.svg = divelectoralVotes
    .append("svg")
    .attr("width", self.svgWidth)
    .attr("height", self.svgHeight);
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
  var self = this;
  if (party == "R") {
    return "republican";
  } else if (party == "D") {
    return "democrat";
  } else if (party == "I") {
    return "independent";
  }
};

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function (electionResult, colorScale) {
  var self = this;

  // ******* TODO: PART II *******
  //Group the states based on the winning party for the state;
  //then sort them based on the margin of victory
  const independentStates = getIndependentStates(electionResult);
  const notIndependentStates = electionResult
    .filter((res) => !independentStates.includes(res))
    .sort(
      (res1, res2) =>
        res2.D_Percentage -
        res2.R_Percentage -
        (res1.D_Percentage - res1.R_Percentage)
    );
  const sortedElectionResult = [...independentStates, ...notIndependentStates];
  const totalEvAllState = sumEV(
    sortedElectionResult,
    sortedElectionResult.length
  );
  const svg = d3.select("#electoral-vote").select("svg");
  const padding = 0;
  const xRectScale = d3
    .scaleLinear()
    .domain([0, totalEvAllState])
    .range([padding, self.svgWidth - padding]);

  //Create the stacked bar chart.
  //Use the global color scale to color code the rectangles.
  //HINT: Use .electoralVotes class to style your bars.
  const rectHeight = this.svgHeight / 5;
  const rectY = (this.svgHeight - rectHeight) / 2;
  svg.selectAll("rect").remove();
  svg
    .selectAll("rect")
    .data(sortedElectionResult)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xRectScale(sumEV(sortedElectionResult, i)))
    .attr("y", rectY)
    .attr(
      "width",
      (d, i) =>
        xRectScale(sumEV(sortedElectionResult, i + 1)) -
        xRectScale(sumEV(sortedElectionResult, i)) -
        1
    )
    .attr("height", rectHeight)
    .attr("fill", (d) => {
      if (independentStates.includes(d)) return "#45ad6a";
      return colorScale(-d.D_Percentage + d.R_Percentage);
    })
    .classed("electoralVotes");

  //Display total count of electoral votes won by the Democrat and Republican party
  //on top of the corresponding groups of bars.
  //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
  // chooseClass to get a color based on the party wherever necessary

  const democratStates = getDemocratStates(electionResult);
  const republicanStates = getRepublicanStates(electionResult);
  const totalEvIndependent = sumEV(independentStates, independentStates.length);
  const totalEvDemocrat = sumEV(democratStates, democratStates.length);
  const totalEvRepublican = sumEV(republicanStates, republicanStates.length);

  svg.selectAll(".electoralVoteText").remove();
  if (totalEvIndependent > 0) {
    svg
      .append("text")
      .attr("x", xRectScale(0))
      .attr("y", rectY)
      .text(totalEvIndependent)
      .attr("fill", "#45ad6a")
      .classed("electoralVoteText", true);
  }
  svg
    .append("text")
    .attr("x", xRectScale(totalEvIndependent))
    .attr("y", rectY)
    .text(totalEvDemocrat)
    .attr("fill", "#3182bd")
    .classed("electoralVoteText", true);

  svg
    .append("text")
    .attr("x", this.svgWidth - 25)
    .attr("y", rectY)
    .text(totalEvRepublican)
    .attr("fill", "#de2d26")
    .classed("electoralVoteText", true);

  //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
  //HINT: Use .middlePoint class to style this bar.

  svg
    .append("rect")
    .attr("x", this.svgWidth / 2)
    .attr("y", rectY)
    .attr("width", 0.5)
    .attr("height", rectHeight)
    .classed("middlePoint", true);

  //Just above this, display the text mentioning the total number of electoral votes required
  // to win the elections throughout the country
  //HINT: Use .electoralVotesNote class to style this text element
  svg
    .append("text")
    .attr("x", this.svgWidth / 2)
    .attr("y", this.svgHeight / 3)
    .text("Electoral Vote (270 needed to win)")
    .classed("electoralVotesNote", true);

  //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

  //******* TODO: PART V *******
  //Implement brush on the bar chart created above.
  //Implement a call back method to handle the brush end event.
  //Call the update method of brushSelection and pass the data corresponding to brush selection.
  //HINT: Use the .brush class to style the brush.
  let selected = [];
  console.log(sortedElectionResult);
  const getState = (coorX, sortedElectionResult) => {
    return sortedElectionResult.find(
      (_element, i) => xRectScale(sumEV(sortedElectionResult, i)) >= coorX
    );
  };

  const brushed = ({ selection }) => {
    selected.push(selection[1]);
  };
  const brushended = ({ selection }) => {
    selected.push(selection[1]);
    const selectedStates = [
      ...new Set(selected.map((s) => getState(s, sortedElectionResult))),
    ].filter((s) => Boolean(s));
    this.brushSelection.update(selectedStates);
    selected = [];
  };

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [self.svgWidth, self.svgHeight],
    ])
    .on("brush", brushed)
    .on("end", brushended);
  svg.call(brush);
};

const sumEV = (sortedElectionResult, index) => {
  return sortedElectionResult
    .slice(0, index)
    .reduce((prev, curr) => prev + curr.Total_EV, 0);
};

const getIndependentStates = (electionResult) => {
  return electionResult.filter(
    (res) =>
      res.I_Percentage > res.R_Percentage && res.I_Percentage > res.D_Percentage
  );
};

const getDemocratStates = (electionResult) => {
  return electionResult.filter(
    (res) =>
      res.D_Percentage > res.R_Percentage && res.D_Percentage > res.I_Percentage
  );
};

const getRepublicanStates = (electionResult) => {
  return electionResult.filter(
    (res) =>
      res.R_Percentage > res.I_Percentage && res.R_Percentage > res.D_Percentage
  );
};
