import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch';
import { fetchDataAction } from '../actions'

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

const mapStateToProps = (state) => {
    return {
        rawData: state.rawData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: () => {
            let fields = "id,key,project,summary,fixVersions,assignee,issuetype,custom,customfield_11729,customfield_11730,customfield_11731,customfield_11732,customfield_10621,customfield_11010";
            let jql = "Workstream=Digital%20and%20cf%5B11729%5D%20is%20not%20null%20and%20value%20is%20not%20null";
            let url = "/rest/api/2/search?jql=" + jql + "&fields=" + fields + "&startAt=0&maxResults=5000"
            fetch(url)
                .then(response => response.json())
                .then(data => dispatch(fetchDataAction(data)));
        }
    }
}

TaskManager = connect(mapStateToProps, mapDispatchToProps)(TaskManager)

export default TaskManager