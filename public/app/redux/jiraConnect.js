import fetch from 'isomorphic-fetch';
import { fetchDataAction } from './actions'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: () => {
            let url = "/rest/api/2/search?jql=" + JIRA_DATA.jql + "&fields=" + JIRA_DATA.fields + "&startAt=0&maxResults=5000"
            fetch(url)
                .then(response => response.json())
                .then(data => dispatch(fetchDataAction(data)));
        }
    }
};

const mapStateToTaskListProps = (state) => {
    return {
        taskList: state.taskList
    }
};

export const taskListConnect = (Element) => connect(mapStateToTaskListProps, mapDispatchToProps)(Element);