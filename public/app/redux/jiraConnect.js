import fetch from 'isomorphic-fetch';
import { fetchDataAction } from './actions'
import { connect } from 'react-redux'
import { buildTaskTable } from '../core/data/taskData'

const mapStateToProps = (state) => {
    return {
        rawData: buildTaskTable(state.taskList)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: () => {
            let url = "/rest/api/2/search?jql=" + JIRA_DATA.jql + "&fields=" + JIRA_DATA.fields + "&startAt=0&maxResults=5000"
            fetch(url)
                .then(response => response.json())
                .then(data => dispatch(fetchDataAction(data)));
        }
    }
}

export default (Element) => connect(mapStateToProps, mapDispatchToProps)(Element)