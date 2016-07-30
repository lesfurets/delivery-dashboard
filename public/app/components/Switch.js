import React from "react";

class Switch extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedValue: true // true => first and false => second
        };

        this.update = this.update.bind(this);
    }

    componentDidMount(){
        this.props.onChange(this.state.selectedValue ? this.props.firstValue : this.props.secondValue);
    }

    update(value) {
        this.props.onChange(value ? this.props.firstValue : this.props.secondValue);
        this.setState({selectedValue: value});
    }

    render() {
        return (
            <div className={"switch " + (this.state.selectedValue ? "" : "switched")}>
                <div className="switch-label" onClick={() => this.update(true)}>{this.props.firstValue.label}</div>
                <div className={"switch-widget"} onClick={() => this.update(!this.state.selectedValue)}></div>
                <div className="switch-label" onClick={() => this.update(false)}>{this.props.secondValue.label}</div>
            </div>
        )
    }
}

Switch.protoTypes = {
    firstValue: React.PropTypes.object.isRequired,
    secondValue: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired
}

export default Switch
