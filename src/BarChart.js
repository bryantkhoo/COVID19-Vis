import * as d3 from "d3";
import who_data from "./datasets/who_dataset.csv";
const flag_json = require("./datasets/new_flag_country.json");
const MARGIN = { TOP: 10, BOTTOM: 70, LEFT: 150, RIGHT: 360 };
const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
  constructor(element, topic) {
    const vis = this;
    vis.svg = d3
      .select(element)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 1000 600`)
      .classed("svg-content-responsive", true)
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    vis.xLabel = vis.svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 50)
      .attr("text-anchor", "middle");

    vis.yLabel = vis.svg
      .append("text")
      .attr("x", -(HEIGHT / 2))
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)");

    vis.xAxisGroup = vis.svg
      .append("g")
      .attr("transform", `translate(0, ${HEIGHT})`);

    vis.yAxisGroup = vis.svg.append("g");

    vis.myColor = d3
      .scaleOrdinal()
      .domain(who_data)
      .range([
        "#f3e413",
        "#99eb2e",
        "#1d9619",
        "#199690",
        "#194b96",
        "#8858a8",
        "#b8809e",
        "#be2f2f",
        "#ee8e20"
      ]);

    d3.csv(who_data).then(function(dataset) {
      console.log("who_data");
      console.log(dataset);
      dataset.forEach(function(d) {
        d.expenditure = +d.expenditure;
        d.sanitation = +d.sanitation;
        d.hospitalbeds = +d.hospitalbeds;
        d.healthregscores = +d.healthregscores;
        d.healthprofessionals = +d.healthprofessionals;
      });
      vis.data = dataset;
      vis.update(topic);
    });
  }
  update(topic) {
    console.log(topic);
    const vis = this;
    var topicString = "";
    if (topic === "expenditure") {
      topicString = "Individual Expenditure on Healthcare";
    } else if (topic === "healthprofessionals") {
      topicString = "Professionals per 10,000 people";
    } else if (topic === "sanitation") {
      topicString = "Percentage";
    } else if (topic === "hospitalbeds") {
      topicString = "Beds per 10,000 people";
    } else if (topic === "healthregscores") {
      topicString = "Score";
    }

    // Add one dot in the legend for each name.
    let size = 20;
    vis.svg
      .selectAll("mydots")
      .data(vis.data)
      .enter()
      .append("rect")
      .attr("class", "mydots")
      .attr("x", WIDTH + 50)
      .attr("y", function(d, i) {
        return HEIGHT - 350 + i * (size + 5);
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d) {
        return vis.myColor(d.country);
      });

    // Add one dot in the legend for each name.
    vis.svg
      .selectAll("mylabels")
      .data(vis.data)
      .enter()
      .append("text")
      .attr("class", "mylabels")
      .attr("x", WIDTH + 50 + size * 1.2)
      .attr("y", function(d, i) {
        return HEIGHT - 350 + i * (size + 5) + size / 2;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d) {
        return "#1a253b";
      })
      .text(function(d) {
        return d.country;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    vis.xLabel
      .text(topicString)
      .style("font-size", "25px")
      .attr("transform", `translate(0,-5)`);
    vis.yLabel
      .text(`Countries`)
      .transition()
      .duration(500)
      .attr("y", -100)
      .style("font-size", "25px");

    // update the axis scales for transition
    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          vis.data.map(function(d) {
            return d[topic];
          })
        )
      ])
      .range([0, WIDTH]);

    const y = d3
      .scaleBand()
      .domain(vis.data.map(d => d.country))
      .range([0, HEIGHT])
      .padding(0.4);

    const xAxisCall = d3.axisBottom(x);
    vis.xAxisGroup
      .attr("transform", `translate(0,${HEIGHT})`)
      .transition()
      .duration(500)
      .call(xAxisCall)
      .style("font-size", "15px");

    const yAxisCall = d3.axisLeft(y);
    vis.yAxisGroup
      .transition()
      .duration(500)
      .call(yAxisCall)
      .selectAll("text")
      .style("font-size", "15px")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-30)");

    // DATA JOIN
    const rectsCountry = vis.svg.selectAll("rect.country").data(vis.data);

    // EXIT
    rectsCountry
      .exit()
      .transition()
      .duration(500)
      .attr("height", 0)
      .attr("width", 0)
      .remove();

    // UPDATE
    rectsCountry
      .transition()
      .duration(500)
      .attr("class", "country")
      .attr("x", 0)
      .attr("y", d => y(d.country))
      .attr("height", y.bandwidth)
      .attr("width", d => x(d[topic]))
      .style("fill", function(d) {
        return vis.myColor(d.country);
      });

    // ENTER
    rectsCountry
      .enter()
      .append("rect")
      .transition()
      .duration(500)
      .attr("class", "country")
      .attr("x", 0)
      .attr("width", d => x(d[topic]))
      .attr("y", d => y(d.country))
      .attr("height", y.bandwidth)
      .style("fill", function(d) {
        return vis.myColor(d.country);
      });

    const rects = vis.svg.selectAll("rect");
    rects
      .on("mousemove", function(event) {
        vis.tooltip
          .style("top", d3.event.pageY - 51 + "px")
          .style("left", d3.event.pageX - 51 + "px");
      })
      .on("mouseover", function(d) {
        vis.tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        vis.tooltip
          .html(
            "<div>" +
              vis.get_flag_html(d.country) +
              "<h3>" +
              d.country +
              "</h3>" +
              "<p>" +
              topicString +
              " : " +
              d[topic] +
              "</p>" +
              "</div>"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function(d) {
        vis.tooltip.transition().style("opacity", 0);
      });
  }
  get_flag_html(name) {
    if (name in flag_json) {
      return (
        '<img class="flag" src="/COVID19-Vis/flags/' + flag_json[name] + '">'
      );
    } else {
      return "";
    }
  }
}
