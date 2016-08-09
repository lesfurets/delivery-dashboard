import React from "react";
import randomId from "../../../../core/tools/randomId";
import DataMatcher from "./DataMatcher";

export default class DateRangeFilter extends React.Component {
    constructor() {
        super();
        this.state = {
            filterId: randomId(),
            matcher: new DataMatcher((date) => true)
        }
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        var startDate = this.props.startDate;
        var rangeStart = this.props.rangeStartDate == null ? this.props.startDate : this.props.rangeStartDate;
        var rangeEnd = this.props.rangeEndDate == null ? new Date() : this.props.rangeEndDate;

        var update = this.update;
        update(rangeStart, rangeEnd);

        $("input[name=\"" + this.state.filterId + "\"]").daterangepicker({
                startDate: rangeStart.formatDDMMYYYY(),
                endDate: rangeStart.formatDDMMYYYY(),
                minDate: startDate.formatDDMMYYYY(),
                locale: {
                    format: 'DD/MM/YYYY'
                }
            },
            function (start, end) {
                update(start.toDate(), end.toDate());
            });
    }

    update(startDate, endDate) {
        this.setState({
            matcher: new DataMatcher((date) => date >= startDate && date <= endDate)
        }, this.props.onChange)
    }

    render() {
        return (
            <div className="input-group" selected={this.state.matcher}>
                <span className="input-group-addon addon-filter" id="basic-addon1">{this.props.label}</span>
                <input name={this.state.filterId} id={this.state.filterId} ref="filter" type="text"
                       className="form-control" aria-describedby="basic-addon1"/>
            </div>
        );
    }
}

DateRangeFilter.protoTypes = {
    onChange: React.PropTypes.func.isRequired
}
