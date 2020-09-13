 /* eslint-disable */
import React from 'react'
import {
  Router,
  Route
} from 'react-router-dom'
import Callback from './routes/Callback'
import Home from './routes/Home'
import Login from './routes/Login/Login'
import './routes/Home.css'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const App = (props) => (
  <Router history={history}>
    <Route exact path="/" component={Home} />
    <Route exact path="/callback" component={Callback}/>
</Router>
)

export default App



/*  <div className="Home">
  <Login />
  </div>*/