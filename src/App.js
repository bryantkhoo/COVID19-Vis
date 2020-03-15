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
              <p>Worldview from 22 Jan 2020 to 08 Mar 2020</p>
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
              <p>Virus Spread Rate for top 10 infected countries</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <ChartWrapper
                className="vis-center-container"
                topic={"line"}
                statistic={"conf_pop_rate"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-10">
              <p>Deaths per confirmed case</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <ChartWrapper
                className="vis-center-container"
                topic={"line"}
                statistic={"death_rate"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <hr></hr>
            </div>
          </div>
          <div className="row">
            <div className="query-content col-xs-offset-1 col-xs-10">
              <p>Recovered case per confirmed case</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <ChartWrapper
                className="vis-center-container"
                topic={"line"}
                statistic={"rec_rate"}
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
              <p>Expediture on healthcare per person</p>
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
              <p>
                Percent of population using safely managed sanitation services
              </p>
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
              <p>Hospital beds per 10,000 people</p>
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
            <div className="col-xs-offset-1 col-xs-8">
              <p className="query-content">
                Health regulation core capability scores
              </p>
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
              <p>Health Professionals per 10,000 people</p>
            </div>
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
