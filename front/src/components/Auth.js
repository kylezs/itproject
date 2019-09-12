import React, { useState } from "react";
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { AuthProvider } from "../authContext";


const VERIFY_TOKEN_MUTATION = gql`
mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
        payload
    }
}
`



export default function Auth(props) {
    const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState({})
    const [authToken, setAuthToken] = useState("");
    const [VerifyToken, { data, error }] = useMutation(VERIFY_TOKEN_MUTATION,
        {
            onCompleted({ verifyToken }) {
                console.log("On completed called");
                console.log(verifyToken);
                setSession(verifyToken);
            }
        });

    const handleAuthentication = (authToken) => {
        console.log("Handle authenication called with token");
        console.log(authToken);


        VerifyToken({ variables: { token: authToken } })

        if (error) {
            console.log("[Error] handleAuthentication()")
            return;
        }
    };


    const setSession = (verifyToken) => {
        console.log("Set session being called")
        console.log(verifyToken);
        if (!verifyToken) {
            console.log("Invalid data, please sign in again");
            return;
        }
        const username = verifyToken.payload.username
        const user = {
            username: username,
        };
        setAuthenticated(true);
        setAuthToken(verifyToken);
        setUser(user);

    }

    const initiateLogin = () => {
        console.log("initiate login called");
        this.history.pushState(null, 'login');
    };

    const logout = () => {
        console.log("Logout called");
        setAuthenticated(false);
        setUser({});
        setAuthToken("");
    };

    const authProviderValue = {
        authenticated,
        authToken,
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
