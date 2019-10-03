import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'

// Views
import Login from './views/LoginView'
import Signup from './views/SignupView'
import Logout from './components/Logout'
// Family views
import CreateFamilyView from './views/CreateFamilyView'
// Artefact Views
import CreateArtefactView from './views/CreateArtefactView'
import DetailView from './views/DetailView'
import ManageArtefactsView from './views/ManageArtefactsView'
import EditArtefactView from './views/EditArtefactView'

import UserHomeView from './views/UserHomeView'

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        {/* This is a special protected route, since it sends to the landing page if not logged in, which 
                        has the same url as the userHomeView */}
                        <PrivateRoute
                            exact
                            path='/'
                            loggedIn={UserHomeView}
                            landingPage
                        />
                        {/* User auth routes */}
                        <Route exact path='/login/' component={Login} />
                        <Route exact path='/signup/' component={Signup} />
                        <Route exact path='/logout/' component={Logout} />

                        {/* Artefact routes */}
                        <PrivateRoute
                            exact
                            path='/artefacts/create/'
                            loggedIn={CreateArtefactView}
                            landingPage
                        />
                        <PrivateRoute
                            exact
                            path='/artefacts/manage/'
                            loggedIn={ManageArtefactsView}
                            landingPage
                        />
                        <PrivateRoute
                            exact
                            path='/artefacts/:id/'
                            loggedIn={DetailView}
                            landingPage
                        />
                        <PrivateRoute
                            exact
                            path='/artefacts/edit/:id/'
                            loggedIn={EditArtefactView}
                            landingPage
                        />

                        {/* Family routes */}
                        <PrivateRoute
                            exact
                            path='/family/create'
                            loggedIn={CreateFamilyView}
                            landingPage
                        />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App
