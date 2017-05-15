import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import {csvExport} from "../../core/data/taskData";
import Card from "./elements/Card";


class TaskElement extends React.Component {
  render() {
    if (typeof this.props.element == 'string' && this.props.element == "null") {
      return <td>&nbsp;</td>
    } else if (typeof this.props.element == 'string') {
      return <td>{this.props.element}</td>
    } else if (this.props.element instanceof Date) {
      return <td>{this.props.element.formatDDMMYYYY()}</td>
    } else {
      return <td>&nbsp;</td>
    }
  }
}

class TaskManager extends React.Component {
  constructor() {
    super();
    this.state = {
      filterExpr: "",
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.props.fetchData();
    this.setState({});
  }

  update(e) {
    this.setState({filterExpr: e.target.value.toLowerCase()});
  }

  openTab(key) {
    window.open("http://jira.lan.courtanet.net/browse/" + key, '_blank');
  }

  render() {

    var filtered = this.props.taskList
      .filter((task) => (
        task.key.toLowerCase().indexOf(this.state.filterExpr) != -1)
        || task.summary.toLowerCase().indexOf(this.state.filterExpr) != -1
      );

    let tasks = (
      <tr onClick={() => this.openTab(this.state.filterExpr)}>
        <td colSpan={RAW_DATA_COL.EVENTS.length + RAW_DATA_COL.FILTERS.length + 2}> Searching </td>
      </tr>
    )

    if (filtered.length != 0) {
      tasks = filtered
        .map((task) => {
          return (
            <tr key={task.key} onClick={() => this.openTab(task.key)}>
              <td>{task.key}</td>
              <td>{task.summary}</td>
              {task.events.map((event) => {
                return (<TaskElement element={event}/>)
              })}
              {task.filters.map((filter) => {
                return (<TaskElement element={filter}/>)
              })}
            </tr>
          );
        });
    }

    return (
      <Card cardTitle="Duration" data={tasks} noModal={true}>
        <input type="text" onChange={this.update} defaultValue=""/>
        <button onClick={() => csvExport(filtered)}>Download csv</button>
        <table className="table table-hover">
          <thead>
          <tr>
            <th>Key</th>
            <th>Summary</th>
            {RAW_DATA_COL.EVENTS.map((element) => {
              return <th>{element.label}</th>
            })}
            {RAW_DATA_COL.FILTERS.map((element) => {
              return <th>{element.label}</th>
            })}
          </tr>
          </thead>
          <tbody>{tasks}</tbody>
        </table>
      </Card>
    );
  }
}

export default taskListConnect(TaskManager)