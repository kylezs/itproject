import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Layout from '../components/Layout'
import authContext from '../authContext'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { AUTH_TOKEN, INVALID_CRED_ERR_MSG } from '../constants.js'

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
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '50%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}))

function Login(props) {
    const context = useContext(authContext)
    const classes = useStyles()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [invalidCred, setInvalidCred] = useState(false)
    const [unknownError, setUnknownError] = useState(false)

    const _confirm = async data => {
        const { token } = data.tokenAuth
        console.log('getting token first in confirm mutation')
        context.handleAuthentication(token)
        localStorage.setItem(AUTH_TOKEN, token)
        // this._saveUserData(token)
        props.history.push(`/`)
    }

    const _handleError = async errors => {
        console.log('_handleError run')
        if (errors.graphQLErrors) {
            const subMessage = errors.graphQLErrors[0].message.substring(0, 15)
            if (INVALID_CRED_ERR_MSG.startsWith(subMessage)) {
                setInvalidCred(true)
                console.log('invalid credentials')
            } else {
                console.log('unexpect error(s):')
                console.log(errors)
                setUnknownError(true)
            }
        }
    }

    const [login] = useMutation(LOGIN_MUTATION, {
        onCompleted: _confirm,
        onError: _handleError
    })

    const submitForm = async event => {
        login({ variables: { username: username, password: password } })
        event.preventDefault()
    }

    return (
        <Layout>
            <CssBaseline />
            <div className={classes.paper}>
                <form className={classes.form} onSubmit={submitForm}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component='h1' variant='h5'>
                                Log In
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                id='username'
                                label='Username'
                                autoFocus
                                onChange={e => setUsername(e.target.value)}
                                error={invalidCred}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                label='Password'
                                type='password'
                                id='password'
                                onChange={e => setPassword(e.target.value)}
                                error={invalidCred}
                            />
                            {invalidCred && (
                                <FormHelperText
                                    id='password'
                                    error={invalidCred}
                                >
                                    Please enter valid credentials
                                </FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                name='submit'
                                label='Submit'
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='primary'
                            >
                                Log In
                            </Button>
                            {unknownError && (
                                <FormHelperText
                                    id='password'
                                    error={unknownError}
                                >
                                    Unknown Error Occurred
                                </FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Grid item>
                                <Link component={RouterLink} to='/signup'>
                                    Need an account? Sign up
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Layout>
    )
}

export default Login
