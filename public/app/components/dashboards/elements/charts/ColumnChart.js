import React from "react";
import randomId from "../../../../core/tools/randomId";
import {buildDurationColumnChart} from "../../../../core/charts/chartFactory";

export default class ColumnChart extends React.Component {
    constructor() {
        super();
        this.state = {
            chartId: randomId(),
            chart: null
        }
    }

    componentDidMount() {
        this.setState({
            chart: buildDurationColumnChart(this.state.chartId)
        });
    }

    render() {
        if (this.state.chart != null) {
            this.state.chart.setDataTable(google.visualization.arrayToDataTable(this.props.data));
            this.state.chart.draw();
        }
        return <div id={this.state.chartId}></div>;
    }
}

ColumnChart.defaultProps = {
    title: "Column Chart"
}
