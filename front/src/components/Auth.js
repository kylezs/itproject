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



export default function Auth(props) {
    const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState({})
    const [authToken, setAuthToken] = useState("");
    const [VerifyToken, {error, loading }] = useMutation(VERIFY_TOKEN_MUTATION,
        {
            onCompleted({ verifyToken }) {
                console.log("On completed called");
                // console.log(verifyToken);
                // setSession(verifyToken);
            }
        });

    const handleAuthentication = async (authToken, _callback) => {
        // if (!authToken) {
        //     authToken = localStorage.getItem(AUTH_TOKEN)
        // }

        console.log("Wait for verifyToken");
        await VerifyToken({ variables: { token: authToken } }).then((data) => {
            console.log("Set session to be called inside the Verifytoken");
            setSession(data)
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
        console.log("Set session being called")
        console.log(data);
        
        if (error) {
            console.log("Invalid data, please sign in again");
            return;
        }
        
        const username = data.data.verifyToken.payload.username
        console.log(username);
        const user = {
            username: username,
        };
        setAuthenticated(true);
        setAuthToken(data.verifyToken);
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
        localStorage[AUTH_TOKEN] = "";
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
