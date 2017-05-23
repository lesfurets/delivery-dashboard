import React from "react";
import InputElement from "../inputs/InputElement";
import DropDown from "../inputs/DropDown";

class MonthFilter extends React.Component {
  constructor(props) {
    super(props);

    let selectedDate = new Date();
    selectedDate.setDate(1);

    let dateList = [];
    var startDate = new Date(props.startDate);
    let currentDate = new Date(selectedDate);
    while (startDate < currentDate) {
      dateList.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    this.state = {
      dateList: dateList,
      selection: props.defaultSelection ? dateList[0] : null
    };

    this.changeValue = this.changeValue.bind(this);
    this.resetValue = this.resetValue.bind(this);
  }

  changeValue(selection) {
    this.setNewSelection(selection.value);
  }

  resetValue() {
    this.setNewSelection(null);
  }

  setNewSelection(selection) {
    this.setState({selection: selection});
    this.props.onChange(this.categoryIndex, (date) => selection == null || (date != null && selection.getYear() == date.getYear() && selection.getMonth() == date.getMonth()));
  }

  render() {
    let values = this.state.dateList.map(date => new InputElement(date, date.getYearMonthLabel()));

    if (this.props.label == null) {
      return (
        <DropDown values={values} defaultSelection="true" onChange={this.changeValue}/>
      )
    } else {
      let selection = this.state.selection == null ? "" : (
          <button type="button" className="btn btn-default btn btn-info" onClick={() => this.resetValue()}>
            {this.state.selection.getYearMonthLabel()} <span className="glyphicon glyphicon-remove"></span>
          </button>
        )
      return (
        <div className="btn-group filter-wrapper" role="group" aria-label="...">
          <DropDown values={values} onChange={this.changeValue} label={this.props.label}/>
          {selection}
        </div>
      );
    }

  }


}

MonthFilter.protoTypes = {
  onChange: React.PropTypes.func.isRequired
}

export default MonthFilter
