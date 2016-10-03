import React from "react";
import ReactDom from "react-dom";
import {taskListConnect} from "../../redux/jiraConnect";
import {computeDistribution} from "../../core/data/distributionData";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import PieChart from "./elements/charts/PieChart";

class Distribution extends React.Component {
    constructor() {
        super();
        this.state = {
            matcherList: []
        }
        this.update = this.update.bind(this)
        this.taskFilter = this.taskFilter.bind(this)
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

        let pieCharts = RAW_DATA_COL.FILTERS
            .filter((filter) => filter.filterType == 'CategoryFilter')
            .map((filter, index) => (
                <div className="col-md-4" key={index}>
                    <PieChart title={filter.label} data={computeDistribution(filteredTaskList, index)}/>
                </div>));

        return (
            <Card cardTitle="Distribution" data={filteredTaskList}>
                <div className="col-md-12"><Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/></div>
                <div className="col-md-12">{pieCharts}</div>
            </Card>
        );
    }
}

export default taskListConnect(Distribution)