import React, { useState, useContext } from 'react';
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


const LOGIN_MUTATION = gql`
mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
        token
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

function Login(props) {

    const context = useContext(authContext);

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const _confirm = async data => {
        const { token } = data.tokenAuth
        console.log("getting token first in confirm mutation");
        console.log(token);
        context.handleAuthentication(token);
        // this._saveUserData(token)
        props.history.push(`/`)
    }

    const _handleError = async errors => {
        console.log(errors);
    }

    const classes = useStyles();

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
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                                onChange={e => setUsername(e.target.value)}
                                />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                onChange={e => setPassword(e.target.value)}
                                />
                        </Grid>

                        <Grid item xs={12}>
                            <Mutation
                                mutation={LOGIN_MUTATION}
                                variables={{ username, password }}
                                onCompleted={_confirm}
                                onError={_handleError}
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

export default Login
