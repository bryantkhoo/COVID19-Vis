import React, { Component } from "react";
import D3Chart from "./D3Chart";

import ZoomChart from "./ZoomChart";

export default class ChartWrapper extends Component {
  componentDidMount() {
    if (this.props.topic === "map") {
      this.setState({
        chart: new D3Chart(this.refs.map)
      });
    } else if (this.props.topic === "line") {
      this.setState({
        chart: new ZoomChart(this.refs.line)
      });
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.state.chart.update(nextProps.topic);
  }

  render() {
    return <div ref={this.props.topic}></div>;
  }
}
