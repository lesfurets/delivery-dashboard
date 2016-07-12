import React from 'react'
import jiraConnect from '../api/jiraConnect'

class TaskManager extends React.Component {
    constructor(){
        super();
        this.state = {chart: null};
        this.update = this.update.bind(this);
    }
    componentDidMount(){
        this.props.fetchData();
        var tasksListTable = new google.visualization.ChartWrapper({
            'chartType': 'Table',
            'containerId': "table_div",
            'options': {
                width: '100%'
            }
        });
        tasksListTable.setOption('height', '100%');
        tasksListTable.setOption('showRowNumber', true);
        google.visualization.events.addListener(tasksListTable, 'select', function () {
            var rowNumber = tasksListTable.getChart().getSelection()[0].row;
            var data = tasksListTable.getDataTable();
            window.open('http://jira.lan.courtanet.net/browse/' + data.getValue(rowNumber, 0), '_blank');
        });
        this.setState({chart: tasksListTable});
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
            <div>
                <button onClick={this.update}>Load Table</button>
                <div id="table_div" class="col-md-12 card-block card"></div>
                <p> Here is the test : {JSON.stringify(this.props.rawData)} </p>
            </div>
        );
    }
}

export default jiraConnect(TaskManager)