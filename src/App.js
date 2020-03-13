import React, { Component } from "react";
import ChartWrapper from "./ChartWrapper";
import content from "./content/content";

class App extends Component {
  state = {
    topic: "nominated"
  };

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
          <div className="col-xs-offset-2 col-xs-8">
            <hr></hr>
          </div>
        </div>
        <div className="row">
          <div className="nav-container col-xs-offset-1 col-xs-10">
            <ul id="nav">
              <li>
                <button href="#home">World</button>
              </li>
              <li>
                <button href="#news">Stats</button>
              </li>
              <li>
                <button href="#contact">Singapore</button>
              </li>
              <li>
                <button href="#about">News</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="article">
          <div className="row">
            <div className="col-xs-12">
              <ChartWrapper
                className="vis-center-container"
                topic={this.state.topic}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <p className="text-content">{content[0].text}</p>
            </div>
            <div className="col-xs-1">
              <div className="row">
                <button
                  className="float"
                  onClick={() => this.toggleNomineeAwards("nominated")}
                >
                  1
                </button>
              </div>
              <div className="row">
                <button
                  className="float"
                  onClick={() => this.toggleNomineeAwards("awarded")}
                >
                  2
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <p className="query-content">{content[1].query}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-2 col-xs-8">
              <p className="query-content">{content[2].query}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
