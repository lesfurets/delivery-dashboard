import React from 'react'
import jiraConnect from '../api/jiraConnect'
import {buildTasksListTable} from '../api/chartFactory'

class TaskManager extends React.Component {
    constructor(){
        super();
        this.state = {chart: null};
        this.update = this.update.bind(this);
    }
    componentDidMount(){
        this.props.fetchData();
        this.setState({chart: buildTasksListTable("test_tasks_list")});
    }
    update(e){
        this.state.chart.setDataTable(this.props.rawData);
        this.state.chart.draw();
    }
    render() {
        if(this.state.chart != null){
            this.state.chart.setDataTable(this.props.rawData);
            this.state.chart.draw();
        }
        return (
            <div id="test_tasks_list" className="col-md-12 card-block card"></div>
        );
    }
}

export default jiraConnect(TaskManager)