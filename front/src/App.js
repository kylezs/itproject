import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeView from './views/HomeView'
import CreateView from './views/CreateView'
import DetailView from './views/DetailView'

import Login from './views/LoginView'
import Signup from './views/SignupView'
import { PrivateRoute } from './components/PrivateRoute';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        {/* We may want to change this later, to have a separate / display if not logged in */}
                        <PrivateRoute exact path="/" component={HomeView} />
                        <PrivateRoute exact path="/artefacts/create/" component={CreateView} />
                        <PrivateRoute exact path="/artefacts/:id/" component={DetailView} />
                        <Route exact path="/login/" component={Login} />
                        <Route exact path="/signup/" component={Signup} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;
