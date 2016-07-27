import React from 'react';
import jiraConnect from '../api/jiraConnect'
import {CONFIG_MONTH_SELECTOR, CONFIG_PERIOD_SELECTOR} from '../api/definition'

import MonthSelector from '../components/MonthSelector'
import Switch from '../components/Switch'

class Report extends React.Component {
    constructor(){
        super();
        this.state = {dashboard: null};
        this.updateDate=this.updateDate.bind(this);
        this.updateType=this.updateType.bind(this);
    }
    componentDidMount(){
        this.props.fetchData();



        // var areaChart = buildCumulativeFlowChart("cumulative_flow_area_chart", 400);
        // var chartRangeFilter = buildRangeFilter("cumulative_flow_range_filter");
        // var dashboard = new google.visualization.Dashboard(document.getElementById("cumulative_flow_dashboard"));
        // dashboard.bind([chartRangeFilter], areaChart);
        // this.setState({dashboard: dashboard});
    }
    updateDate(dateStart, dateEnd){
        console.log("Changing range from " + dateStart + " to " + dateEnd)
    }
    updateType(type){
        console.log("Changing type " + type.label)
    }
    render(){
        let timeSelector;
        if(this.props.selector == CONFIG_MONTH_SELECTOR) {
            // createDomForMonthSelector(config.id, this)
            timeSelector = <MonthSelector onChange={this.updateDate}/>
        } else {
            timeSelector = <MonthSelector onChange={this.updateDate}/>
            // createDomForPeriodSelector(config.id, this)
        }

        if(this.state.dashboard != null){
            // this.state.dashboard.draw(computeEventData(this.props.rawData));
        }
        return (
            <div className="card to-print graph">
                <div className="row">
                    <h2 className="col-md-12 card-title">
                        <img className="print-only" src="../../img/team-traffic.png"/> Team Traffic - Cycle time -
                        {timeSelector}
                        <Switch firstValue={REPORT_CONFIG.projection[0]} secondValue={REPORT_CONFIG.projection[1]} onChange={this.updateType}/>
                        <span id="tab_monthly_report_view_title_suffix"></span>
                        <div className="not-to-print pull-right">
                            <div id="tab_monthly_report_view_switch" className="switch"></div>
                            <a href="#"><span className="glyphicon glyphicon-th-list" data-toggle="modal" data-target="#tab_monthly_report_view_tasks_list_modal"></span></a>
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

export default jiraConnect(Report)
