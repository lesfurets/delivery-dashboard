import React from "react";
import ReactDom from "react-dom";
import {taskListConnect} from "../../redux/jiraConnect";
import {computeDurations} from "../../core/data/durationData";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import DurationStats from "./elements/DurationStats";
import ColumnChart from "./elements/charts/ColumnChart";

class Duration extends React.Component {
    constructor() {
        super();
        this.state = {
            matcherList: [],
        };
        this.update = this.update.bind(this);
        this.taskFilter = this.taskFilter.bind(this);
    }

    update() {
        this.setState({
            matcherList: RAW_DATA_COL.FILTERS
                .map((filter, index) => ReactDom.findDOMNode(this.refs.filters.refs["filter_" + index]).selected)
        });
    }

    taskFilter(task) {
        for (var index = 0; index < this.state.matcherList.length; index++) {
            if (!this.state.matcherList[index].match(task.filters[index])) {
                return false;
            }
        }
        return true;
    }

    render() {
        let filteredTaskList = this.props.taskList.filter(this.taskFilter);
        var durationData = computeDurations(filteredTaskList);
        return (
            <Card cardTitle="Duration" data={filteredTaskList}>
                <div className="col-md-12"><Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/></div>
                <div className="col-md-12"><DurationStats taskList={filteredTaskList}/></div>
                <div className="col-md-12"><ColumnChart data={durationData}/></div>
            </Card>
        );
    }
}

export default taskListConnect(Duration)