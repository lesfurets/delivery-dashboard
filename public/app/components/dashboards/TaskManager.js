import React from "react";
import {taskListConnect} from "../../redux/jiraConnect";
import Card from "./elements/Card";

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

    render() {

        let tasks = this.props.taskList
            .filter((task) => (
                task.key.toLowerCase().indexOf(this.state.filterExpr) != -1)
                || task.summary.toLowerCase().indexOf(this.state.filterExpr) != -1
            )
            .map((task) => {
            return (
                <tr key={task.key}>
                    <td>{task.key}</td>
                    <td>{task.summary}</td>
                </tr>
            )
        });
        return (
            <Card>
                <input type="text" onChange={this.update} defaultValue=""/>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Key</th>
                        <th>Summary</th>
                    </tr>
                    </thead>
                    <tbody>{tasks}</tbody>
                </table>
            </Card>
        );
    }
}

export default taskListConnect(TaskManager)