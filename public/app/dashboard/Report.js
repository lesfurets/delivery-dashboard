import React from "react";
import {buildTimePeriodDashboard, limitDashboardPeriod, buildDataTable} from "../api/chartFactory";
import {CONFIG_MONTH_SELECTOR, CONFIG_PERIOD_SELECTOR} from "../api/definition";
import {filterCreatedBefore, filterReleasedAfter, filterReleasedBefore, TASK_INDEX_FILTER_FIRST} from "../api/taskData";
import {computeEventData} from "../api/eventData";
import {computeDurationData, groupDurationDataBy} from "../api/durationData";
import MonthSelector from "../components/MonthSelector";
import PeriodSelector from "../components/PeriodSelector";
import Switch from "../components/Switch";

class Report extends React.Component {
    constructor() {
        super();
        this.state = {
            cumulative: null,
            stats: null,
            startDate: null,
            endDate: null,
            reduceColumn: null,
        };
        this.updateDate = this.updateDate.bind(this);
        this.updateType = this.updateType.bind(this);
    }

    componentDidMount() {
        this.props.fetchData();

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
            groupType: type,
        })
    }

    render() {
        let timeSelector;
        if (this.props.selector == CONFIG_MONTH_SELECTOR) {
            timeSelector = <MonthSelector onChange={this.updateDate}/>
        } else {
            timeSelector = <PeriodSelector onChange={this.updateDate}/>
        }

        if (this.state.cumulative != null) {
            let filteredData = filterCreatedBefore(filterReleasedAfter(this.props.rawData, this.state.startDate), this.state.endDate);

            limitDashboardPeriod(this.state.cumulative, this.state.startDate, this.state.endDate);
            this.state.cumulative.setDataTable(computeEventData(filteredData));
            this.state.cumulative.draw();

            this.state.stats.setDataTable(groupDurationDataBy(computeDurationData(filterReleasedBefore(filteredData, this.state.endDate)), TASK_INDEX_FILTER_FIRST + this.state.groupType.position));
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
                    <div className="card to-print stats">
                        <div id="duration_stats"></div>
                    </div>
                </div>
            </div>
        )
    }
}

Report.protoTypes = {
    selector: React.PropTypes.oneOf([CONFIG_MONTH_SELECTOR, CONFIG_PERIOD_SELECTOR])
}

export default Report
