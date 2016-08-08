import React from "react";

export default class DurationStats extends React.Component {
    render() {
        let stats = this.props.taskList
            .reduce((collector, task) => collector.add(task), new TaskCollector())
            .getStatistics();

        return (
            <table className="table table-hover">
                <thead>
                <tr>{stats.getHeader()}</tr>
                </thead>
                <tbody>
                <tr>{stats.getValues()}</tr>
                </tbody>
            </table>
        );
    }
}

class TaskCollector {
    constructor() {
        this.cycleTimeList = [];
        this.phasesDurationList = [];
        this.count = 0;
    }

    add(task) {
        if (task.cycleTime != null) {
            this.cycleTimeList.push(task.cycleTime);
        }

        task.durations.forEach((duration, index) => {
            if (this.phasesDurationList[index] == null) {
                this.phasesDurationList[index] = [duration];
            } else {
                this.phasesDurationList[index].push(duration);
            }
        });

        this.count++;

        return this;
    }

    getStatistics() {
        return new TaskStatistic(this);
    }
}

class TaskStatistic {
    constructor(taskCollector) {
        this.phasesDuration = taskCollector.phasesDurationList.map((phase) => this.computeAverage(phase));
        this.cycleTime = this.computeAverage(taskCollector.cycleTimeList);
        this.count = taskCollector.count;
    }

    getHeader() {
        let cells = ["Tasks"];
        this.phasesDuration.forEach((phase, index) => cells.push(RAW_DATA_COL.EVENTS[index].label))
        cells.push("Cycle Time")
        return cells.map((value, index) => (<th key={"header_" + index}>{value}</th>));
    }

    getValues() {
        let cells = [this.count];
        this.phasesDuration.forEach((phase) => cells.push(phase))
        cells.push(this.cycleTime)
        return cells.map((value, index) => (<th key={"header_" + index}>{value}</th>));
    }

    computeAverage(phase) {
        return phase.reduce((a, b) => a + b, 0) / phase.length;
    }

}

