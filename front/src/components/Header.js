import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useMutation } from '@apollo/react-hooks';

import LoggedInBar from './LoggedInBar';
import NotLoggedInBar from './NotLoggedInBar';
import { Link as RouterLink } from 'react-router-dom';
import { Link }  from '@material-ui/core';

import { AUTH_TOKEN } from '../constants'
import gql from 'graphql-tag'

const VERIFY_TOKEN_MUTATION = gql`
mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
        payload
    }
}
`

const useStyles = makeStyles(theme => ({
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

export default function MenuAppBar() {
    const classes = useStyles();
    let loggedIn = false;
    let username = null;
    const authToken = localStorage.getItem(AUTH_TOKEN);
    
    const [VerifyToken, { data }] = useMutation(VERIFY_TOKEN_MUTATION);

    if (authToken) {
        VerifyToken({ variables: { token: authToken } })
    }
    

    if (data && data.verifyToken) {
        console.log("token verified")
        loggedIn = true
        username = data.verifyToken.payload.username
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Link component={RouterLink} to='/' color="inherit" variant="inherit" underline="none">
                            Family AR
                        </Link>
                    </Typography>
            {loggedIn && (
                <LoggedInBar username={username} />
            )}
            {!loggedIn && (
                <NotLoggedInBar />
            )}
                </Toolbar>
            </AppBar>
        </div>
    );
}