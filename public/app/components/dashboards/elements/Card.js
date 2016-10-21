import React from "react";
import TaskList from "./TaskList";
import If from "./If";

export default class Card extends React.Component {
    constructor() {
        super();
        this.state = {
            displayList: false,
        };
        this.displayList = this.displayList.bind(this);
    }

    displayList() {
        this.setState({displayList: true});
    }

    render() {
        var hastTaskList = typeof this.props.data !== "undefined";
        let suffix = !hastTaskList ? "" : " - " + this.props.data.length + " task" + (this.props.data.length != 1 ? "s" : "");
        let action = !hastTaskList || this.props.noModal ? "" :(
            <a href="#" onClick={this.displayList}>
                <span className="glyphicon glyphicon-th-list pull-right" data-toggle="modal" data-target="#modal">
                </span>
            </a>
        )
        return (
            <div>
                <div className="card">
                    <div className="row card-header">
                        <span className="col-md-6">{this.props.cardTitle}{suffix}</span>
                        <span className="col-md-6"> {action} </span>
                    </div>
                    <div className="row">
                        {this.props.children}
                    </div>
                </div>
                <div id="modal" className="modal fade" role="dialog">
                    <div className="modal-dialog">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Modal Header</h4>
                            </div>
                            <div className="modal-body">
                                <If condition={this.state.displayList}>
                                    <TaskList data={this.props.data} lite/>
                                </If>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

Card.defaultProps = {
    cardTitle: "Dashboard"
}
