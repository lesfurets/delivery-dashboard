import React from 'react';

export default class Card extends React.Component {
    render() {
        return (
            <div className="card">
                <div className="row">
                    <h2 className="col-md-12 card-title">{this.props.cardTitle}
                        <a href="#"> <span className="glyphicon glyphicon-th-list pull-right" data-toggle="modal" data-target="#tab_cumulative_view_tasks_list_modal"></span></a>
                    </h2>
                </div>
                <div className="row">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Card.defaultProps ={
    cardTitle: "Dashboard"
}
