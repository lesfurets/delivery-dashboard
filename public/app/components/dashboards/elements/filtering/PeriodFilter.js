import React from "react";
import DateRangeFilter from "./DateRangeFilter";
import MonthFilter from "./MonthFilter";

export default class PeriodFilter extends React.Component {
    render() {
        return this.props.selector == PeriodFilter.DATE_RANGE_SELECTOR ?
            <DateRangeFilter {...this.props}/> : <MonthFilter {...this.props}> doing </MonthFilter>;
    }
}

PeriodFilter.MONTH_SELECTOR = {label: "Month"};
PeriodFilter.DATE_RANGE_SELECTOR = {label: "Date"};

PeriodFilter.propTypes = {
    selector: React.PropTypes.oneOf([PeriodFilter.MONTH_SELECTOR, PeriodFilter.DATE_RANGE_SELECTOR])
}

PeriodFilter.defaultProps ={
    selector: PeriodFilter.DATE_RANGE_SELECTOR
}
