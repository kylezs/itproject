import React, { useContext } from 'react';
import Layout from '../components/Layout';
import authContext from '../authContext';

export default HomeView = (props) => {

    const context = useContext(authContext);
    const loggedIn = context.authenticated;
    const username = context.user.username;
    return (
        <Layout>
            {loggedIn && (
                <p>Hello user: {username}</p>
            )}
        </Layout>

    );
}