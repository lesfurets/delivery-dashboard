import React from "react";
import {FILTER_DATE_RANGE, FILTER_MONTH} from "../../../core/definition";
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
            bounds: { start: null, end: null},
        };
        this.updateDate = this.updateDate.bind(this);
        this.updateType = this.updateType.bind(this);
    }

    updateDate(startDate, endDate) {
        this.setState({
            bounds: {
                start: startDate,
                end: endDate,
            }
        })
    }

    updateType(type) {
        this.setState({
            groupBy: type,
        })
    }

    render() {
        let timeSelector = <PeriodSelector onChange={this.updateDate} />;
        if (this.props.selector == FILTER_MONTH) {
            timeSelector = <MonthSelector onChange={this.updateDate}/>
        } else {
            timeSelector = <PeriodSelector onChange={this.updateDate}/>
        }

        var releasedAfter = this.props.taskList.filter((task) => task.events[task.events.length - 1] >= this.state.bounds.start);
        var releasedDuring = releasedAfter.filter((task) => task.events[task.events.length - 1] <= this.state.bounds.end);
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
                    <AreaChart data={computeEvent(releasedAfter)} light bounds={this.state.bounds}/>
                    <div className="card to-print stats">
                        <DurationStats taskList={releasedDuring} groupBy={this.state.groupBy} lite/>
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
