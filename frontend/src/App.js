import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {About} from './components/About'
import {Users} from './components/Users'
import {Navbar} from './components/Navbar'
//-----
import {Trips} from './components/Trips'
import {SearchTrips} from './components/SearchTrips'
//-----
import 'bootswatch/dist/lux/bootstrap.min.css'

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="container p-2">
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/user" component={Users} />
          [//-----]
          <Route path="/trip" component={Trips} />
          <Route path="/searchtrips" component={SearchTrips} />
          [//-----]
        </Switch>
      </div>
    </Router>
  );
}

export default App;
