import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import {computeDurations} from "../../core/data/durationData";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import DurationStats from "./elements/DurationStats";
import ColumnChart from "./elements/charts/ColumnChart";

class PhaseDuration extends React.Component {
  constructor() {
    super();
    this.state = {
      taskFilter: (task) => true,
    };
    this.update = this.update.bind(this);
  }

  update(filter) {
    this.setState({taskFilter: filter});
  }

  render() {
    let filteredTaskList = this.props.taskList.filter(this.state.taskFilter);
    var durationData = computeDurations(filteredTaskList);
    return (
      <Card cardTitle="Duration" data={filteredTaskList}>
          <div><Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/></div>
          <div><DurationStats taskList={filteredTaskList}/></div>
          <div><ColumnChart data={durationData}/></div>
      </Card>
    );
  }
}

export default taskListConnect(PhaseDuration)