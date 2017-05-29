import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import {computeCycleTimeDistribution} from "../../core/data/durationData";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import ColumnChart from "./elements/charts/ColumnChart";

class CycleTimeDistribution extends React.Component {
  constructor() {
    super();
    this.state = {
      taskFilter: (task) => true,
    };
    this.update = this.update.bind(this);
  }

  update(filter) {
    this.setState({ taskFilter: filter});
  }

  render() {
    let filteredTaskList = this.props.taskList.filter(task => task.events[task.events.length - 1] != null).filter(this.state.taskFilter);
    var durationData = computeCycleTimeDistribution(filteredTaskList);
    return (
      <Card cardTitle="Cycle Time Distribution" data={filteredTaskList}>
        <div><Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/></div>
        <div><ColumnChart data={durationData}/></div>
      </Card>
    );
  }
}

export default taskListConnect(CycleTimeDistribution)