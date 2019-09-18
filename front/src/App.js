import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

// Views
import HomeView from './views/HomeView'
import CreateView from './views/CreateView'
import DetailView from './views/DetailView'
import Login from './views/LoginView'
import Signup from './views/SignupView'
// Family views
import CreateFamilyView from './views/CreateFamilyView'


class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        {/* We may want to change this later, to have a separate / display if not logged in */}
                        <PrivateRoute exact path="/" component={HomeView} />
                        {/* User auth routes */}
                        <Route exact path="/login/" component={Login} />
                        <Route exact path="/signup/" component={Signup} />

                        {/* Artefact routes */}
                        <PrivateRoute exact path="/artefacts/create/" component={CreateView} />
                        <PrivateRoute exact path="/artefacts/:id/" component={DetailView} />

                        {/* Family routes */}
                        <PrivateRoute exact path="/family/create" component={CreateFamilyView} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;
