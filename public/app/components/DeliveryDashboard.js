import React from "react";
import Menu from "./Menu";

export default class Application extends React.Component {
  constructor() {
    super();
    this.state = {chartApiLoaded: false}
  }

  componentDidMount() {
    google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});

    let component = this;
    google.setOnLoadCallback(function () {
      component.setState({chartApiLoaded: true});
    })
  }

  render() {
    return <div>
        <Menu />
        <div id="content-wrapper" className="content-wrapper container-fluid">
            <div className="container-fluid row">
              {this.state.chartApiLoaded ? this.props.children : ""}
            </div>
        </div>
    </div>;
  }
}
