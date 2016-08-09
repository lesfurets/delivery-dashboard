import React from 'react'
import {taskListConnect} from "../../redux/jiraConnect";
import {computeEvent} from '../../core/data/eventData'
import AreaChart from './elements/charts/AreaChart'

import Card from './elements/Card'

class CumulativeFlow extends React.Component {
    render() {
        return (
            <Card cardTitle="Cumulative Flow Test">
                <AreaChart data={computeEvent(this.props.taskList)}/>
            </Card>
        );
    }
}

export default taskListConnect(CumulativeFlow)