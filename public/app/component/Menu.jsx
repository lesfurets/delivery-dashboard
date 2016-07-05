import React from 'react';
import {Link} from 'react-router';

export default class Menu extends React.Component {

    render() {
        return (
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <img className="navbar-brand-logo" src="../img/team-traffic.png"/>
                            <span className="navbar-brand">Traffic Dashboard</span>
                        </div>
                        <div className="collapse navbar-collapse" id="myNavbar">
                            <ul className="nav navbar-nav">
                                <li className="dropdown active">
                                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">Task Data<span className="caret"></span></a>
                                    <ul className="dropdown-menu">
                                        <li><Link to={'/'} styleName="title"> Cumulative Flow </Link></li>
                                        <li><Link to={'/home'} styleName="title"> Duration </Link></li>
                                        <li><Link to={'/histogram'} styleName="title"> Distribution </Link></li>
                                    </ul>
                                </li>
                                <li className="dropdown">
                                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">Reports<span className="caret"></span></a>
                                    <ul className="dropdown-menu">
                                        <li><a data-toggle="tab" href="#tab_period_report_view" element='elements/period-report-view.html'>Period Report</a></li>
                                        <li><a data-toggle="tab" href="#tab_monthly_report_view" element="elements/monthly-report-view.html">Monthly Report</a></li>
                                    </ul>
                                </li>
                                <li><a data-toggle="tab" href="#tab_tasks_manager_jira" element="elements/task-manager-jira.html">Manage Tasks</a></li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="#"><span className="glyphicon glyphicon-plus"></span></a></li>
                                <li><a href="#" onclick="reloadRawData()"><span className="glyphicon glyphicon-refresh"></span></a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )
    }
}
