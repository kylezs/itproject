import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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


const LOGIN_MUTATION = gql`
mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
        token
    }
}
`

function useStyles(){
    return makeStyles(theme => ({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        dense: {
            marginTop: theme.spacing(2),
        },
        menu: {
            width: 200,
        },
    }));
}

class Login extends Component {
    state = {
        username: '',
        password: '',
        showPassword: false
    }

    render() {
        const classes = useStyles();

        const handleClickShowPassword = () => {
            this.setState({ showPassword: !this.state.showPassword })
        };

        const handleMouseDownPassword = event => {
            event.preventDefault();
        };

        const { username, password, showPassword } = this.state
        return (
            <Layout>
                <CssBaseline />
                <div className={classes.paper}>
                    <form key="formKey" className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography component="h1" variant="h5">
                                    Log In
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
                                    onInput={e => {
                                        e.preventDefault();
                                        this.setState({ username: e.target.value });
                                    }
                                    }
                                        
                                    />
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
                                    onInput={e => {
                                        e.preventDefault();
                                        this.setState({ password: e.target.value });
                                    }}
                                    />
                            </Grid>

                            <Grid item xs={12}>
                                <Mutation
                                    mutation={LOGIN_MUTATION}
                                    variables={{ username, password }}
                                    onCompleted={data => this._confirm(data)}
                                    >
                                    {mutation => (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={mutation}
                                            >
                                            Login
                                        </Button>
                                    )}
                                </Mutation>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid item>
                                    <Link href="/signup" variant="body2">
                                        Need an account? Sign up
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
    const { token } = data.tokenAuth
    this._saveUserData(token)
    this.props.history.push(`/`)
}

_saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
}
}

export default Login
