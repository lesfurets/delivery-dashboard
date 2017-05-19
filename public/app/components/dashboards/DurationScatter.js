import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import {computeDurationByDate} from "../../core/data/durationData";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import ScatterChart from "./elements/charts/ScatterChart";

class DurationScatter extends React.Component {
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