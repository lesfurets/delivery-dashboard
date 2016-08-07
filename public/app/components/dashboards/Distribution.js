import React from "react";
import ReactDom from "react-dom";
import {taskListConnect} from "../../redux/jiraConnect";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import PieChart from "./elements/PieChart";

class Distribution extends React.Component {
    constructor() {
        super();
        this.state = {
            taskFilter: (task) => true
        }
        this.update = this.update.bind(this)
    }

    update() {
        this.setState({
            taskFilter: (task) => {
                for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
                    if (!ReactDom.findDOMNode(this.refs.filters.refs["filter_" + index]).selected.match(task.filters[index])) {
                        return false;
                    }
                }
                return true;
            }
        });
    }

    computeStats(index) {
        var statsJson = this.props.taskList
            .filter(this.state.taskFilter)
            .map((task) => task.filters[index])
            .reduce((counter, item) => {
                counter[item] = counter.hasOwnProperty(item) ? counter[item] + 1 : 1;
                return counter;
            }, {});

        let statArray = [["Item", "Count"]];
        Object.keys(statsJson).forEach((key) => statArray.push([key, statsJson[key]]));

        return statArray;
    }

    render() {
        let pieCharts = RAW_DATA_COL.FILTERS
            .filter((filter) => filter.filterType == 'CategoryFilter')
            .map((filter, index) => (
                <div className="col-md-4" key={index}>
                    <PieChart title={filter.label} data={this.computeStats(index)}/>
                </div>))

        return (
            <Card cardTitle="Distribution">
                <Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/>
                {pieCharts}
            </Card>
        );
    }
}

export default taskListConnect(Distribution)