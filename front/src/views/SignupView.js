import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';

import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';
import { USERNAME_TAKEN_ERR_MSG, MIN_PASSWORD_LEN } from "../constants.js"

const SIGNUP_MUTATION = gql`
mutation SignupMutation($email: String!, $password: String!, $username: String!){
    createUser(email: $email, username: $username, password: $password) {
        user {
            id
            username
            email
        }
    }
}
`

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '50%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Signup(props) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [usernameIsTaken, setUsernameIsTaken] = useState(false)
    const [emailIsTaken, setEmailIsTaken] = useState(false)
    const [validPassword, setValidPassword] = useState(false)

    var validator = require("email-validator");

    const classes = useStyles();
    const _confirm = async data => {
        // handle signup errors and potentially login
        props.history.push(`/login`)
    }

    const _handleError = async errors => {
        console.log("_handleError run")
        if (errors.graphQLErrors){
            const subMessage = errors.graphQLErrors[0].message.substring(0, 10)
            if (USERNAME_TAKEN_ERR_MSG.startsWith(subMessage)){
                setUsernameIsTaken(true)
            } else {
                console.log(errors)
            }
        }
    }

    const [signup] = useMutation(
        SIGNUP_MUTATION,
        {
            onCompleted: _confirm,
            onError: _handleError,
        }
    );

    const submitForm = async (event) => {
        event.preventDefault();
        console.log("form submitted")
        signup({ variables: {username: username, email: email, password: password} })
    }

    const changePassword = async (pass) => {
        setPassword(pass)

        // TO DO: password validation
        if (pass.length >= MIN_PASSWORD_LEN){
            setValidPassword(true)
        }
    }

    const errorPassword = !!password && !validPassword
    const errorConfirmPassword = !!confirmPassword && !(confirmPassword === password)

    return (
        <Layout>
            <CssBaseline />
            <div className={classes.paper}>
                <form className={classes.form} onSubmit={submitForm}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5">
                                Sign up
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="username"
                                name="username"
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                                error={usernameIsTaken}
                                onChange={e => setUsername(e.target.value)}
                                />
                            {
                                usernameIsTaken &&
                                <FormHelperText id="username" error={usernameIsTaken}>Username is taken</FormHelperText>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                type="email"
                                error={emailIsTaken || (email && !validator.validate(email))}
                                onChange={e => setEmail(e.target.value)}
                                />
                            {
                                email && !validator.validate(email) &&
                                <FormHelperText id="email" error={!validator.validate(email)}>Email is invalid</FormHelperText>
                            }
                            {
                                emailIsTaken &&
                                <FormHelperText id="email" error={emailIsTaken}>Email is taken</FormHelperText>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={ e => changePassword( e.target.value )}
                                error={errorPassword}
                                />
                            {
                                errorPassword &&
                                <FormHelperText id="password" error={errorPassword}>Passwords must be at least {MIN_PASSWORD_LEN} characters</FormHelperText>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="current-password"
                                onChange={ e => setConfirmPassword( e.target.value )}
                                error={errorConfirmPassword}
                                />
                            {
                                errorConfirmPassword &&
                                <FormHelperText id="confirmPassword" error={errorConfirmPassword}>Passwords must match</FormHelperText>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                name="submit"
                                label="Submit"
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={
                                    !(confirmPassword === password)
                                    || !username || !email || !validPassword
                                    || !validator.validate(email)
                                }
                                >
                                Sign Up
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid item>
                                <Link component={RouterLink} to="/login">
                                    Already have an account? Log in
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Layout>
    );
}

export default Signup
