import * as d3 from "d3";
import world from "./datasets/world.topojson";
import * as topojson from "topojson-client";
import covid_time from "./datasets/2019_nCoV_data.csv";

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 50, RIGHT: 10 };
const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 1000 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
  constructor(element) {
    const vis = this;

    vis.svg = d3
      .select(element)
      .append("svg")
      //.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      //.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 800 500`)
      .classed("svg-content-responsive", true)
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    //Append a defs (for definition) element to your SVG
    var defs = vis.svg.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient");

    //A color scale
    vis.colorScale = d3
      .scaleLinear()
      .domain([0, 10000])
      .range([
        "#fce9a2",
        "#ffdf6b",
        "#ebab78",
        "#f09a54",
        "#f29e2e",
        "#eb6565",
        "#f04141",
        "d92e2e"
      ]);

    //Append multiple color stops by using D3's data/enter step
    linearGradient
      .selectAll("stop")
      .data(vis.colorScale.range())
      .enter()
      .append("stop")
      .attr("offset", function(d, i) {
        return i / (vis.colorScale.range().length - 1);
      })
      .attr("stop-color", function(d) {
        return d;
      });
    d3.csv(covid_time).then(function(dataset) {
      vis.covid_time = dataset;
      console.log(dataset.slice(0, 37));
      d3.json(world).then(function(dataset) {
        vis.worldData = dataset;

        var countries = topojson.feature(dataset, dataset.objects.countries)
          .features;

        vis.worldReady(countries);
      });
    });
  }
  worldReady(countries) {
    const vis = this;

    console.log("Countries");
    console.log(countries);

    // create a projection with geoMercator
    // center with translate
    // scale with zooming later
    var projection = d3
      .geoMercator()
      .translate([WIDTH / 3.2, HEIGHT / 3])
      .scale(100);

    // create path using the projection
    var path = d3.geoPath().projection(projection);

    // add a path for each country
    vis.svg
      .selectAll(".country")
      .data(countries)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)
      .style("fill", function(d) {
        let cases = vis.find_number_cases(d.properties.name);
        console.log(d, vis.colorScale(cases));
        return vis.colorScale(cases);
      })
      .on("mousemove", function(event) {
        vis.tooltip
          .style("top", d3.event.pageY - 51 + "px")
          .style("left", d3.event.pageX - 51 + "px");
      })
      .on("mouseover", function(d) {
        console.log(d.properties.name);
        d3.select(this)
          .classed("hover-country", true)
          .style("fill", "#b0f3f7");
        vis.tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
        vis.tooltip
          .html("<div><p>" + d.properties.name + "</p></div>")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .classed("hover-country", false)
          .style("fill", function(d) {
            let cases = vis.find_number_cases(d.properties.name);
            console.log(d, vis.colorScale(cases));
            return vis.colorScale(cases);
          });
        vis.tooltip.transition().style("opacity", 0);
      });
  }
  update() {}
  find_number_cases(name) {
    this.covid_time.forEach(data => {
      if (data.Country === name) {
        return data.confirmed;
      }
    });
    return 0;
  }
}
