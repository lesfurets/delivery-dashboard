import React from "react";
import {buildTimePeriodDashboard, limitDashboardPeriod, buildDataTable} from "../../../core/charts/chartFactory";
import {FILTER_DATE_RANGE, FILTER_MONTH} from "../../../core/definition";
import {
    filterCreatedBefore,
    filterReleasedAfter,
    filterReleasedBefore,
    TASK_INDEX_FILTER_FIRST,
    buildTaskTable
} from "../../../core/data/taskData";
import {computeEventData} from "../../../core/data/eventData";
import {computeDurationData, groupDurationDataBy} from "../../../core/data/durationData";
import MonthSelector from "./MonthSelector";
import PeriodSelector from "./PeriodSelector";
import Switch from "./inputs/Switch";
import AreaChart from "./charts/AreaChart"
import DurationStats from "./DurationStats"
import {computeEvent} from '../../../core/data/eventData'

class Report extends React.Component {
    constructor() {
        super();
        this.state = {
            taskMatcher: (task) => true,
            cumulative: null,
            stats: null,
            startDate: null,
            endDate: null,
            reduceColumn: null,
        };
        this.updateDate = this.updateDate.bind(this);
        this.updateType = this.updateType.bind(this);
        this.update = this.update.bind(this);
    }

    update() {
        this.setState({
            taskMatcher: (task) => ReactDom.findDOMNode(this.refs.filters.refs["filter"]).selected
        });
    }

    componentDidMount() {
        let cumulative = buildTimePeriodDashboard("area_chart", this.state.startDate, this.state.endDate);
        let stats = buildDataTable(duration_stats);

        this.setState({
            cumulative: cumulative,
            stats: stats
        });
    }

    updateDate(startDate, endDate) {
        this.setState({
            startDate: startDate,
            endDate: endDate,
        })
    }

    updateType(type) {
        this.setState({
            groupBy: type,
        })
    }

    render() {
        let timeSelector;
        if (this.props.selector == FILTER_MONTH) {
            timeSelector = <MonthSelector onChange={this.updateDate}/>
        } else {
            timeSelector = <PeriodSelector onChange={this.updateDate}/>
        }

        if (this.state.cumulative != null) {
            let filteredData = filterCreatedBefore(filterReleasedAfter(buildTaskTable(this.props.taskList), this.state.startDate), this.state.endDate);

            limitDashboardPeriod(this.state.cumulative, this.state.startDate, this.state.endDate);
            this.state.cumulative.setDataTable(computeEventData(filteredData));
            this.state.cumulative.draw();

            this.state.stats.setDataTable(groupDurationDataBy(computeDurationData(filterReleasedBefore(filteredData, this.state.endDate)), TASK_INDEX_FILTER_FIRST + this.state.groupBy.position));
            this.state.stats.draw();
        }
        return (
            <div className="card to-print graph">
                <div className="row">
                    <h2 className="col-md-12 card-title">
                        <img className="print-only" src="../../img/team-traffic.png"/> Team Traffic - Cycle time -
                        {timeSelector}
                        <Switch firstValue={REPORT_CONFIG.projection[0]} secondValue={REPORT_CONFIG.projection[1]}
                                onChange={this.updateType}/>
                        <span id="tab_monthly_report_view_title_suffix"></span>
                        <div className="not-to-print pull-right">
                            <div id="tab_monthly_report_view_switch" className="switch"></div>
                            <a href="#"><span className="glyphicon glyphicon-th-list" data-toggle="modal"
                                              data-target="#tab_monthly_report_view_tasks_list_modal"></span></a>
                        </div>
                    </h2>
                </div>
                <div className="row card-relative-chart">
                    <div id="area_chart"></div>
                    <AreaChart data={computeEvent(this.props.taskList.filter((task) => task.events[task.events.length - 1] >= this.state.startDate))}
                               light bounds={{start:this.state.startDate , end:this.state.endDate}}/>
                    <div className="card to-print stats">
                        <div id="duration_stats"></div>
                        <DurationStats taskList={this.props.taskList.filter((task) => task.events[task.events.length - 1] >= this.state.startDate).filter((task) => task.events[task.events.length - 1] <= this.state.endDate)} groupBy={this.state.groupBy}/>
                    </div>
                </div>
            </div>
        )
    }
}

Report.propTypes = {
    selector: React.PropTypes.oneOf([FILTER_DATE_RANGE, FILTER_MONTH])
}

export default Report
