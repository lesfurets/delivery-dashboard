import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router'
import $ from 'jquery';

import AppTest from './component/AppTest';
import Page1 from './component/Page1';
import Page2 from './component/Page2';

const initialData = {
    user: {
        "id": "2cae43ac-c8fd-4867-86c9-c908754f8c55",
        "firstname": "Layla",
        "lastname": "Horton",
        "entityId": "125bb049-4ef3-47a9-80df-2283aff09762",
        "language": "TU"
    },
    entity: {"id": "125bb049-4ef3-47a9-80df-2283aff09762", "name": "company.com", "sector": "sector"}
};

global['initialData'] = initialData;

google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});

google.setOnLoadCallback(function () {
    ReactDom.render(<Router history={browserHistory}>
        <Route path="/" component={AppTest}>
            <IndexRedirect to="/home"/>
            <Route path="/home" component={Page1}/>
            <Route path="/histogram" component={Page2}/>
        </Route>
    </Router>, document.getElementById('app'))
});
