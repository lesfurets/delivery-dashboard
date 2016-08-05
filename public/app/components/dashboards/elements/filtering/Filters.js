import React from "react";

export default class Filters extends React.Component {
    render() {
        let rangeFilters = [];
        let categoryFilters = [];
        if (RAW_DATA_COL.FILTERS != null) {
            categoryFilters = RAW_DATA_COL.FILTERS
                .filter((filter) => filter.filterType == 'CategoryFilter')
                .map((filter, index) => <div key={index}>{filter.label}</div>)
            rangeFilters = RAW_DATA_COL.FILTERS
                .filter((filter) => filter.filterType != 'CategoryFilter')
                .map((filter, index) => <div key={index}>{filter.label}</div>)
        }
        return (
            <div id="filters_block">
                <div className="col-md-7 text-center">
                    {rangeFilters}
                </div>
                <div className="col-md-5 text-center">
                    {categoryFilters}
                </div>
            </div>
        );
    }
}
