import * as d3 from "d3";
import world from "./datasets/world.topojson";
import * as topojson from "topojson-client";
const covid_time = require("./datasets/country_time.json");

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 50, RIGHT: 10 };
const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 1000 - MARGIN.TOP - MARGIN.BOTTOM;

var formatDateIntoMonth = d3.timeFormat("%m");
var formatDate = d3.timeFormat("%m/%d/%Y");
var parseDate = d3.timeParse("%m/%d/%y");

var startDate = new Date("01/22/2020");
var endDate = new Date("03/08/2020");

export default class D3Chart {
  constructor(element) {
    const vis = this;
    vis.covid_time = covid_time;
    vis.cur_date = "01/22/2020";

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
      .domain([0, 1, 200, 500, 1000, 2000, 10000, 50000])
      .range([
        "#a7dea6",
        "#ffdf6b",
        "#ebab78",
        "#f09a54",
        "#f29e2e",
        "#eb6565",
        "#f04141",
        "#d92e2e"
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

    var moving = false;
    var currentValue = 0;
    var targetValue = WIDTH / 2;

    var playButton = d3.select("#play-button");

    var x = d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([0, targetValue])
      .clamp(true);

    var slider = vis.svg
      .append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + 10 + "," + 10 + ")");

    slider
      .append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
      .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
      })
      .attr("class", "track-inset")
      .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
      })
      .attr("class", "track-overlay")
      .call(
        d3
          .drag()
          .on("start.interrupt", function() {
            slider.interrupt();
          })
          .on("start drag", function() {
            handle.attr("cx", d3.event.x);
            currentValue = d3.event.x;
            vis.cur_date = formatDate(x.invert(currentValue));
            console.log(formatDate(x.invert(currentValue)));
            vis.worldReady();
          })
      );

    slider
      .insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(function(d) {
        return formatDateIntoMonth(d);
      });

    var handle = slider
      .insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

    var label = slider
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .text(formatDate(startDate))
      .attr("transform", "translate(0," + -25 + ")");

    d3.json(world).then(function(dataset) {
      vis.worldData = dataset;

      vis.countries = topojson.feature(
        dataset,
        dataset.objects.countries
      ).features;

      vis.worldReady();
    });
  }
  worldReady() {
    const vis = this;
    // create a projection with geoMercator
    // center with translate
    // scale with zooming later
    var projection = d3
      .geoMercator()
      .translate([WIDTH / 3.2, HEIGHT / 3])
      .scale(100);

    // create path using the projection
    var path = d3.geoPath().projection(projection);

    const countries = vis.svg.selectAll("path.country").data(vis.countries);

    // EXIT
    countries
      .exit()
      .transition()
      .duration(500)
      .remove();

    // add a path for each country
    countries
      .enter()
      .append("path")
      .merge(countries)
      .attr("class", "country")
      .attr("d", path)
      .style("fill", function(d) {
        let cases = vis.find_number_cases(
          covid_time,
          d.properties.name,
          vis.cur_date
        );
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
            let cases = vis.find_number_cases(
              covid_time,
              d.properties.name,
              vis.cur_date
            );
            return vis.colorScale(cases);
          });
        vis.tooltip.transition().style("opacity", 0);
      });
    console.log(countries);
  }
  find_number_cases(covid_time, name, date) {
    console.log("finding cases for" + name);
    if (name in covid_time[date]) {
      var cases = covid_time[date][name]["confirmed"];
      return cases;
    } else {
      return 0;
    }
  }
}
