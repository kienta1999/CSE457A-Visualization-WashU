class SimilarStories {
  constructor() {
    this.margin = { bottom: 150, left: 80 };
    this.width = 700 - this.margin.left;
    this.height = 700 - this.margin.bottom;
  }
  update(data, count) {
    if (count < 0) count = 10;
    count = Math.min(count, data.similarity_score.length);
    if (this.count == count && this.data == data) return;
    this.data = data;
    this.count = count;
    this.svg = d3
      .select("#similar-stories")
      .html("")
      .append("svg")
      .attr("width", 700)
      .attr("height", 700)
      .append("g")
      .attr("transform", `translate(${this.margin.left},0)`);
    const similarityScore = data.similarity_score
      .sort((d1, d2) => -d1.score + d2.score)
      .slice(0, this.count);
    // color scale
    var colors = d3
      .scaleLinear()
      .domain([
        d3.min(similarityScore, (d) => d.score) / 2,
        d3.max(similarityScore, (d) => d.score),
      ])
      .range(["white", "#D53E4F"]);
    // X axias
    var xScale = d3
      .scaleBand()
      .range([0, this.width])
      .domain(similarityScore.map((d) => d.title))
      .padding(0.2);
    this.svg
      .append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    //   Y axias
    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(similarityScore, (d) => d.score)])
      .range([this.height, 0]);
    this.svg.append("g").call(d3.axisLeft(yScale));

    const vis = this;
    this.svg
      .selectAll(".similarity")
      .data(similarityScore)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.title))
      .attr("width", xScale.bandwidth())
      .attr("fill", (d, i) => colors(d.score))
      .attr("height", (d) => vis.height - yScale(0))
      .attr("y", (d) => yScale(0))
      .classed("similarity", true)
      .transition()
      .duration(900)
      .attr("y", (d) => yScale(d.score))
      .attr("height", (d) => vis.height - yScale(d.score))
      .delay((d, i) => i * 50);
  }
}
