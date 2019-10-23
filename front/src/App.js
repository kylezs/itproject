import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import { CssBaseline } from '@material-ui/core'

// Views
import Login from './views/LoginView'
import Signup from './views/SignupView'
import Logout from './components/Logout'

// Family views
import CreateFamilyView from './views/CreateFamilyView'
// Artefact Views
import CreateArtefactView from './views/artefactViews/CreateArtefactView'
import DetailView from './views/artefactViews/DetailView'
import ManageArtefactsView from './views/artefactViews/ManageArtefactsView'
import EditArtefactView from './views/artefactViews/EditArtefactView'
import Error404View from './views/Error404View'

import UserHomeView from './views/UserHomeView'

import MapView from './views/MapView'

function App(props) {
    return (
        <Router>
            <CssBaseline />
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
                    />
                    <PrivateRoute
                        exact
                        path='/artefacts/manage/'
                        loggedIn={ManageArtefactsView}
                    />
                    <PrivateRoute
                        exact
                        path='/artefacts/:id/'
                        loggedIn={DetailView}
                    />
                    <PrivateRoute
                        exact
                        path='/artefacts/edit/:id/'
                        loggedIn={EditArtefactView}
                    />

                    {/* Family routes */}
                    <PrivateRoute
                        exact
                        path='/family/create/'
                        loggedIn={CreateFamilyView}
                    />

                    {/* Map */}
                    <PrivateRoute
                        exact
                        path='/map/'
                        loggedIn={MapView}
                    />

                    <Route component={Error404View} />
                </Switch>
            </div>
        </Router>
    )
}

export default App
