import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeView from './views/HomeView'
import CreateView from './views/CreateView'
import DetailView from './views/DetailView'


class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <Route exact path="/" component={HomeView} />
            <Switch>
              <Route exact path="/artefacts/create/" component={CreateView} />
              <Route exact path="/artefacts/:id/" component={DetailView} />
            </Switch>
          </div>
        </Router>
    )
  }
}

export default App;