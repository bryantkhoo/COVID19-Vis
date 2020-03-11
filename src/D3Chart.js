import * as d3 from "d3";
import world from "./datasets/world.topojson";
import * as topojson from "topojson-client";
const covid_time = require("./datasets/country_time.json");
const flag_json = require("./datasets/new_flag_country.json");

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 50, RIGHT: 10 };
const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 1000 - MARGIN.TOP - MARGIN.BOTTOM;

var formatDate = d3.timeFormat("%m/%d/%Y");

var startDate = new Date("01/22/2020");
var endDate = new Date("03/08/2020");

export default class D3Chart {
  constructor(element) {
    const vis = this;
    vis.covid_time = covid_time;
    vis.cur_date = "01/22/2020"; // start date

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
      .domain([0, 5, 50, 200, 1000, 2000, 10000, 50000])
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

    var currentValue = 0;
    var targetValue = WIDTH / 2;

    var x = d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([0, targetValue])
      .clamp(true);

    vis.slider = vis.svg
      .append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + 75 + "," + 10 + ")");

    vis.slider
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
            vis.slider.interrupt();
          })
          .on("start drag", function() {
            handle.attr("cx", d3.event.x);
            currentValue = d3.event.x;
            vis.cur_date = formatDate(x.invert(currentValue));
            console.log(formatDate(x.invert(currentValue)));
            vis.worldReady();
          })
      );

    vis.slider
      .insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 10 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(function(d) {
        return formatDate(d);
      });

    vis.sliderLabel = vis.slider.append("text");

    var handle = vis.slider
      .insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

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

    vis.sliderLabel
      .text(vis.cur_date)
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(-75," + 10 + ")");

    var projection = d3
      .geoMercator()
      .translate([WIDTH / 3.2, HEIGHT / 2.8])
      .scale(100);

    var zoom = d3
      .zoom()
      .scaleExtent([1, 50])
      .translateExtent([
        [0, 0],
        [WIDTH - 300, HEIGHT - 450]
      ])
      .on("zoom", function() {
        vis.svg.selectAll("path").attr("transform", d3.event.transform);
        vis.slider.raise();
      });

    vis.svg.call(zoom);

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
        return vis.colorScale(cases[0]);
      })
      .on("mousemove", function(event) {
        vis.tooltip
          .style("top", d3.event.pageY - 51 + "px")
          .style("left", d3.event.pageX - 51 + "px");
      })
      .on("mouseover", function(d) {
        let cases = vis.find_number_cases(
          covid_time,
          d.properties.name,
          vis.cur_date
        );
        console.log(d.properties.name);
        d3.select(this)
          .classed("hover-country", true)
          .style("fill", "#b0f3f7");
        vis.tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
        vis.tooltip
          .html(
            "<div>" +
              vis.get_flag_html(d.properties.name) +
              "<h3>" +
              d.properties.name +
              "</h3><p>Confirmed: " +
              cases[0] +
              "</p><p>Deaths: " +
              cases[1] +
              "</p><p>Recovered: " +
              cases[2] +
              "</p></div>"
          )
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
            return vis.colorScale(cases[0]);
          });
        vis.tooltip.transition().style("opacity", 0);
      });
  }
  find_number_cases(covid_time, name, date) {
    if (name in covid_time[date]) {
      var confirmed = covid_time[date][name]["confirmed"];
      var deaths = covid_time[date][name]["deaths"];
      var recovered = covid_time[date][name]["recovered"];
      return [confirmed, deaths, recovered];
    } else {
      return [0, 0, 0];
    }
  }
  get_flag_html(name) {
    if (name in flag_json) {
      return '<img class="flag" src="/flags/' + flag_json[name] + '">';
    } else {
      return "";
    }
  }
}
