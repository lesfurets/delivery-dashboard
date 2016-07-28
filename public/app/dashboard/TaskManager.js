import React from "react";
import jiraConnect from "../api/jiraConnect";
import {buildTasksListTable} from "../api/chartFactory";
import {filterTaskData} from "../api/taskData";

class TaskManager extends React.Component {
    constructor() {
        super();
        this.state = {
            filterExpr: "",
            chart: null
        };
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.props.fetchData();
        this.setState({chart: buildTasksListTable("test_tasks_list")});
    }

    update(e) {
        let filterExp = e.target.value;
        this.setState({filterExpr: filterExp});
    }

    render() {
        if (this.state.chart != null) {
            this.state.chart.setDataTable(filterTaskData(this.props.rawData, this.state.filterExpr));
            this.state.chart.draw();
        }
        return (
            <div>
                <input type="text" onChange={this.update} defaultValue=""/>
                <div id="test_tasks_list" className="col-md-12 card-block card"></div>
            </div>
        );
    }
}

export default jiraConnect(TaskManager)