import React, { Component } from "react";
import BarChart from "./BarChart.js";

export default class BarChartWrapper extends Component {
  componentDidMount() {
    this.setState({
      chart: new BarChart(this.refs.barchart, this.props.topic)
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.state.chart.update(nextProps.topic);
  }

  render() {
    return <div ref="barchart"></div>;
  }
}
