import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Family Artefacts Register
                    </Typography>

                    { loggedIn ?
                        <Button
                            color="inherit"
                            onClick={() => {
                                localStorage.removeItem(AUTH_TOKEN)
                                props.history.push(`/`)
                            }}
                            >
                            Logout
                        </Button>
                        : <Button color="inherit" component={LoginLink}>Login</Button>
                }

                { !loggedIn &&
                    <Button color="inherit" component={SignupLink}>Sign Up</Button>
                }

            </Toolbar>
        </AppBar>

        { loggedIn
            ? <div>Hello User {username}!</div>
            : <div>Bye World!</div>}
        </div>
    );
}

export default HomeView
