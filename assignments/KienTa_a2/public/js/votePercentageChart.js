/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart() {
  var self = this;
  self.init();
}

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function () {
  var self = this;
  self.margin = { top: 30, right: 20, bottom: 30, left: 50 };
  var divvotesPercentage = d3
    .select("#votes-percentage")
    .classed("content", true);

  //Gets access to the div element created for this chart from HTML
  self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
  self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
  self.svgHeight = 200;

  //creates svg element within the div
  self.svg = divvotesPercentage
    .append("svg")
    .attr("width", self.svgWidth)
    .attr("height", self.svgHeight);
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
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
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
  var self = this;
  var text = "<ul>";
  tooltip_data.result.forEach(function (row) {
    text +=
      "<li class = " +
      self.chooseClass(row.party) +
      ">" +
      row.nominee +
      ":\t\t" +
      row.votecount +
      "(" +
      row.percentage +
      "%)" +
      "</li>";
  });

  return text;
};

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function (electionResult) {
  var self = this;

  // ******* TODO: PART III *******
  const svg = d3.select("#votes-percentage").select("svg");
  const rectHeight = this.svgHeight / 5;
  const rectY = (this.svgHeight - rectHeight) / 2;
  const totalIVote = electionResult.reduce(
    (prev, curr) => prev + curr.I_Votes,
    0
  );
  const totalDVote = electionResult.reduce(
    (prev, curr) => prev + curr.D_Votes,
    0
  );
  const totalRVote = electionResult.reduce(
    (prev, curr) => prev + curr.R_Votes,
    0
  );
  const totalVote = totalIVote + totalDVote + totalRVote;
  const padding = 10;
  const xRectScale = d3
    .scaleLinear()
    .domain([0, totalVote])
    .range([padding, self.svgWidth - padding]);
  const { I_Nominee, D_Nominee, R_Nominee } = electionResult[0];
  const rect = [
    {
      party: "I",
      votes: totalIVote,
      x: 0,
      percentage: (totalIVote / totalVote) * 100,
      nominee: I_Nominee,
    },
    {
      party: "D",
      votes: totalDVote,
      x: totalIVote,
      percentage: (totalDVote / totalVote) * 100,
      nominee: D_Nominee,
    },
    {
      party: "R",
      votes: totalRVote,
      x: totalIVote + totalDVote,
      percentage: (totalRVote / totalVote) * 100,
      nominee: R_Nominee,
    },
  ];
  //Create the stacked bar chart.
  //Use the global color scale to color code the rectangles.
  //HINT: Use .votesPercentage class to style your bars.
  svg.selectAll("rect").remove();
  svg
    .selectAll("rect")
    .data(rect)
    .enter()
    .append("rect")
    .attr("x", (d) => xRectScale(d.x))
    .attr("y", rectY)
    .attr("width", (d) => xRectScale(d.votes))
    .attr("height", rectHeight)
    .attr("class", (d) => this.chooseClass(d.party))
    .classed("votesPercentage", true);

  //Display the total percentage of votes won by each party
  //on top of the corresponding groups of bars.
  //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
  // chooseClass to get a color based on the party wherever necessary
  svg.selectAll(".votesPercentageText").remove();
  svg
    .selectAll(".votesPercentageText")
    .data(rect)
    .enter()
    .append("text")
    .attr("x", (d) => (d.party !== "R" ? xRectScale(d.x) : this.svgWidth))
    .attr("y", rectY)
    .attr("class", (d) => this.chooseClass(d.party))
    .text((d) => {
      return d.percentage.toFixed(1) > 0 ? `${d.percentage.toFixed(1)}%` : "";
    })
    .classed("votesPercentageText", true);
  //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
  //HINT: Use .middlePoint class to style this bar.

  svg
    .append("rect")
    .attr("x", this.svgWidth / 2)
    .attr("y", rectY)
    .attr("width", 1)
    .attr("height", rectHeight)
    .classed("middlePoint");

  //Just above this, display the text mentioning details about this mark on top of this bar
  //HINT: Use .votesPercentageNote class to style this text element
  svg.selectAll(".votesPercentageNote").remove();
  svg
    .append("text")
    .attr("x", this.svgWidth / 2)
    .attr("y", this.svgHeight / 3)
    .text("Popular Vote(50%)")
    .classed("votesPercentageNote", true);

  // Display nominee
  svg.selectAll(".nomineeText").remove();
  svg
    .selectAll(".nomineeText")
    .data(rect)
    .enter()
    .append("text")
    .attr("x", (d, i) => {
      if (d.party === "R") {
        return this.svgWidth;
      } else if (d.party == "I") {
        return padding;
      } else {
        if (Boolean(rect.find((r) => r.party === "I").nominee)) {
          return this.svgWidth / 4;
        } else {
          return padding;
        }
      }
    })
    .attr("y", this.svgHeight / 5)
    .attr("class", (d) => this.chooseClass(d.party))
    .text((d) => d.nominee)
    .classed("nomineeText", true);

  //for reference:https://github.com/Caged/d3-tip
  //Use this tool tip element to handle any hover over the chart
  tip = d3
    .tip()
    .attr("class", "d3-tip")
    .direction("s")
    .offset(function () {
      return [0, 0];
    })
    .html(function (d) {
      // populate data in the following format
      tooltip_data = {
        result: [
          {
            nominee: D_Nominee,
            votecount: totalDVote,
            percentage: ((totalDVote / totalVote) * 100).toFixed(1),
            party: "D",
          },
          {
            nominee: R_Nominee,
            votecount: totalRVote,
            percentage: ((totalRVote / totalVote) * 100).toFixed(1),
            party: "R",
          },
          {
            nominee: I_Nominee,
            votecount: totalIVote,
            percentage: ((totalIVote / totalVote) * 100).toFixed(1),
            party: "I",
          },
        ],
      };
      /* pass this as an argument to the tooltip_render function then,
       * return the HTML content returned from that method.
       * */
      return self.tooltip_render(tooltip_data);
    });

  //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
  //then, vote percentage and number of votes won by each party.
  svg.call(tip);
  svg
    .selectAll(".votesPercentage")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);
  //HINT: Use the chooseClass method to style your elements based on party wherever necessary.
};
