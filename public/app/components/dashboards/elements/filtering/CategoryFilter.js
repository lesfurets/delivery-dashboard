import React from "react";

export default class Filters extends React.Component {
    constructor() {
        super();
        this.state = {
            selected: []
        }
        this.addValue = this.addValue.bind(this);
        this.removeValue = this.removeValue.bind(this);
    }

    addValue(e) {
        this.state.selected.push(e.target.value);
        this.setState({
            selected: this.state.selected.filter((task, index, array) => index == array.indexOf(task))
        });
        this.props.onChange();
    }

    removeValue(value) {
        var index = this.state.selected.indexOf(value);
        if (index > -1) {
            let newSelection = this.state.selected;
            newSelection.splice(index, 1);
            this.setState({
                selected: newSelection
            });
        }
        this.props.onChange();
    }

    render() {
        let values = this.props.values.map((value, index) =>
            <li key={index}><a href="#" onClick={this.addValue} value={value}>{value}</a></li>);
        let selected = this.state.selected.map((value, index) =>
            <button key={index} type="button" className="btn btn-default btn btn-primary" onClick={() => this.removeValue(value)}>
                {value} <span className="glyphicon glyphicon-remove"></span>
            </button>)
        return (
            <div selected={this.state.selected}>
                <div className="btn-group" role="group" aria-label="...">
                    <div className="btn-group">
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            {this.props.label} <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            {values}
                        </ul>
                    </div>
                    {selected}
                </div>
            </div>
        );
    }
}
