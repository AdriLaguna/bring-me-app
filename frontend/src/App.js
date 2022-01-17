import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {OpenData} from './components/OpenData'
import {Users} from './components/Users'
import {Navbar} from './components/Navbar'
//-----
import {Trips} from './components/Trips'
import {SearchTrips} from './components/SearchTrips'
//-----
import {Messages} from './components/Messages'
//-----
import 'bootswatch/dist/lux/bootstrap.min.css'

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="container p-2">
        <Switch>
          <Route path="/opendata" component={OpenData} />
          <Route path="/user" component={Users} />
          [//-----]
          <Route path="/trip" component={Trips} />
          <Route path="/searchtrips" component={SearchTrips} />
          [//-----]
          <Route path="/messages" component={Messages} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
