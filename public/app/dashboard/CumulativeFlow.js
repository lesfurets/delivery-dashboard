import React from 'react'
import jiraConnect from '../api/jiraConnect'
import {buildCumulativeFlowChart,buildRangeFilter} from '../api/chartFactory'
import {computeEventData} from '../api/eventData'

import Card from '../components/Card'

class TaskManager extends React.Component {
    constructor(){
        super();
        this.state = {dashboard: null};
    }
    componentDidMount(){
        this.props.fetchData();

        var areaChart = buildCumulativeFlowChart("cumulative_flow_area_chart", 400);
        var chartRangeFilter = buildRangeFilter("cumulative_flow_range_filter");
        var dashboard = new google.visualization.Dashboard(document.getElementById("cumulative_flow_dashboard"));
        dashboard.bind([chartRangeFilter], areaChart);
        this.setState({dashboard: dashboard});
    }
    render() {
        if(this.state.dashboard != null){
            this.state.dashboard.draw(computeEventData(this.props.rawData));
        }
        return (
            <Card cardTitle="Cumulative Flow">
                <div id="cumulative_flow_dashboard" class="col-md-12 card-block">
                    <div id="cumulative_flow_area_chart" className="col-md-12 card-block"></div>
                    <div id="cumulative_flow_range_filter" className="col-md-12 card-block"></div>
                </div>
            </Card>
        );
    }
}

export default jiraConnect(TaskManager)