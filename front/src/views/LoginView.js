import React, { Component, useContext } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import authContext from '../authContext';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { AUTH_TOKEN } from '../constants'
import { Redirect}  from 'react-router-dom';


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

    static contextType = authContext;
    state = {
        username: '',
        password: '',
    }

    render() {
        const classes = useStyles();

        const { username, password } = this.state
        return (
            <Layout>
                <CssBaseline />
                <div className={classes.paper}>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography component="h1" variant="h5">
                                    Log In
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="username"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                    onChange={e => this.setState({ username: e.target.value })}
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
                                    onError={errors => this._handleError(errors)}
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
    console.log("getting token first in confirm mutation");
    console.log(token);
    this.context.handleAuthentication(token);
    localStorage.setItem(AUTH_TOKEN, token);
    // this._saveUserData(token)
    this.props.history.push(`/`)
}

_handleError = async errors => {
    console.log(errors);
}

// _saveUserData = token => {
//     console.log("Save user data being called, but nothing being done");
//     authContext.handle
//     console.log(this.context);
//     // localStorage.setItem(AUTH_TOKEN, token)
// }
}

export default Login
