import React from "react";
import ReactDom from "react-dom";
import {taskListConnect} from "../../redux/jiraConnect";
import {computeDurationByDate} from "../../core/data/durationData";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import ScatterChart from "./elements/charts/ScatterChart";

class DurationScatter extends React.Component {
    constructor() {
        super();
        this.state = {
            matcherList: [],
        };
        this.update = this.update.bind(this);
        this.taskFilter = this.taskFilter.bind(this);
    }

    update() {
      let matcherList = RAW_DATA_COL.FILTERS.map((filter, index) => ReactDom.findDOMNode(this.refs.filters.refs["filter_" + index]).selected);
      // matcherList.push(ReactDom.findDOMNode(this.refs.filters.refs.filter_date).selected)
      this.setState({
            matcherList: matcherList
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
        let filteredTaskList = this.props.taskList.filter(task => task.events[task.events.length - 1] != null).filter(this.taskFilter);
        var durationData = computeDurationByDate(filteredTaskList);
        return (
            <Card cardTitle="Duration" data={filteredTaskList}>
                <div className="col-md-12"><Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/></div>
                <div className="col-md-12"><ScatterChart data={durationData}/></div>
            </Card>
        );
    }
}

export default taskListConnect(DurationScatter)