import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeView from './views/HomeView'
import CreateView from './views/CreateView'
import DetailView from './views/DetailView'

import Login from './views/LoginView'
import Signup from './views/SignupView'

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={HomeView} />
                        <Route exact path="/artefacts/create/" component={CreateView} />
                        <Route exact path="/artefacts/:id/" component={DetailView} />
                        <Route exact path="/login/" component={Login} />
                        <Route exact path="/signup/" component={Signup} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;
