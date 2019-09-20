import React, { Component, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import authContext from '../authContext';
import { AUTH_TOKEN } from '../constants';
import Loading from './Loading';

class WaitWraper extends Component {
    state = { checkAuthenticated: false }
    static contextType = authContext;

    componentDidMount() {
        console.log("did I mount?");
        if (this.context.authenticated) {
            this.setState({checkAuthenticated: true})
        }
        const localToken = localStorage.getItem(AUTH_TOKEN);

        // If there's no token, then they can't have been logged in i.e. checkauthenticated complete
        if (!this.context.authenticated && localToken) {
            this.context.handleAuthentication(localToken, () => {
                console.log("Setting state");
                this.setState({checkAuthenticated: true})
            });
        } else {
            this.setState({ checkAuthenticated: true })
        }
    }

    render() {
        // Render the children with a function using state as the argument
        return this.props.children(this.state.checkAuthenticated);
    }
}

export const PrivateRoute = ({component: Component, ...rest}) => {
    console.log("Begin private route");
    const context = useContext(authContext);
    const authenticated = context.authenticated;

    return (
        <WaitWraper>
            {checkAuthenticated => checkAuthenticated === false
            ? <Loading />
            : <Route {...rest}
                render={props => {
                    if (authenticated) {
                        return <Component {...props} />
                    } else {
                        return (
                            <Redirect to='/login' />
                        )
                    }
                }} />
            }
        </WaitWraper>
    )
}
