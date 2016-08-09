import React from "react";
import DataMatcher from "./DataMatcher";

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
            selection: null,
            matcher: new DataMatcher((date) => true)
        };

        this.changeValue = this.changeValue.bind(this);
        this.resetValue = this.resetValue.bind(this);
    }

    changeValue(value) {
        this.setNewSelection(value);
    }

    resetValue() {
        this.setNewSelection(null);
    }

    setNewSelection(selection) {
        this.setState({
            selection: selection,
            matcher: new DataMatcher((date) => selection == null || (date != null && selection.getYear() == date.getYear() && selection.getMonth() == date.getMonth()))
    }, this.props.onChange);
    }

    render() {
        let values = this.state.dateList.map(date => <li key={date.formatDDMMYYYY()}><a href="#" onClick={() =>
            this.changeValue(date)}>{date.getYearMonthLabel()}</a></li>)
        let selection = this.state.selection == null ? "" : (
            <button type="button" className="btn btn-default btn btn-info" onClick={() => this.resetValue()}>
                {this.state.selection.getYearMonthLabel()} <span className="glyphicon glyphicon-remove"></span>
            </button>
        )
        return (
            <div className="col-md-12" selected={this.state.matcher}>
                <div className="btn-group" role="group" aria-label="...">
                    <div className="btn-group">
                        <button type="button" className="btn btn-default btn-filter dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.props.label} <span className="caret pull-right"></span>
                        </button>
                        <ul className="dropdown-menu">
                            {values}
                        </ul>
                    </div>
                    {selection}
                </div>
            </div>
        );
    }



}

MonthFilter.protoTypes = {
    onChange: React.PropTypes.func.isRequired
}

export default MonthFilter
