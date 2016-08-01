import React from "react";

import jiraConnect from "../../redux/jiraConnect"
import { CONFIG_PERIOD_SELECTOR } from "../../core/definition";

import Report from "./elements/Report";

class MonthlyReport extends React.Component {
    render() {
        return (
            <Report {...this.props} selector={CONFIG_PERIOD_SELECTOR}/>
        )
    }
}

export default jiraConnect(MonthlyReport)
