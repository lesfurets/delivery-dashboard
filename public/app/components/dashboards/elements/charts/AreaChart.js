import React from "react";
import randomId from "../../../../core/tools/randomId";
import {buildCumulativeFlowChart, buildRangeFilter} from "../../../../core/charts/chartFactory";

export default class AreaChart extends React.Component {
    constructor() {
        super();
        this.state = {
            chartId: randomId(),
            chart: null
        }
    }

    componentDidMount() {
        this.setState({
            chart: buildCumulativeFlowChart(this.state.chartId, 400)
        });
    }

    render() {
        if (this.state.chart != null) {
            if(this.props.bounds != null){
                this.state.chart.setOption('hAxis.viewWindow.min', this.props.bounds.start);
                this.state.chart.setOption('hAxis.viewWindow.max', this.props.bounds.end);
            }
            this.state.chart.setDataTable(google.visualization.arrayToDataTable(this.props.data));
            this.state.chart.draw();
        }
        return <div id={this.state.chartId}></div>;
    }
}

AreaChart.defaultProps = {
    title: "Column Chart"
}
