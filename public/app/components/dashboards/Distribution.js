import React from "react";
import ReactDom from "react-dom";
import {taskListConnect} from "../../redux/jiraConnect";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import PieChart from "./elements/PieChart";

class Distribution extends React.Component {
    constructor() {
        super();
        this.update = this.update.bind(this)
    }

    update() {
        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach((filter, index) => {
                if (filter.filterType == 'CategoryFilter') {
                    console.log(filter.label + " => " + ReactDom.findDOMNode(this.refs.filters.refs["filter_" + index]).selected);
                }
            });
        }
    }

    render() {
        var data = [
            ['Task', 'Hours per Day'],
            ['Work', 11],
            ['Eat', 2],
            ['Commute', 2],
            ['Watch TV', 2],
            ['Sleep', 7]
        ];

        let pieCharts = RAW_DATA_COL.FILTERS
            .filter((filter) => filter.filterType == 'CategoryFilter')
            .map((filter) => <div className="col-md-4"><PieChart title={filter.label} data={data}/></div>)

        return (
            <Card cardTitle="Distribution">
                <div id="dashboard">
                    <Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/>
                    {pieCharts}
                </div>
            </Card>
        );
    }
}

export default taskListConnect(Distribution)