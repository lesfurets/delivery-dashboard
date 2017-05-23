import React from "react";
import randomId from "../../../../core/tools/randomId";

export default class DateRangeFilter extends React.Component {
  constructor() {
    super();
    this.state = { filterId: randomId() }
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
        endDate: rangeEnd.formatDDMMYYYY(),
        minDate: startDate.formatDDMMYYYY(),
        maxDate: rangeEnd.formatDDMMYYYY(),
        locale: {
          format: 'DD/MM/YYYY'
        }
      },
      function (start, end) {
        update(start.toDate(), end.toDate());
      });
  }

  update(startDate, endDate) {
    this.props.onChange(this.props.categoryIndex, (date) => date != null && date >= startDate && date <= endDate)
  }

  render() {
    return (
    <div className="filter-wrapper">
      <div className="input-group">
        <span className="input-group-addon addon-filter" id="basic-addon1">{this.props.label}</span>
        <input name={this.state.filterId} id={this.state.filterId} ref="filter" type="text"
               className="form-control" aria-describedby="basic-addon1"/>
      </div>
    </div>
    );
  }
}

DateRangeFilter.protoTypes = {
  onChange: React.PropTypes.func.isRequired
}
