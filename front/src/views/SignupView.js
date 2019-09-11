import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';

import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'


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

function useStyles(){
    return makeStyles(theme => ({
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
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(3),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }));
}

class Signup extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        usernameIsTaken: false,
        emailIsTaken: false,
    }

    render() {
        const classes = useStyles();

        const handleClickShowPassword = () => {
            this.setState({ showPassword: !this.state.showPassword })
        };

        const handleMouseDownPassword = event => {
            event.preventDefault();
        };

        const { username, email, password, confirmPassword } = this.state
        const { showPassword, usernameIsTaken, emailIsTaken } = this.state

        return (
            <Layout>
                <CssBaseline />
                <div className={classes.paper}>
                    <form className={classes.form} noValidate>
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
                                    onChange={e => this.setState({ username: e.target.value })}
                                    />

                                {
                                    usernameIsTaken &&
                                    <FormControl className={classes.form} error>
                                        <FormHelperText id="username">Username is taken</FormHelperText>
                                    </FormControl>
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
                                    onChange={e => this.setState({ email: e.target.value })}
                                    />

                                {
                                    emailIsTaken &&
                                    <FormControl className={classes.form} error>
                                        <FormHelperText id="email">Email is taken</FormHelperText>
                                    </FormControl>
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
                                    onChange={e => this.setState({ password: e.target.value })}
                                    />
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
                                    onChange={e => this.setState({ confirmPassword: e.target.value })}
                                    />
                            </Grid>

                            <Grid item xs={12}>
                                {
                                    confirmPassword == password ?
                                    <Mutation
                                        mutation={SIGNUP_MUTATION}
                                        variables={{ username, email, password }}
                                        onCompleted={this._confirm}
                                        >
                                        {mutation => (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                onClick={mutation}
                                                >
                                                Sign Up
                                            </Button>
                                        )}
                                    </Mutation>
                                    :
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        >
                                        Passwords Do Not Match
                                    </Button>
                                }
                            </Grid>

                            <Grid item xs={12}>
                                <Grid item>
                                    <Link href="/login" variant="body2">
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

    _confirm = async data => {
        // handle signup errors and potentially login
        console.log(data)
        this.props.history.push(`/login`)
    }
}

export default Signup
