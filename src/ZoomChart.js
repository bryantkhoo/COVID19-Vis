import * as d3 from "d3";
const growth_rate = require("./datasets/growth_rate.json");
const flag_json = require("./datasets/new_flag_country.json");

const MARGIN = { TOP: 10, BOTTOM: 100, LEFT: 50, RIGHT: 10 };
const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 700 - MARGIN.TOP - MARGIN.BOTTOM;

var margin = { top: 20, right: 20, bottom: 110, left: 50 },
  margin2 = { top: 430, right: 20, bottom: 50, left: 50 },
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  height2 = 500 - margin2.top - margin2.bottom;

export default class ZoomChart {
  constructor(element, statistic) {
    const vis = this;
    vis.statistic = statistic;
    vis.statisticString = "";
    vis.statisticDomain = 1;
    if (vis.statistic === "conf_pop_rate") {
      vis.statisticString = "Virus Spread Rate per million citizens";
      vis.statisticDomain = 1;
    } else if (vis.statistic === "death_rate") {
      vis.statisticString = "Deaths per confirmed case";
      vis.statisticDomain = 0.4;
    } else if (vis.statistic === "rec_rate") {
      vis.statisticString = "Recovered cases per confirmed case";
      vis.statisticDomain = 1.2;
    }
    console.log(vis.statistic);

    console.log("growth_rate");
    console.log(growth_rate);
    vis.growth_rate = growth_rate;
    vis.cur_date = "01/22/2020"; // start date
    //add svg with margin !important
    //this is svg is actually group
    vis.svg = d3
      .select(element)
      .append("svg")
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom);
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 800 500`);

    vis.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    vis.focus = vis.svg
      .append("g") //add group to leave margin for axis
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    vis.context = vis.svg
      .append("g")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    vis.xLabel = vis.svg
      .append("text")
      .attr("x", WIDTH / 1.6)
      .attr("y", HEIGHT - 170)
      .attr("text-anchor", "middle");
    vis.yLabel = vis.svg
      .append("text")
      .attr("x", -(HEIGHT / 2 - 100))
      .attr("y", +20)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)");
    vis.xLabel.text("Days from 01/22/2020");
    vis.yLabel.text(vis.statisticString);

    vis.yScale = d3
      .scaleLinear()
      .range([0, height])
      .domain([vis.statisticDomain, 0]);
    //add x axis
    vis.xScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([
        0,
        d3.max(growth_rate, function(d) {
          return d[vis.statistic].length;
        })
      ]); //scaleBand is used for  bar chart

    vis.xScale2 = d3
      .scaleLinear()
      .range([0, width])
      .domain([
        0,
        d3.max(growth_rate, function(d) {
          return d[vis.statistic].length;
        })
      ]);
    vis.yScale2 = d3
      .scaleLinear()
      .range([0, height2])
      .domain([2, 0]);

    vis.myColor = d3
      .scaleOrdinal()
      .domain(growth_rate)
      .range([
        "#b8809e",
        "#be2f2f",
        "#ee8e20",
        "#f3e413",
        "#99eb2e",
        "#1d9619",
        "#199690",
        "#194b96",
        "#8858a8"
      ]);

    // Add one dot in the legend for each name.
    let size = 20;
    vis.svg
      .selectAll("mydots")
      .data(growth_rate)
      .enter()
      .append("rect")
      .attr("class", "mydots")
      .attr("x", WIDTH - 500)
      .attr("y", function(d, i) {
        return HEIGHT - 550 + i * (size + 5);
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d) {
        return vis.myColor(d.country);
      })
      .on("click", function(d) {
        console.log(
          d.country.replace(/\s/g, "") + vis.statisticString.replace(/\s/g, "")
        );
        var currentColor = d3.select(this).style("fill");
        if (currentColor === "rgb(26, 37, 59)") {
          currentColor = vis.myColor(d.country);
        } else {
          currentColor = "#1a253b";
        }
        d3.select(this).style("fill", currentColor);
        var newOpacity = d3
          .select(
            "#" +
              d.country.replace(/\s/g, "") +
              vis.statisticString.replace(/\s/g, "")
          )
          .style("opacity");
        console.log(newOpacity);
        if (newOpacity === "0") {
          newOpacity = "1";
        } else {
          newOpacity = "0";
        }
        d3.select(
          "#" +
            d.country.replace(/\s/g, "") +
            vis.statisticString.replace(/\s/g, "")
        ).style("opacity", newOpacity);
      });

    // Add one dot in the legend for each name.
    vis.svg
      .selectAll("mylabels")
      .data(growth_rate)
      .enter()
      .append("text")
      .attr("class", "mylabels")
      .attr("x", WIDTH - 500 + size * 1.2)
      .attr("y", function(d, i) {
        return HEIGHT - 550 + i * (size + 5) + size / 2;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d) {
        return "#1a253b";
      })
      .text(function(d) {
        return d.country;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
    this.update();
  }
  update() {
    const vis = this;
    //for each d, d[0] is the first num, d[1] is the second num
    //set y scale

    vis.line = d3
      .line()
      .x(function(d, i) {
        return vis.xScale(i);
      })
      .y(function(d) {
        return vis.yScale(d);
      })
      .curve(d3.curveMonotoneX); //default is d3.curveLinear

    const linegroup = vis.focus.selectAll(".path.linegroup1").data(growth_rate);

    linegroup
      .exit()
      .transition()
      .duration(500)
      .remove();

    linegroup
      .enter()
      .append("path")
      .merge(linegroup)
      .attr("class", "linegroup1")
      .attr("id", function(d) {
        return (
          d.country.replace(/\s/g, "") + vis.statisticString.replace(/\s/g, "")
        );
      })
      .attr("d", function(d) {
        return vis.line(d[vis.statistic]);
      })
      .attr("stroke", function(d) {
        return vis.myColor(d.country);
      })
      .on("mousemove", function(event) {
        vis.tooltip
          .style("top", d3.event.pageY - 51 + "px")
          .style("left", d3.event.pageX - 51 + "px");
      })
      .on("mouseover", function(d) {
        vis.tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
        vis.tooltip
          .html(
            "<div>" +
              vis.get_flag_html(d.country) +
              "<h3>" +
              d.country +
              "'s " +
              vis.statisticString +
              "</p></div>"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this);
        vis.tooltip.transition().style("opacity", 0);
      });

    vis.line2 = d3
      .line()
      .x(function(d, i) {
        return vis.xScale2(i);
      })
      .y(function(d) {
        return vis.yScale2(d);
      })
      .curve(d3.curveMonotoneX); //default is d3.curveLinear

    const linegroup2 = vis.context
      .selectAll(".path.linegroup2")
      .data(growth_rate);
    linegroup2
      .exit()
      .transition()
      .duration(500)
      .remove();

    linegroup2
      .enter()
      .append("path")
      .merge(linegroup)
      .attr("class", "linegroup2")
      .attr("d", function(d) {
        return vis.line2(d[vis.statistic]);
      })
      .attr("stroke", function(d) {
        return vis.myColor(d.country);
      });

    //add x and y axis
    var yAxis = d3.axisLeft(vis.yScale).tickSize(-width);
    vis.focus.append("g").call(yAxis);

    var xAxis = d3
      .axisBottom(vis.xScale)
      .tickSize(-height); /*.tickFormat("");remove tick label*/
    var xAxisGroup = vis.focus
      .append("g")
      .call(xAxis)
      .attr("transform", "translate(0," + height + ")");

    var xAxis2 = d3.axisBottom(vis.xScale2); //no need to create grid
    vis.context
      .append("g")
      .call(xAxis2)
      .attr("transform", "translate(0," + height2 + ")");

    //add zoom
    var zoom = d3
      .zoom()
      .scaleExtent([1, Infinity]) // <1 means can resize smaller than  original size
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .extent([
        [0, 0],
        [width, height]
      ]) //view point size
      .on("zoom", zoomed);
    vis.svg
      .append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);

    //add brush
    //Brush must be added in a group
    var brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height2]
      ]) //(x0,y0)  (x1,y1)
      .on("brush end", brushed); //when mouse up, move the selection to the exact tick //start(mouse down), brush(mouse move), end(mouse up)

    vis.context
      .append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, vis.xScale2.range());

    function zoomed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
      vis.xScale.domain(d3.event.transform.rescaleX(vis.xScale2).domain());
      vis.focus.selectAll(".linegroup1").attr("d", function(d) {
        return vis.line(d[vis.statistic]);
      });
      xAxisGroup.call(xAxis); //rescale x

      //brush area
      vis.context
        .select(".brush")
        .call(brush.move, [
          vis.xScale2(d3.event.transform.rescaleX(vis.xScale2).domain()[0]),
          vis.xScale2(d3.event.transform.rescaleX(vis.xScale2).domain()[1])
        ]);
    }

    function brushed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
      /*1. For zooming, the same idea with zoomed function. Get the new input of vis.xScale
vis.xScale.domain([vis.xScale2.invert(d3.event.selection[0]),vis.xScale2.invert(d3.event.selection[1])]);//easy to understand

Or use api x.domain(d3.event.selection.map(vis.xScale2.invert, vis.xScale2));
*/
      vis.xScale.domain([
        vis.xScale2.invert(d3.event.selection[0]),
        vis.xScale2.invert(d3.event.selection[1])
      ]);

      vis.focus.selectAll(".linegroup1").attr("d", function(d) {
        return vis.line(d[vis.statistic]);
      });
      xAxisGroup.call(xAxis); //rescale x
    }

    //add clip path to the svg
    vis.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);
    vis.focus.selectAll(".linegroup1").attr("clip-path", "url(#clip)");
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
