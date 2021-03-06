import React from "react";
import ReactDom from "react-dom";
import {Router, Route, browserHistory, IndexRedirect} from "react-router";
import {compose, createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import reducer from "./redux/reducers";
import initApp from "./core/tools/initApp";
import DeliveryDashboard from "./components/DeliveryDashboard";
import CumulativeFlow from "./components/dashboards/CumulativeFlow";
import CycleTimeDistribution from "./components/dashboards/CycleTimeDistribution";
import PhaseDuration from "./components/dashboards/PhaseDuration";
import ProjectionDuration from "./components/dashboards/ProjectionDuration";
import ControlChart from "./components/dashboards/ControlChart";
import DataDistribution from "./components/dashboards/DataDistribution";
import MonthlyReport from "./components/dashboards/MonthlyReport";
import PeriodReport from "./components/dashboards/PeriodReport";
import TaskList from "./components/dashboards/TaskList";


const store = createStore(reducer);
initApp();

ReactDom.render(
  <Provider store={store}>
      <Router history={browserHistory}>
          <Route path="/" component={DeliveryDashboard}>
              <IndexRedirect to="/monthly-report"/>
              <Route path="/control-chart" component={ControlChart}/>
              <Route path="/cumulative-flow" component={CumulativeFlow}/>
              <Route path="/cycle-time-distribution" component={CycleTimeDistribution}/>
              <Route path="/phase-duration" component={PhaseDuration}/>
              <Route path="/projection-duration" component={ProjectionDuration}/>
              <Route path="/distribution" component={DataDistribution}/>
              <Route path="/monthly-report" component={MonthlyReport}/>
              <Route path="/period-report" component={PeriodReport}/>
              <Route path="/task-manager" component={TaskList}/>
          </Route>
      </Router>
  </Provider>, document.getElementById('app'))
