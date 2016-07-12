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
                                        <li><Link to={'/'} styleName="title">Cumulative Flow</Link></li>
                                        <li><Link to={'/'} styleName="title">Duration</Link></li>
                                        <li><Link to={'/'} styleName="title">Distribution</Link></li>
                                    </ul>
                                </li>
                                <li className="dropdown">
                                    <a className="dropdown-toggle" data-toggle="dropdown" href="#">Reports<span className="caret"></span></a>
                                    <ul className="dropdown-menu">
                                        <li><Link to={'/'} styleName="title">Period Report</Link></li>
                                        <li><Link to={'/'} styleName="title">Monthly Report</Link></li>
                                    </ul>
                                </li>
                                <li><Link to={'/task-manager'} styleName="title"> Manage Tasks </Link></li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="#"><span className="glyphicon glyphicon-refresh"></span></a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )
    }
}
