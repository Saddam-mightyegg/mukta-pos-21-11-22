import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Routes from './routes';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouterMatch,
  useParams
} from "react-router-dom";
import createHistory from 'history/createBrowserHistory';
const history = createHistory()

ReactDOM.render(

  [
  <Router history={history}>
      <Routes />
  </Router>],





 document.getElementById('root'));
