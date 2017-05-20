import React from "react";
import CategoryFilter from "./CategoryFilter";
import PeriodFilter from "./PeriodFilter";
import Switch from "../inputs/Switch";

function listValues(taskList, index) {
  return taskList.map((task) => task.filters[index]).filter((task, index, array) => index == array.indexOf(task)).sort();
}

export default class Filters extends React.Component {
  constructor() {
    super();
    this.state = {
      periodType: PeriodFilter.DATE_RANGE_SELECTOR,
      matchers: {},
      dateMatcher: (task) => true
    }
    this.updateType = this.updateType.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  updateType(type) {
    this.setState({
      periodType: type,
    })
  }

  dateChange(key, matcher) {
    this.setState({dateMatcher: matcher}, this.updateFilter);
  }

  filterChange(key, matcher) {
    let matchers = this.state.matchers;
    matchers[key] = matcher;
    this.setState({matchers: matchers}, this.updateFilter);
  }

  updateFilter() {
    let matchers = this.state.matchers;
    let dateMatcher = this.state.dateMatcher;
    this.props.onChange((task) => {
      for (var key in matchers) {
        if (matchers.hasOwnProperty(key) && !matchers[key](task.filters[key])) {
          return false;
        }
      }
      return task.events.map(date => dateMatcher(date)).reduce((result, val) => result || val);
    });
  }

  render() {
    let startDate = new Date(REPORT_CONFIG.first_entry);

    let categoryFilters = [];
    if (RAW_DATA_COL.FILTERS != null) {
      RAW_DATA_COL.FILTERS.forEach((filter, index) =>
        categoryFilters.push(<CategoryFilter key={index} label={filter.label} onChange={this.filterChange}
                                             categoryIndex={index} values={listValues(this.props.taskList, index)}/>));
    }
    return (
      <div id="filters_block">
          <div className="col-md-6">
            {categoryFilters}
          </div>
          <div className="col-md-6">
              <div className="col-md-12" selected={this.state.matcher}>
                  <Switch firstValue={PeriodFilter.MONTH_SELECTOR} secondValue={PeriodFilter.DATE_RANGE_SELECTOR} onChange={this.updateType}/>
              </div>
              <PeriodFilter key="filter_date" categoryIndex={"filter_date"}  label="Period" startDate={startDate} onChange={this.dateChange} selector={this.state.periodType}/>
          </div>
      </div>
    );
  }
}
