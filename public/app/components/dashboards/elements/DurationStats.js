import React from "react";

export default class DurationStats extends React.Component {
  render() {
    var taskCollector = this.props.groupBy == null ? new TaskCollector(this.props.lite)
      : new TaskCollector(this.props.lite, this.props.groupBy.label, (task) => task.filters[this.props.groupBy.position]);

    let collectors = this.props.taskList
      .reduce((collector, task) => collector.add(task), taskCollector)
      .getStatistics();

    return (
      <table className="table table-hover">
          <thead>{collectors.getHeader()}</thead>
          <tbody>{collectors.getValues()}</tbody>
      </table>
    );
  }
}

DurationStats.defaultProps = {
  lite: false
}


class TaskCollector {
  constructor(lite, selectorLabel, selector) {
    this.collectors = {};
    this.selectorLabel = selectorLabel;
    this.selector = selector;
    this.lite = lite;
  }

  add(task) {
    var index = this.selector != null ? this.selector(task) : 1;
    if (this.collectors[index] == null) {
      this.collectors[index] = {
        cycleTimeList: [],
        phasesDurationList: [],
        count: 0,
      }
    }

    let collector = this.collectors[index];

    if (task.cycleTime != null) {
      collector.cycleTimeList.push(task.cycleTime);
    }

    task.durations.forEach((duration, index) => {
      if (collector.phasesDurationList[index] == null) {
        collector.phasesDurationList[index] = [];
      }
      collector.phasesDurationList[index].push(duration);
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
    this.lite = taskCollector.lite;
    this.selectorLabel = taskCollector.selectorLabel;
    this.stats = [];

    for (var index in taskCollector.collectors) {
      var collector = taskCollector.collectors[index];
      this.stats.push({
        phasesDuration: collector.phasesDurationList.map((phase) => this.computeAverage(phase)),
        cycleTime: this.computeAverage(collector.cycleTimeList),
        count: collector.count,
        index: index
      });
    }
  }

  getHeader() {
    let cells = this.stats.length > 1 ? [this.selectorLabel] : [];
    cells.push("Tasks");
    if (!this.lite) {
      for (let i = 0; i < RAW_DATA_COL.EVENTS.length - 1; i++) {
        cells.push(RAW_DATA_COL.EVENTS[i].label);
      }
    }
    cells.push("Cycle Time");
    return <tr>{cells.map((value, index) => (<th key={"header_" + index}>{value}</th>))}</tr>;
  }

  getValues() {
    return this.stats.map((stat, index) => {
      let cells = this.stats.length > 1 ? [stat.index] : [];
      cells.push(stat.count);

      if (!this.lite) {
        for (let i = 0; i < RAW_DATA_COL.EVENTS.length - 1; i++) {
          cells.push(i < stat.phasesDuration.length ? stat.phasesDuration[i] : "");
        }
      }
      cells.push(stat.cycleTime)
      return <tr key={index}>{cells.map((value, index) => (<td key={"header_" + index}>{value}</td>))}</tr>;
    });
  }

  computeAverage(phase) {
    return (phase.reduce((a, b) => a + b, 0) / phase.length).toFixed(2) + " day(s)";
  }

}

