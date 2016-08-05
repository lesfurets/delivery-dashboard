import React from "react";
import ReactDom from "react-dom";
import CategoryFilter from './CategoryFilter'

function listValues(taskList, index){
    return taskList.map((task) => task.filters[index])
        .filter((task, index, array) => index == array.indexOf(task))
        .sort();
}

export default class Filters extends React.Component {
    constructor(){
        super();
        this.update=this.update.bind(this)
    }
    update(){
        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach((filter, index) => {
                if(filter.filterType == 'CategoryFilter') {
                    console.log(filter.label + " => " + ReactDom.findDOMNode(this.refs["filter_" + index]).selected);
                }
            });
        }
    }
    render() {
        let rangeFilters = [];
        let categoryFilters = [];
        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach((filter, index) => {
                    if(filter.filterType == 'CategoryFilter'){
                        categoryFilters.push(<CategoryFilter key={index}
                                                             ref={"filter_"+index}
                                                             label={filter.label}
                                                             onChange={this.update}
                                                             values={listValues(this.props.taskList,index)}/>);
                    } else {
                        rangeFilters.push(<div key={index}>{filter.label}</div>)
                    }
                });
        }
        return (
            <div id="filters_block">
                <div className="col-md-7 text-center">
                    {rangeFilters}
                </div>
                <div className="col-md-5 text-center">
                    {categoryFilters}
                </div>
            </div>
        );
    }
}
