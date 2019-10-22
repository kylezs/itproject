import React, { Component, useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import authContext from '../authContext'
import { AUTH_TOKEN } from '../constants'
import { Loading, Layout } from './'
import LandingPage from '../views/LandingPage'

class WaitWraper extends Component {
    state = { checkAuthenticated: false }
    static contextType = authContext

    componentDidMount() {
        if (this.context.authenticated) {
            this.setState({ checkAuthenticated: true })
        }
        const localToken = localStorage.getItem(AUTH_TOKEN)

        // If there's no token, then they can't have been logged in i.e. checkauthenticated complete
        if (!this.context.authenticated && localToken) {
            this.context.handleAuthentication(localToken, () => {
                console.log('Setting state')
                this.setState({ checkAuthenticated: true })
            })
        } else {
            this.setState({ checkAuthenticated: true })
        }
    }

    render() {
        // Render the children with a function using state as the argument
        return this.props.children(this.state.checkAuthenticated)
    }
}

const UnwrappedPrivateRoute = ({
    loggedIn: LoggedIn,
    loggedOut,
    path,
    landingPage,
    ...rest
}) => {
    const context = useContext(authContext)
    const authenticated = context.authenticated

    if (!loggedOut) {
        loggedOut = '/login'
    }

    console.log('Authenticated: ', authenticated)
    return (
        <WaitWraper>
            {checkAuthenticated =>
                checkAuthenticated === false ? (
                    <Loading />
                ) : (
                    <Route
                        {...rest}
                        render={props => {
                            if (authenticated) {
                                return <LoggedIn {...props} {...rest} />
                            } else if (!authenticated && landingPage) {
                                return <LandingPage />
                            } else {
                                return <Redirect to={loggedOut} />
                            }
                        }}
                    />
                )
            }
        </WaitWraper>
    )
}

export const PrivateRoute = props => (
    <Layout>
        <UnwrappedPrivateRoute {...props} />
    </Layout>
)
