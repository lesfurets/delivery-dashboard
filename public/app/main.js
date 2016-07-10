import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router'
import {compose, createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import $ from 'jquery';

import reducer from './reducers';

import AppTest from './components/AppTest';
import Page1 from './components/Page1';
import Page2 from './components/Page2';


google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});

google.setOnLoadCallback(function () {
    const store = createStore(reducer);

    ReactDom.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={AppTest}>
                    <IndexRedirect to="/home"/>
                    <Route path="/home" component={Page1}/>
                    <Route path="/histogram" component={Page2}/>
                </Route>
            </Router>
        </Provider>, document.getElementById('app'))
});
