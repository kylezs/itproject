import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';

import { Link } from 'react-router-dom';

import { AUTH_TOKEN } from '../constants'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'

const VERIFY_TOKEN_MUTATION = gql`
mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
        payload
    }
}
`

const LoginLink = React.forwardRef((props, ref) => (
    <Link innerRef={ref} to="/login" {...props} />
));

const SignupLink = React.forwardRef((props, ref) => (
    <Link innerRef={ref} to="/signup" {...props} />
));

function useStyles(){
    return makeStyles(theme => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }));
}


function HomeView(props) {
    const classes = useStyles();
    const authToken = localStorage.getItem(AUTH_TOKEN);
    var loggedIn;
    var username;

    const [VerifyToken, { data }] = useMutation(VERIFY_TOKEN_MUTATION);
    VerifyToken({ variables: {token: authToken}})

    if (data && data.verifyToken){
        console.log("token verified")
        loggedIn = true
        username = data.verifyToken.payload.username
    }

    return (
        <Layout>
            This is the home page. Welcome!
        </Layout>
    );
}

export default HomeView
