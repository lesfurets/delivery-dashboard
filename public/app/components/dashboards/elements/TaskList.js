import React from "react";

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [dd, mm, this.getFullYear()].join('/');
};

class TaskElement extends React.Component {
    render() {
        if (typeof this.props.element == 'string' && this.props.element == "null") {
            return <td>&nbsp;</td>
        } else if (typeof this.props.element == 'string') {
            return <td>{this.props.element}</td>
        } else if (this.props.element instanceof Date) {
            return <td>{this.props.element.yyyymmdd()}</td>
        } else {
            return <td>&nbsp;</td>
        }
    }
}

export default class TaskList extends React.Component {
    openTab(key) {
        window.open("http://jira.lan.courtanet.net/browse/" + key, '_blank');
    }

    render() {
        let tasks = "";
        if (typeof this.props.data !== "undefined") {
            tasks = this.props.data.map((task) => {
                return (
                    <tr key={task.key} onClick={() => this.openTab(task.key)}>
                        <td>{task.key}</td>
                        <td>{task.summary}</td>
                        {this.props.lite ? "" : task.events.map((event) => <TaskElement element={event}/>)}
                        {this.props.lite ? "" : task.filters.map((filter) => <TaskElement element={filter}/>)}
                    </tr>
                );
            });
        }

        return (
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Key</th>
                    <th>Summary</th>
                    {this.props.lite ? "" : RAW_DATA_COL.EVENTS.map((element) => <th>{element.label}</th>)}
                    {this.props.lite ? "" : RAW_DATA_COL.FILTERS.map((element) => <th>{element.label}</th>)}
                </tr>
                </thead>
                <tbody>{tasks}</tbody>
            </table>
        );
    }
}

TaskList.propTypes = {
    lite: React.PropTypes.bool
}

TaskList.defaultProps = {
    lite: false
}
