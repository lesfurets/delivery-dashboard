import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import {computeDistribution} from "../../core/data/distributionData";
import Card from "./elements/Card";
import Filters from "./elements/filtering/Filters";
import PieChart from "./elements/charts/PieChart";

class DataDistribution extends React.Component {
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
    let pieCharts = RAW_DATA_COL.FILTERS
      .filter((filter) => filter.filterType == 'CategoryFilter')
      .map((filter, index) => (
        <div className="col-md-4" key={index}>
            <PieChart title={filter.label} data={computeDistribution(filteredTaskList, index)}/>
        </div>));

    return (
      <Card cardTitle="Distribution" data={filteredTaskList}>
          <div><Filters ref="filters" taskList={this.props.taskList} onChange={this.update}/></div>
          <div>{pieCharts}</div>
      </Card>
    );
  }
}

export default taskListConnect(DataDistribution)