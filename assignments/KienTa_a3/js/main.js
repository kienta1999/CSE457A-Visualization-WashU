(async () => {
  const data = await d3.json("processed_englishfairytales.json");
  const dropdown = d3.select("#story");
  dropdown
    .selectAll(".story-option")
    .data(data)
    .enter()
    .append("option")
    .classed("story-option", true)
    .attr("value", (d) => d.title)
    .html((d) => d.title);

  const wordCloud = new WordCloud();

  dropdown.on("change", (event) => {
    const selectedStory = dropdown.node().value;
    const selectedData = data.find((d) => d.title === selectedStory);
    wordCloud.update(selectedData);
    d3.select("#original-story").html(selectedData.html);
  });
})();
