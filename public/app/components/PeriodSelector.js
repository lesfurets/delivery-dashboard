import React from "react";
// import $ from "jquery"

class PeriodSelector extends React.Component {
    componentDidMount() {
        var startDate = new Date(REPORT_CONFIG.first_entry);
        var periodEnd = new Date();
        periodEnd.setDate(periodEnd.getDate() - 15);
        var periodStart = new Date(periodEnd.getFullYear(), periodEnd.getMonth() - 2, periodEnd.getDate());

        var onChange = this.props.onChange;
        onChange(periodStart, periodEnd);
        
        //TODO import Jquery
        $("input[name=\"daterange\"]").daterangepicker(
            {
                startDate: periodStart.formatDDMMYYYY(),
                endDate: periodStart.formatDDMMYYYY(),
                minDate: startDate.formatDDMMYYYY(),
                locale: {
                    format: 'DD/MM/YYYY'
                }
            },
            function (start, end, label) {
                onChange(start.toDate(), end.toDate());
            });
    }

    render() {
        return (
            <span>
                <input id="selector" type="text" name="daterange"/>
            </span>
        )
    }
}

PeriodSelector.protoTypes = {
    onChange: React.PropTypes.func.isRequired
}

export default PeriodSelector
