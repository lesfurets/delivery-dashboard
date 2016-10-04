import React from "react";

import {taskListConnect} from "../../redux/jiraConnect"
import { FILTER_MONTH } from "../../core/definition";

import Report from "./elements/Report";

class MonthlyReport extends React.Component {
    render() {
        return (
            <Report {...this.props} selector={FILTER_MONTH}/>
        )
    }
}

export default taskListConnect(MonthlyReport)
