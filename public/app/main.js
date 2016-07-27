import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router'
import {compose, createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'

import reducer from './reducers';
import initApp from './core/initApp';

import DeliveryDashboard from './components/DeliveryDashboard';
import Page1 from './components/Page1';
import CumulativeFlow from './dashboard/CumulativeFlow';
import Duration from './dashboard/Duration';
import Distribution from './dashboard/Distribution';
import Report from './dashboard/Report';
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
                    <Route path="/monthly-report" component={Report}/>
                    <Route path="/period-report" component={Page1}/>
                    <Route path="/task-manager" component={TaskManager}/>
                </Route>
            </Router>
        </Provider>, document.getElementById('app'))
});
