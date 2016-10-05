import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router'
import {compose, createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'

import reducer from './redux/reducers';
import initApp from './core/tools/initApp';

import DeliveryDashboard from './components/DeliveryDashboard';
import CumulativeFlow from './components/dashboards/CumulativeFlow';
import DurationPhase from './components/dashboards/DurationPhase';
import Distribution from './components/dashboards/Distribution';
import MonthlyReport from './components/dashboards/MonthlyReport';
import PeriodReport from './components/dashboards/PeriodReport';
import TaskManager from './components/dashboards/TaskManager';


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
                    <Route path="/duration-phases" component={DurationPhase}/>
                    <Route path="/distribution" component={Distribution}/>
                    <Route path="/monthly-report" component={MonthlyReport}/>
                    <Route path="/period-report" component={PeriodReport}/>
                    <Route path="/task-manager" component={TaskManager}/>
                </Route>
            </Router>
        </Provider>, document.getElementById('app'))
});
