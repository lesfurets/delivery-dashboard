import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import {csvExport} from "../../core/data/taskData";
import Card from "./elements/Card";

var openTab = (key) => window.open("http://jira.lan.courtanet.net/browse/" + key, '_blank');

let TaskElement = (props) => {
  if (typeof props.element == 'string' && props.element == "null") {
    return <td>&nbsp;</td>
  } else if (typeof props.element == 'string') {
    return <td>{props.element}</td>
  } else if (props.element instanceof Date) {
    return <td>{props.element.formatDDMMYYYY()}</td>
  } else {
    return <td>&nbsp;</td>
  }
}

let Task = (props) => (
  <tr key={props.task.key} onClick={() => openTab(props.task.key)}>
    <td>{props.task.key}</td>
    <td>{props.task.summary}</td>
    {props.task.events.map((event, id) => <TaskElement key={props.task.key + "-event-" + id} element={event}/>)}
    {props.task.filters.map((filter, id) => <TaskElement key={props.task.key + "-filter-" + id} element={filter}/>)}
  </tr>
)

class TaskManager extends React.Component {
  constructor() {
    super();
    this.state = {
      filterExpr: "",
    };
    this.update = this.update.bind(this);
  }

  update(e) {
    this.setState({filterExpr: e.target.value.toLowerCase()});
  }

  render() {
    var filtered = this.props.taskList.filter((task) => ( task.key.toLowerCase().indexOf(this.state.filterExpr) != -1)
    || task.summary.toLowerCase().indexOf(this.state.filterExpr) != -1);

    return (
      <Card cardTitle="Duration" data={filtered} noModal={true}>
        <input type="text" onChange={this.update} defaultValue=""/>
        <button onClick={() => csvExport(filtered)}>Download csv</button>
        <table className="table table-hover">
          <thead>
          <tr>
            <th>Key</th>
            <th>Summary</th>
            {RAW_DATA_COL.EVENTS.map((element, id) => <th key={"event-" + id}>{element.label}</th>)}
            {RAW_DATA_COL.FILTERS.map((element, id) => <th key={"filter-" + id}>{element.label}</th>)}
          </tr>
          </thead>
          <tbody>{filtered.length != 0 ? filtered.map((task) => <Task key={task.key} task={task}/>) : ""}</tbody>
        </table>
      </Card>
    );
  }
}

export default taskListConnect(TaskManager)