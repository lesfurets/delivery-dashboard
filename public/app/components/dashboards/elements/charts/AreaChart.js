import React from "react";
import randomId from "../../../../core/tools/randomId";
import {buildCumulativeFlowChart, buildRangeFilter} from "../../../../core/charts/chartFactory";

export default class AreaChart extends React.Component {
    constructor() {
        super();
        this.state = {
            chartId: randomId(),
            filterId: randomId(),
            dashboardId: randomId(),
            dashboard: null
        }
    }

    componentDidMount() {
        var areaChart = buildCumulativeFlowChart(this.state.chartId, 400);
        var chartRangeFilter = buildRangeFilter(this.state.filterId);

        var dashboard = new google.visualization.Dashboard(document.getElementById(this.state.dashboardId));
        dashboard.bind([chartRangeFilter], [areaChart]);

        this.setState({
            dashboard: dashboard
        });
    }

    render() {
        if (this.state.dashboard != null) {
           this.state.dashboard.draw(google.visualization.arrayToDataTable(this.props.data));
        }
        return (
            <div id={this.state.dashboardId}>
                <div id={this.state.chartId}></div>
                <div id={this.state.filterId}></div>
            </div>
        );
    }
}

AreaChart.defaultProps = {
    title: "Column Chart"
}
