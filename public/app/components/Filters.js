import React from 'react';

export default class Filters extends React.Component {
    render() {
        var rangeFilters = [];
        var categoryFilters = [];
        if (RAW_DATA_COL.FILTERS != null) {
            for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {

                let element = <div id={"filter_" + index} key={index}></div>;

                if (RAW_DATA_COL.FILTERS[index].filterType == 'CategoryFilter') {
                    categoryFilters.push(element);
                } else {
                    rangeFilters.push(element);
                }
            }
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
