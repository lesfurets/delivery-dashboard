import React from "react";
import CategoryFilter from "./CategoryFilter";
import DateRangeFilter from "./DateRangeFilter";

function listValues(taskList, index) {
    return taskList.map((task) => task.filters[index])
        .filter((task, index, array) => index == array.indexOf(task))
        .sort();
}

export default class Filters extends React.Component {
    constructor() {
        super();
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
                    rangeFilters.push(<DateRangeFilter key={index}
                                                       ref={"filter_" + index}
                                                       label={filter.label}
                                                       startDate={startDate}
                                                       rangeStartDate={startDate}
                                                       rangeEndDate={endDate}
                                                       onChange={this.props.onChange}/>)
                }
            });
        }
        return (
            <div id="filters_block">
                <div className="col-md-6">
                    {rangeFilters}
                </div>
                <div className="col-md-6">
                    {categoryFilters}
                </div>
            </div>
        );
    }
}
