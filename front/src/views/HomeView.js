import React, { useContext } from 'react';
import Layout from '../components/Layout';
import authContext from '../authContext';

function HomeView(props) {

    const context = useContext(authContext);
    const loggedIn = context.authenticated;
    const username = context.user.username;
    return (
        <Layout>
            {loggedIn && (
                <p>Hello user: {username}</p>
            )}
            {!loggedIn && (
                <p>Hello non-signed in user</p>
            )}
        </Layout>
    );
}

export default HomeView
