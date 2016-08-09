import React from "react";
import CategoryFilter from "./CategoryFilter";
import PeriodFilter from "./PeriodFilter";
import Switch from "../Switch";

function listValues(taskList, index) {
    return taskList.map((task) => task.filters[index])
        .filter((task, index, array) => index == array.indexOf(task))
        .sort();
}

export default class Filters extends React.Component {
    constructor() {
        super();
        this.state = {
            periodType: PeriodFilter.DATE_RANGE_SELECTOR
        }
        this.updateType = this.updateType.bind(this);
    }

    updateType(type) {
        this.setState({
            periodType: type,
        })
    }

    render() {
        let startDate = new Date(REPORT_CONFIG.first_entry);
        let endDate = new Date();

        let rangeFilters = [];
        let categoryFilters = [];
        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach((filter, index) => {
                if (filter.filterType == 'CategoryFilter') {
                    categoryFilters.push(<CategoryFilter key={index}
                                                         ref={"filter_" + index}
                                                         label={filter.label}
                                                         onChange={this.props.onChange}
                                                         values={listValues(this.props.taskList, index)}/>);
                } else {
                    rangeFilters.push(<PeriodFilter key={index}
                                                    ref={"filter_" + index}
                                                    label={filter.label}
                                                    startDate={startDate}
                                                    onChange={this.props.onChange}
                                                    selector={this.state.periodType}/>)
                }
            });
        }
        return (
            <div id="filters_block">
                <div className="col-md-6">
                    {categoryFilters}
                </div>
                <div className="col-md-6">
                    <div className="col-md-12" selected={this.state.matcher}>
                        <Switch firstValue={PeriodFilter.DATE_RANGE_SELECTOR} secondValue={PeriodFilter.MONTH_SELECTOR} onChange={this.updateType}/>
                    </div>
                    {rangeFilters}
                </div>
            </div>
        );
    }
}
