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
  const similarStories = new SimilarStories();
  const update = (
    wordCloudUpdated,
    similarStoriesUdated,
    originalStoryUpdated
  ) => {
    const selectedStory = dropdown.node().value;
    const selectedData = data.find((d) => d.title === selectedStory);
    wordCloudUpdated && wordCloud.update(selectedData);
    similarStoriesUdated &&
      similarStories.update(
        selectedData,
        +d3.select("#count").attr("value") || 10
      );
    originalStoryUpdated &&
      d3.select("#original-story").html(selectedData.html);
  };

  update(true, true, true);

  dropdown.on("change", (event) => {
    update(true, true, true);
  });
  d3.select("#count").on("input", (event) => {
    update(false, true, false);
  });
})();
