import React from "react";
import DataMatcher from "./DataMatcher";

export default class CategoryFilter extends React.Component {
    constructor() {
        super();
        this.state = {
            selection: [],
        }
        this.addValue = this.addValue.bind(this);
        this.removeValue = this.removeValue.bind(this);
    }

    addValue(e) {
        this.state.selection.push(e.target.value);
        this.setNewSelection(this.state.selection.filter((task, index, array) => index == array.indexOf(task)))
    }

    removeValue(value) {
        var index = this.state.selection.indexOf(value);
        if (index > -1) {
            let newSelection = this.state.selection;
            newSelection.splice(index, 1);
            this.setNewSelection(newSelection)
        }
    }

    setNewSelection(selection) {
      let index = this.props.categoryIndex;
      let matcher = new DataMatcher((category) => selection.length == 0 || selection.indexOf(category) != -1);
      this.setState({ selection: selection});
      this.props.onChange(index, (task) => {
          return matcher.match(task.filters[index]);
      })
    }

    render() {
        let values = this.props.values.map((value, index) =>
            <li key={index}><a href="#" onClick={this.addValue} value={value}>{value}</a></li>);
        let selection = this.state.selection.map((value, index) =>
            <button key={index} type="button" className="btn btn-default btn btn-info" onClick={() => this.removeValue(value)}>
                {value} <span className="glyphicon glyphicon-remove"></span>
            </button>
        )
        return (
            <div className="col-md-6">
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

CategoryFilter.protoTypes = {
    onChange: React.PropTypes.func.isRequired
}
