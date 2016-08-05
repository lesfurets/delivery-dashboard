import React from "react";
import randomId from "../../../core/tools/randomId";
import {buildSimpleChart} from "../../../core/charts/chartFactory";

export default class Card extends React.Component {
    constructor() {
        super();
        this.state = {
            chartId: randomId(),
            chart: null
        }
    }

    componentDidMount() {
        this.setState({
            chart: buildSimpleChart(this.state.chartId, "PieChart",this.props.title)
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

Card.defaultProps = {
    title: "PieChart"
}
