/**
 * @summary Used by route to allow logout for user
 * @author Kyle Zsembery
 */

import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import authContext from '../authContext';

function Logout() {
    const context = useContext(authContext);
    context.logout();

    return (
        <Redirect to='/login' />
    );
}

export default Logout;
