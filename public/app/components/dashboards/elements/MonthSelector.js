import React from "react";

class MonthSelector extends React.Component {
    constructor() {
        super();
        let selectedDate = new Date();
        selectedDate.setDate(selectedDate.getDate() - 15);
        selectedDate.setDate(1);

        let dateList = [];
        var startDate = new Date(REPORT_CONFIG.first_entry);
        let currentDate = new Date(selectedDate);
        while (startDate < currentDate) {
            dateList.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() - 1);
        }

        this.state = {
            selectedDate: selectedDate,
            dateList: dateList
        };

        this.changeMonth = this.changeMonth.bind(this);
    }

    componentDidMount() {
        this.props.onChange(this.state.selectedDate, this.state.selectedDate.lastDayOfMonth());
    }

    changeMonth(date) {
        this.setState({selectedDate: date});
        this.props.onChange(date, date.lastDayOfMonth());
    }

    render() {
        let items = this.state.dateList.map(date => <li key={date.formatDDMMYYYY()}><a href="#" onClick={() =>
            this.changeMonth(date)}>{date.getYearMonthLabel()}</a></li>)
        return (
            <span className="dropdown">
                <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">
                    {this.state.selectedDate.getYearMonthLabel() + " "}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {items}
                </ul>
            </span>
        )
    }
}

MonthSelector.protoTypes = {
    onChange: React.PropTypes.func.isRequired
}

export default MonthSelector
