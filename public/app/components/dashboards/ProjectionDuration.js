import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import DurationStats from "./elements/DurationStats";

class ProjectionDuration extends React.Component {
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
    let filteredTaskList = this.props.taskList.filter(task => task.events[task.events.length - 1] != null).filter(this.state.taskFilter);
    return (
      <Card cardTitle="Projected Durations" data={filteredTaskList}>
          <div><Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/></div>
          <div><DurationStats taskList={filteredTaskList} groupBy={REPORT_CONFIG.projection}/></div>
      </Card>
    );
  }
}

export default taskListConnect(ProjectionDuration)