import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

// Views
import HomeView from './views/HomeView'
import Login from './views/LoginView'
import Signup from './views/SignupView'
import Logout from './components/Logout'
// Family views
import CreateFamilyView from './views/CreateFamilyView'
// Artefact Views
import CreateArtefactView from './views/CreateArtefactView'
import DetailView from './views/DetailView'


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
                        <Route exact path="/logout/" component={Logout} />

                        {/* Artefact routes */}
                        <PrivateRoute exact path="/artefacts/create/" component={CreateArtefactView} />
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
