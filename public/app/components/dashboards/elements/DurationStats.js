import React from "react";

export default class DurationStats extends React.Component {
    render() {
        let collectors = this.props.taskList
            .reduce((collector, task) => collector.add(task), new TaskCollector(() => 1))
            .getStatistics();

        return (
            <table className="table table-hover">
                <thead>
                {collectors.getHeader()}
                </thead>
                <tbody>
                {collectors.getValues()}
                </tbody>
            </table>
        );
    }
}

class TaskCollector {
    constructor(selector) {
        this.collectors = [];
        this.selector = selector;
    }

    add(task) {
        var index = this.selector(task);
        if (this.collectors[index] == null) {
            this.collectors[index] = {
                cycleTimeList: [],
                phasesDurationList: [],
                count: 0
            }
        }

        let collector = this.collectors[index];

        if (task.cycleTime != null) {
            collector.cycleTimeList.push(task.cycleTime);
        }

        task.durations.forEach((duration, index) => {
            if (collector.phasesDurationList[index] == null) {
                collector.phasesDurationList[index] = [duration];
            } else {
                collector.phasesDurationList[index].push(duration);
            }
        });

        collector.count++;

        return this;
    }

    getStatistics() {
        return new TaskStatistic(this);
    }
}

class TaskStatistic {
    constructor(taskCollector) {
        this.stats = taskCollector.collectors.map((collector) => {
            return {
                phasesDuration: collector.phasesDurationList.map((phase) => this.computeAverage(phase)),
                cycleTime: this.computeAverage(collector.cycleTimeList),
                count: collector.count
            }
        });
    }

    getHeader() {
        let cells = ["Tasks"];
        RAW_DATA_COL.EVENTS.forEach((event) => cells.push(event.label));
        cells.push("Cycle Time");
        return <tr>{cells.map((value, index) => (<th key={"header_" + index}>{value}</th>))}</tr>;
    }

    getValues() {
        return this.stats.map((stat, index) => {
            let cells = [stat.count];
            stat.phasesDuration.forEach((phase) => cells.push(phase))
            cells.push(stat.cycleTime)
            return <tr key={index}>{cells.map((value, index) => (<td key={"header_" + index}>{value}</td>))}</tr>;
        });
    }

    computeAverage(phase) {
        return (phase.reduce((a, b) => a + b, 0) / phase.length).toFixed(2) + " day(s)";
    }

}

