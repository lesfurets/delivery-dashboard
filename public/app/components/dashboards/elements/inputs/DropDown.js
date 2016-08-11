import React from "react";

export default class DropDown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: props.defaultSelection ? props.values[0] : null
        };

        if(this.state.selectedValue != null){
            this.props.onChange(this.state.selectedValue);
        }

        this.update = this.update.bind(this);
    }

    update(value) {
        this.props.onChange(value ? this.props.firstValue : this.props.secondValue);
        this.setState({selectedValue: value});
    }

    render() {
        let selectedLabel = this.state.selectedValue != null ? this.state.selectedValue.label : "";
        let label = this.props.label != null ? this.props.label : selectedLabel;
        let values = this.props.values.map(value => (
            <li key={value.label}>
                <a href="#" onClick={() => this.props.onChange(value)}>{value.label}</a>
            </li>
        ))
        return (
            <div className="btn-group" value={this.selectedValue}>
                <button type="button" className="btn btn-default btn-filter dropdown-toggle" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false"> {label} <span className="caret pull-right"></span>
                </button>
                <ul className="dropdown-menu">
                    {values}
                </ul>
            </div>
        )
    }
}

DropDown.protoTypes = {
    values: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
    defaultSelection: React.PropTypes.bool,
    label: React.PropTypes.string
}