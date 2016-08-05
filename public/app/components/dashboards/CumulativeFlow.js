import React from 'react'
import {rawDataConnect} from "../../redux/jiraConnect";
import {buildCumulativeFlowChart,buildRangeFilter} from '../../core/charts/chartFactory'
import {computeEventData} from '../../core/data/eventData'

import Card from './elements/Card'

class CumulativeFlow extends React.Component {
    constructor(){
        super();
        this.state = {dashboard: null};
    }
    componentDidMount(){
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
            <Card cardTitle="Cumulative Flow Test">
                <div id="cumulative_flow_dashboard" class="col-md-12 card-block">
                    <div id="cumulative_flow_area_chart" className="col-md-12 card-block"></div>
                    <div id="cumulative_flow_range_filter" className="col-md-12 card-block"></div>
                </div>
            </Card>
        );
    }
}

export default rawDataConnect(CumulativeFlow)