import React from "react";
import {rawDataConnect} from "../../redux/jiraConnect";
import {
    buildDurationColumnChart,
    buildDurationScatterChart,
    buildFilters,
    buildFilteredDashboard,
    buildDataTable
} from "../../core/charts/chartFactory";
import {TASK_INDEX_STATIC_REFERENCE, TASK_INDEX_EVENTS_LAST} from "../../core/data/taskData";
import {
    DURATION_INDEX_DURATION_FIRST,
    DURATION_INDEX_DURATION_LAST,
    DURATION_INDEX_TOOLTIP,
    DURATION_INDEX_STATITICS_AVERAGE,
    DURATION_INDEX_STATITICS_50PCT,
    DURATION_INDEX_STATITICS_90PCT,
    DURATION_INDEX_STATIC_GROUP_ALL,
    computeDurationData,
    computeDurationStats,
    groupDurationDataBy
} from "../../core/data/durationData";
import Card from "./elements/Card";
import Filters from "./elements/Filters";

class Duration extends React.Component {
    constructor(){
        super();
        this.state = {
            columnChart: null,
            scatterChart: null,
            dashboard: null,
            statTable: null
        };
        this.updateTable = this.updateTable.bind(this);
    }
    componentDidMount(){
        var durationsColumns = [TASK_INDEX_STATIC_REFERENCE];
        for (var i = 0; i < RAW_DATA_COL.EVENTS.length - 1; i++) {
            durationsColumns.push(DURATION_INDEX_DURATION_FIRST + i);
            durationsColumns.push(DURATION_INDEX_TOOLTIP);
        }

        let tasksDurationColumnChart = buildDurationColumnChart("column_chart",durationsColumns);
        let tasksDurationScatterChart = buildDurationScatterChart("scatter_chart", [TASK_INDEX_EVENTS_LAST, DURATION_INDEX_DURATION_LAST, DURATION_INDEX_TOOLTIP, DURATION_INDEX_STATITICS_AVERAGE, DURATION_INDEX_STATITICS_50PCT, DURATION_INDEX_STATITICS_90PCT]);
        let tasksDurationDashboard = buildFilteredDashboard("dashboard", tasksDurationColumnChart, buildFilters(),this.updateTable);
        let tasksDurationStatsTable = buildDataTable("duration_stats");
        this.setState({
            columnChart: tasksDurationColumnChart,
            scatterChart: tasksDurationScatterChart,
            dashboard: tasksDurationDashboard,
            statTable: tasksDurationStatsTable
        });
    }
    updateTable() {
        var durationChartData = this.state.columnChart.getDataTable();
        var dataToDisplay = durationChartData != null ? durationChartData : computeDurationData(this.props.rawData);

        if (dataToDisplay != null) {
            this.state.scatterChart.setDataTable(computeDurationStats(dataToDisplay));
            this.state.scatterChart.draw();

            this.state.statTable.setDataTable(groupDurationDataBy(dataToDisplay, DURATION_INDEX_STATIC_GROUP_ALL));
            this.state.statTable.draw();
        }
    };
    render() {
        if(this.state.columnChart != null) {
            var durationData = computeDurationData(this.props.rawData);
            this.state.dashboard.draw(durationData);
            var durationChartData = this.state.columnChart.getDataTable();
            var dataToDisplay = durationChartData != null ? durationChartData : durationData;

            this.updateTable();
        }
        return (
            <Card cardTitle="Duration">
                <div id="dashboard">
                    <Filters/>
                    <div id="duration_stats"></div>
                    <div id="column_chart"></div>
                    <div id="scatter_chart"></div>
                </div>
            </Card>
        );
    }
}

export default rawDataConnect(Duration)