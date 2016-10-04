import React from "react";

import {taskListConnect} from "../../redux/jiraConnect"
import { FILTER_DATE_RANGE } from "../../core/definition";

import Report from "./elements/Report";

class MonthlyReport extends React.Component {
    render() {
        return (
            <Report {...this.props} selector={FILTER_DATE_RANGE}/>
        )
    }
}

export default taskListConnect(MonthlyReport)
