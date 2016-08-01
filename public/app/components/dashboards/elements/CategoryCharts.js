import React from 'react';

export default class CategoryCharts extends React.Component {
    render() {
        var categoryCharts = [];
        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach(function(filter, index) {
                if(filter.filterType == 'CategoryFilter') {
                    categoryCharts.push(<div className="col-md-4"><div id={"category_" + index} key={index}></div></div>)
                }
            });
        }
        return (
            <div id="category_charts">
                {categoryCharts}
            </div>
        );
    }
}
