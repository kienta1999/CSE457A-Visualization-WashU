class SimilarStories {
  constructor() {
    this.width = 500;
    this.height = 500;
  }
  update(data, count) {
    if (count < 0) count = 10;
    count = Math.min(count, data.similarity_score.length);
    console.log(count);
    this.svg = d3
      .select("#similar-stories")
      .html("")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.height / 2},${this.width / 2})`);
    const similarityScore = data.similarity_score
      .sort((d1, d2) => -d1.score + d2.score)
      .slice(0, count);
    console.log(similarityScore);
    const yScale = d3.scaleLinear().range([this.height, 0]);
  }
}
