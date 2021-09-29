/**
 * Constructor for the Year Chart
 *
 * @param electoralVoteChart instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function YearChart(
  electoralVoteChart,
  tileChart,
  votePercentageChart,
  electionWinners
) {
  var self = this;

  self.electoralVoteChart = electoralVoteChart;
  self.tileChart = tileChart;
  self.votePercentageChart = votePercentageChart;
  self.electionWinners = electionWinners;
  self.init();
}

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = function () {
  var self = this;
  self.margin = { top: 10, right: 20, bottom: 30, left: 50 };
  var divyearChart = d3.select("#year-chart").classed("fullView", true);

  //Gets access to the div element created for this chart from HTML
  self.svgBounds = divyearChart.node().getBoundingClientRect();
  self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
  self.svgHeight = 100;

  //creates svg element within the div
  self.svg = divyearChart
    .append("svg")
    .attr("width", self.svgWidth)
    .attr("height", self.svgHeight);
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
YearChart.prototype.chooseClass = function (party) {
  var self = this;
  if (party == "R") {
    return "yearChart republican";
  } else if (party == "D") {
    return "yearChart democrat";
  } else if (party == "I") {
    return "yearChart independent";
  }
};

/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function () {
  var self = this;
  var clicked = null;

  //Domain definition for global color scale
  var domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

  //Color range for global color scale
  var range = [
    "#0066CC",
    "#0080FF",
    "#3399FF",
    "#66B2FF",
    "#99ccff",
    "#CCE5FF",
    "#ffcccc",
    "#ff9999",
    "#ff6666",
    "#ff3333",
    "#FF0000",
    "#CC0000",
  ];

  //Global colorScale to be used consistently by all the charts
  self.colorScale = d3.scaleQuantile().domain(domain).range(range);

  self.electionWinners.forEach(function (d) {
    d.YEAR = +d.YEAR;
  });

  // ******* TODO: PART I *******
  const padding = 20;
  const svg = d3.select("#year-chart").select("svg");
  var yearScale = d3
    .scaleLinear()
    .domain([
      d3.min(this.electionWinners, (d) => d.YEAR),
      d3.max(this.electionWinners, (d) => d.YEAR),
    ])
    .range([padding, self.svgWidth - padding]);

  svg
    .append("line")
    .attr("x1", 0)
    .attr("y1", this.svgHeight / 2)
    .attr("x2", this.svgWidth)
    .attr("y2", this.svgHeight / 2)
    .attr("class", "lineChart");

  svg
    .selectAll("circle")
    .data(this.electionWinners)
    .enter()
    .append("circle")
    .attr("cx", (d) => yearScale(d.YEAR))
    .attr("cy", this.svgHeight / 2)
    .attr("r", 10)
    .attr("class", (d) => this.chooseClass(d.PARTY))
    .on("click", async (event, d) => {
      svg.selectAll("circle").classed("highlighted", false);
      event.target.classList.add("highlighted");
      const filename = `data/election-results-${d.YEAR}.csv`;
      const electionResult = await d3.csv(filename);
      electionResult.forEach((res) => {
        res.D_Percentage = parseFloat(res.D_Percentage);
        res.D_Votes = parseInt(res.D_Votes);
        res.I_Percentage =
          res.I_Percentage === "" ? 0 : parseFloat(res.I_Percentage);
        res.I_Votes = res.I_Votes === "" ? 0 : parseInt(res.I_Votes);
        res.R_Percentage = parseFloat(res.R_Percentage);
        res.R_Votes = parseInt(res.R_Votes);
        res.Total_EV = parseInt(res.Total_EV);
      });
      this.electoralVoteChart.update(electionResult, this.colorScale);
      this.tileChart.update(electionResult, this.colorScale);
      this.votePercentageChart.update(electionResult, this.colorScale);
    });

  svg
    .selectAll("text")
    .data(this.electionWinners)
    .enter()
    .append("text")
    .attr("x", (d) => yearScale(d.YEAR))
    .attr("y", (this.svgHeight * 3) / 4)
    .text((d) => d.YEAR)
    .attr("class", "yeartext");

  // Create the chart by adding circle elements representing each election year
  //The circles should be colored based on the winning party for that year
  //HINT: Use the .yearChart class to style your circle elements
  //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

  //Append text information of each year right below the corresponding circle
  //HINT: Use .yeartext class to style your text elements

  //Style the chart by adding a dashed line that connects all these years.
  //HINT: Use .lineChart to style this dashed line

  //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
  //HINT: Use .highlighted class to style the highlighted circle

  //Election information corresponding to that year should be loaded and passed to
  // the update methods of other visualizations

  //******* TODO: EXTRA CREDIT *******

  //Implement brush on the year chart created above.
  //Implement a call back method to handle the brush end event.
  //Call the update method of brushSelection and pass the data corresponding to brush selection.
  //HINT: Use the .brush class to style the brush.wash
};
