import React, { useContext } from 'react';
import authContext from '../authContext';
import UserHomeView from './UserHomeView';
import LandingPage from './LandingPage';


// The landing page view
function HomeRedirectView(props) {

    const context = useContext(authContext);
    const loggedIn = context.authenticated;
    const username = context.user.username;
    return (
        <div>
            {loggedIn && (
                <UserHomeView />
            )}
            {!loggedIn && (
                <LandingPage />
            )}
        </div>

    );
}

export default HomeRedirectView
