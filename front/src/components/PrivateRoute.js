import React, { Component, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import authContext from '../authContext';
import { AUTH_TOKEN } from '../constants';

// export default (props) => {
//     const context = useContext(authContext);
//     const thisComp = <Route to={props.path} component={props.component} />;
//     // check if the authenticated flag already set
//     if (context.authenticated) {
//         return thisComp;
//     }
    
//     const authHandler = () => {
//         if (context.authenticated) {
//             return (thisComp);
//         } else {
//             return (<Redirect to='/login' />);
//         }
//     }

//     context.handleAuthentication("", authHandler);
// }

export const PrivateRoute = ({component: Component, ...rest}) => {
    console.log("Begin private route");
    const context = useContext(authContext);
    const authenticated = context.authenticated;
    const localToken = localStorage.getItem(AUTH_TOKEN);

    if (!authenticated && localToken) {
        console.log("Begin handle auth in private route")
        context.handleAuthentication(localToken);
        console.log("end handle auth in private route")
    }

    return (
        <Route {...rest} render={
            (props) => {
                if (authenticated) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to='/login' />
                }

            }
        } />
    )
}