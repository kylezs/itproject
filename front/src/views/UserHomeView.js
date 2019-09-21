import React, { useContext } from 'react';
import Layout from '../components/Layout';
import authContext from '../authContext';

function UserHomeView(props) {

    const context = useContext(authContext);
    const loggedIn = context.authenticated;
    const username = context.user.username;
    return (
        <Layout>
            {loggedIn && (
                <div>
                <p>Hello user: {username} </p>
                <p>Your artefacts should appear on this page. But only those of the family you selected.</p>
                </div>
            )}
        </Layout>
    );
}

export default UserHomeView
