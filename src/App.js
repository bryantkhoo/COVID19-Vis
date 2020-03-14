import React, { Component } from "react";
import ChartWrapper from "./ChartWrapper";
import BarChartWrapper from "./BarChartWrapper";

class App extends Component {
  // state = {
  //   topic: "map"
  // };

  toggleNomineeAwards = topic => this.setState({ topic });

  render() {
    return (
      <div className="App">
        <div className="row">
          <div className="header col-xs-offset-2 col-xs-8">
            <p>Novel Corona Virus 2019</p>
            <div className="subheader">
              <p>A visualisation by KJSBryant</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-offset-1 col-xs-10">
            <hr></hr>
          </div>
        </div>
        <div className="article">
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-10">
              <h2>Worldview from 22 Jan 2020 to 08 Mar 2020</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <ChartWrapper className="vis-center-container" topic={"map"} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-10">
              <h2>Virus Spread Rate for top 10 infected countries</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <ChartWrapper className="vis-center-container" topic={"line"} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-8">
              <h2>Expediture on healthcare per person</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <BarChartWrapper
                className="vis-center-container"
                topic={"expenditure"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-8">
              <h2>
                Percent of population using safely managed sanitation services
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <BarChartWrapper
                className="vis-center-container"
                topic={"sanitation"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-8">
              <h2>Hospital beds per 10,000 people</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <BarChartWrapper
                className="vis-center-container"
                topic={"hospitalbeds"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-8">
              <h2>Health regulation core capability scores</h2>
              <p className="text-content"> Average of international surveys</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <BarChartWrapper
                className="vis-center-container"
                topic={"healthregscores"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-8">
              <h2>Health Professionals per 10,000 people</h2>
            </div>
            <p className="text-content"> Average of international surveys</p>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <BarChartWrapper
                className="vis-center-container"
                topic={"healthprofessionals"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
