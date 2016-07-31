import React from "react";

import jiraConnect from "../api/jiraConnect"
import { CONFIG_PERIOD_SELECTOR } from "../api/definition";

import Report from "./Report";

class MonthlyReport extends React.Component {
    render() {
        return (
            <Report {...this.props} selector={CONFIG_PERIOD_SELECTOR}/>
        )
    }
}

export default jiraConnect(MonthlyReport)
