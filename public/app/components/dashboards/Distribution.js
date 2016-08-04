import React from 'react'

import jiraConnect from '../../redux/jiraConnect'
import {buildCumulativeFlowChart, buildRangeFilter, buildSimpleCharts} from '../../core/charts/chartFactory'
import {computeEventData} from '../../core/data/eventData'
import {buildDurationColumnChart, buildDurationScatterChart, buildFilters, buildFilteredDashboard, buildDataTable} from '../../core/charts/chartFactory'
import { TASK_INDEX_STATIC_REFERENCE, TASK_INDEX_EVENTS_LAST, TASK_INDEX_FILTER_FIRST } from '../../core/data/taskData'
import { DISTRIBUTION_INDEX_STATIC_GROUP_ALL, computeDistributionData } from '../../core/data/distributionData'

import Card from './elements/Card'
import Filters from './elements/Filters'
import CategoryCharts from './elements/CategoryCharts'

class Distribution extends React.Component {
    constructor(){
        super();
        this.state = {
            dashboard: null,
            charts: null,
            timeChart: null
        };
        this.updateTable = this.updateTable.bind(this);
    }
    componentDidMount(){
        this.props.fetchData();

        let charts = buildSimpleCharts();
        let timeDistributionChart = buildDurationScatterChart("scatter_chart" ,[TASK_INDEX_EVENTS_LAST, DISTRIBUTION_INDEX_STATIC_GROUP_ALL]);
        let distributionDashboard = buildFilteredDashboard("dashboard", timeDistributionChart, buildFilters(), this.updateTable);

        this.setState({
            dashboard: distributionDashboard,
            charts: charts,
            timeChart: timeDistributionChart
        });
    }
    updateTable() {
        var durationChartData = this.state.timeChart.getDataTable();
        var dataToDisplay = durationChartData != null ? durationChartData : computeDistributionData(this.props.rawData);

        let taskChart = []
        if (dataToDisplay != null) {
            RAW_DATA_COL.FILTERS.forEach(function(filter, index) {
                if(filter.filterType == 'CategoryFilter') {
                    taskChart.push(TASK_INDEX_FILTER_FIRST + index)
                }
            });

            for(var i=0; i< this.state.charts.length; i++){
                var group = google.visualization.data.group(dataToDisplay, [taskChart[i]], [{
                    column: 1,
                    aggregation: google.visualization.data.count,
                    'type': 'number'
                }]);

                this.state.charts[i].setDataTable(group);
                this.state.charts[i].draw();
            }
        }
    };
    render() {
        if(this.state.dashboard != null) {
            var distributionData = computeDistributionData(this.props.rawData);
            this.state.dashboard.draw(distributionData);

            this.updateTable();
        }
        return (
            <Card cardTitle="Distribution">
                <div id="dashboard">
                    <Filters/>
                    <div id="scatter_chart"></div>
                    <CategoryCharts/>
                </div>
            </Card>
        );
    }
}

export default jiraConnect(Distribution)