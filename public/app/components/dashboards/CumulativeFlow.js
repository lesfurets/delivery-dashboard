import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import {computeEvent} from "../../core/data/eventData";
import AreaChart from "./elements/charts/AreaChart";
import Filters from "./elements/filtering/Filters";
import Card from "./elements/Card";

class CumulativeFlow extends React.Component {
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
    let eventData = computeEvent(filteredTaskList);
    return (
      <Card cardTitle="Cumulative Flow" data={filteredTaskList}>
        <div><Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/></div>
        <div><AreaChart data={eventData}/></div>
      </Card>
    );
  }
}

export default taskListConnect(CumulativeFlow)