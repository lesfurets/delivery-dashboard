import React from 'react'
import {taskListConnect} from "../../redux/jiraConnect";
import {buildCumulativeFlowChart,buildRangeFilter} from '../../core/charts/chartFactory'
import {computeEventData} from '../../core/data/eventData'
import {buildTaskTable} from '../../core/data/taskData'
import AreaChart from './elements/charts/AreaChart'

import Card from './elements/Card'

class CumulativeFlow extends React.Component {
    constructor(){
        super();
        this.state = {dashboard: null};
    }
    componentDidMount(){
        // var areaChart = buildCumulativeFlowChart("cumulative_flow_area_chart", 400);
        // var chartRangeFilter = buildRangeFilter("cumulative_flow_range_filter");
        // var dashboard = new google.visualization.Dashboard(document.getElementById("cumulative_flow_dashboard"));
        // dashboard.bind([chartRangeFilter], areaChart);
        // this.setState({dashboard: dashboard});
    }
    render() {
        if(this.state.dashboard != null){
            this.state.dashboard.draw(computeEventData(buildTaskTable(this.props.taskList)));
        }
        let data = [
            ["Date","Todo","Doing","Done"],
            [new Date(2016,1,1),1,0,0],
            [new Date(2016,1,2),3,2,0],
            [new Date(2016,1,3),5,4,1],
            [new Date(2016,1,4),6,5,2],
            [new Date(2016,1,5),8,6,4],
            [new Date(2016,1,6),10,9,6],
            [new Date(2016,1,7),11,11,9]
        ];

        return (
            <Card cardTitle="Cumulative Flow Test">
                <AreaChart data={data}/>
                {/*<div id="cumulative_flow_dashboard" class="col-md-12 card-block">*/}
                    {/*<div id="cumulative_flow_area_chart" className="col-md-12 card-block"></div>*/}
                    {/*<div id="cumulative_flow_range_filter" className="col-md-12 card-block"></div>*/}
                {/*</div>*/}
            </Card>
        );
    }
}

export default taskListConnect(CumulativeFlow)