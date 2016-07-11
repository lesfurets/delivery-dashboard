import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch';
import { fetchDataAction } from '../actions'

 class RawDataPanel extends React.Component {
    render() {
        return (
            <div>
                <p> Here is the test : {JSON.stringify(this.props.rawData)} </p>
                <button onClick={this.props.fetchData}>load data</button>
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

RawDataPanel = connect(mapStateToProps, mapDispatchToProps)(RawDataPanel)

export default RawDataPanel