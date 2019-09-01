import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeView from './views/HomeView'
import CreateView from './views/CreateView'
import DetailView from './views/DetailView'
import ButtonAppBar from './views/ButtonAppBar'

import Login from './views/LoginView'
import Signup from './views/SignupView'
import { AUTH_TOKEN } from './constants'

import Container from '@material-ui/core/Container';

class App extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)

        return (
            <Router>
            <div>
            <Route exact path="/" component={HomeView} />
                <Switch>
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
