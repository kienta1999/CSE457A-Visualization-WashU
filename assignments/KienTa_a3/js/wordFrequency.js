class WordFrequency {
  constructor() {
    this.width = 500;
    this.height = 500;
    this.heightWC = 160;
    this.widthtWC = 1000;
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

  updateWordCount(data) {
    console.log(data);
    const vis = this;
    this.svg = d3
      .select("#word-count")
      .html("")
      .append("svg")
      .attr("width", this.widthtWC)
      .attr("height", this.heightWC);
    //   .append("g")
    //   .attr("transform", `translate(${this.height / 2},${this.width / 2})`);

    let frequencies = data.word_frequency;
    frequencies.sort((d1, d2) => -d1.frequency + d2.frequency);
    frequencies = frequencies.slice(0, 10);
    const paddingBottom = 60;

    const rScale = d3
      .scaleLinear()
      .domain([0, d3.max(frequencies, (d) => d.frequency)])
      .range([0, (this.heightWC - paddingBottom) / 2]);

    const paddingSide = rScale(d3.max(frequencies, (d) => d.frequency));

    const xScale = d3
      .scaleLinear()
      .domain([0, frequencies.length - 1])
      .range([paddingSide, this.widthtWC - paddingSide]);

    var colors = d3
      .scaleLinear()
      .domain([
        d3.min(frequencies, (d) => d.frequency) / 2,
        d3.max(frequencies, (d) => d.frequency),
      ])
      .range(["white", "#0040ff"]);

    this.svg
      .selectAll("circle")
      .data(frequencies)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", (this.heightWC - paddingBottom) / 2)
      .attr("r", (d) => rScale(d.frequency))
      .attr("fill", (d) => colors(d.frequency))
      .on("mouseover", (event) => {
        event.target.classList.add("highlighted");
        console.log(d3.select(event.target)._groups[0][0].__data__);

        const selectedData = d3.select(event.target)._groups[0][0].__data__;
        const ranking = frequencies.findIndex(
          (d) => d.word == selectedData.word
        );
        d3.select("#tootip").html(
          `<p>Selected Word: ${selectedData.word}</p><p>Frequency: ${
            selectedData.frequency
          }</p><p>Rank: ${ranking + 1}</p>`
        );
      })
      .on("mouseout", (event) => {
        event.target.classList.remove("highlighted");
      });

    var bandScale = d3
      .scaleBand()
      .range([0, this.widthtWC])
      .domain(frequencies.map((d) => d.word))
      .padding(0.2);

    this.svg
      .append("g")
      .attr(
        "transform",
        "translate(-2," + (this.heightWC - paddingBottom) + ")"
      )
      .call(d3.axisBottom(bandScale));
  }

  update(data) {
    this.updateWordCloud(data);
    this.updateWordCount(data);
  }
}
