import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import { CssBaseline } from '@material-ui/core'

// Views
import Login from './views/LoginView'
import Signup from './views/SignupView'
import Logout from './components/Logout'
import Layout from './components/Layout'

// Family views
import CreateFamilyView from './views/CreateFamilyView'
// Artefact Views
import CreateArtefactView from './views/CreateArtefactView'
import DetailView from './views/DetailView'
import ManageArtefactsView from './views/ManageArtefactsView'
import EditArtefactView from './views/EditArtefactView'
import Error404View from './views/Error404View'

import UserHomeView from './views/UserHomeView'

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
                    <Route
                        exact
                        path='/login/'
                        render={props => (
                            <Layout>
                                <Login {...props} />
                            </Layout>
                        )}
                    />
                    <Route
                        exact
                        path='/signup/'
                        render={props => (
                            <Layout>
                                <Signup {...props} />
                            </Layout>
                        )}
                    />
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
                    <Route component={Error404View} />
                </Switch>
            </div>
        </Router>
    )
}

export default App
