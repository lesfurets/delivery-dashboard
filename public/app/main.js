import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router'
import {compose, createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'

import reducer from './reducers';
import initApp from './core/initApp';

import DeliveryDashboard from './components/DeliveryDashboard';
import CumulativeFlow from './dashboard/CumulativeFlow';
import Duration from './dashboard/Duration';
import Distribution from './dashboard/Distribution';
import MonthlyReport from './dashboard/MonthlyReport';
import PeriodReport from './dashboard/PeriodReport';
import TaskManager from './dashboard/TaskManager';


google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});

google.setOnLoadCallback(function () {
    const store = createStore(reducer);
    initApp();

    ReactDom.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={DeliveryDashboard}>
                    <IndexRedirect to="/monthly-report"/>
                    <Route path="/cumulative-flow" component={CumulativeFlow}/>
                    <Route path="/duration" component={Duration}/>
                    <Route path="/distribution" component={Distribution}/>
                    <Route path="/monthly-report" component={MonthlyReport}/>
                    <Route path="/period-report" component={PeriodReport}/>
                    <Route path="/task-manager" component={TaskManager}/>
                </Route>
            </Router>
        </Provider>, document.getElementById('app'))
});
