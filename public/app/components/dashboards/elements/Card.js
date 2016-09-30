import React from "react";
import TaskList from "./TaskList";

export default class Card extends React.Component {
    render() {
        let suffix = "";
        if (typeof this.props.data !== "undefined") {
            suffix = " - " + this.props.data.length + " task" + (this.props.data.length != 1 ? "s" : "");
        }
        return (
            <div>
                <div className="card">
                    <div className="row card-header">
                        <span className="col-md-6">{this.props.cardTitle}{suffix}</span>
                        <span className="col-md-6">
                            <a href="#"> <span className="glyphicon glyphicon-th-list pull-right" data-toggle="modal"
                                               data-target="#modal"></span></a>
                        </span>
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
                                <p>Some text in the modal.</p>
                                <TaskList data={this.props.data}/>
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
