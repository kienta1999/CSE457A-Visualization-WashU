class WordFrequency {
  constructor() {
    this.width = 500;
    this.height = 500;
  }

  updateWordCloud(data) {
    this.svg = d3
      .select("#word-cloud")
      .html("")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.height / 2},${this.width / 2})`);
    let frequencies = data.word_frequency;
    frequencies.sort((d1, d2) => -d1.frequency + d2.frequency);
    frequencies = frequencies.slice(0, 20);

    var colors = d3
      .scaleQuantize()
      .domain([
        d3.min(frequencies, (d) => d.frequency),
        d3.max(frequencies, (d) => d.frequency),
      ])
      .range([
        "#5E4FA2",
        "#3288BD",
        "#66C2A5",
        "#ABDDA4",
        "#E6F598",
        "#FFFFBF",
        "#FEE08B",
        "#FDAE61",
        "#F46D43",
        "#D53E4F",
        "#9E0142",
      ]);
    const draw = (data) => {
      this.svg
        .selectAll("text")
        .data(frequencies)
        .enter()
        .append("text")
        .style("font-family", "Impact")
        .style("fill", function (d, i) {
          return colors(d.frequency);
        })
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")rotate(" + d.rotate + ")";
        })
        .attr("font-size", (d) => d.frequency * 3)
        .text(function (d) {
          return d.word;
        });
    };
    d3.layout
      .cloud()
      .size([this.width, this.height])
      .words(frequencies)
      .padding(5)
      .rotate(function () {
        return ~~(Math.random() * 2) * 90;
      })
      .font("Impact")
      .fontSize(function (d) {
        return d.frequency;
      })
      .on("end", draw)
      .start();
  }

  updateWordFrequency(data) {
    console.log(data);
  }

  update(data) {
    this.updateWordCloud(data);
    this.updateWordFrequency(data);
  }
}
