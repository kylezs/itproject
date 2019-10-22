import React, { useState } from "react";
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { AuthProvider } from "../authContext";
import { AUTH_TOKEN } from '../constants'


const VERIFY_TOKEN_MUTATION = gql`
mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
        payload
    }
}
`

// Component that allows for Authentication throughout the application
export default function Auth(props) {
    const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState({})
    const [VerifyToken, {error, loading }] = useMutation(VERIFY_TOKEN_MUTATION)

    const handleAuthentication = async (authToken, _callback) => {
        
        // const token = localStorage.getItem(AUTH_TOKEN)

        await VerifyToken({ variables: { token: authToken } }).then((data) => {
            setSession(data)
            if (_callback) {
                _callback();
            }
        }).catch((errors) => {
            // If could not validate it, remove it to stop unnecessary requests
            localStorage[AUTH_TOKEN] = ""
            setAuthenticated(false)
            if (_callback) {
                _callback();
            }
        }

        );
        if (error) {
            console.log("[Error] handleAuthentication()")
            return;
        }

        if (loading) {
            console.log("Thing is loading");
        }

    };

    const setSession = (data) => {

        if (error) {
            console.log("Invalid data, please sign in again");
            return;
        }

        const username = data.data.verifyToken.payload.username
        console.log("Here's the user id: ", data.data.verifyToken.payload.id);
        const user = {
            username: username,
        };
        setAuthenticated(true);
        setUser(user);
    }

    const initiateLogin = () => {
        this.history.pushState(null, 'login');
    };

    const logout = () => {
        console.log("Logout called");
        setAuthenticated(false);
        setUser({});
        // setAuthToken("");
        localStorage[AUTH_TOKEN] = "";
    };

    const authProviderValue = {
        authenticated,
        // authToken,
        user,
        initiateLogin: initiateLogin,
        handleAuthentication: handleAuthentication,
        logout: logout
    };

    return (
        <AuthProvider value={authProviderValue}>
            {props.children}
        </AuthProvider>
    );
}
