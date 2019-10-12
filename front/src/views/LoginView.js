import React, { useState, useContext, Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import {
    Button,
    TextField,
    FormHelperText,
    Link,
    Grid,
    Typography,
    Paper,
    makeStyles
} from '@material-ui/core'

import { useMutation } from '@apollo/react-hooks'

import authContext from '../authContext'
import { AUTH_TOKEN, INVALID_CRED_ERR_MSG } from '../constants.js'
import { Layout, formUseStyles } from '../components'

import { LOGIN_MUTATION } from '../gqlQueriesMutations'

function Login(props) {
    const context = useContext(authContext)
    const classes = formUseStyles()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [invalidCred, setInvalidCred] = useState(false)
    const [unknownError, setUnknownError] = useState(false)

    const _confirm = async data => {
        const { token } = data.tokenAuth
        context.handleAuthentication(token)
        localStorage.setItem(AUTH_TOKEN, token)
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
        <Paper className={classes.paper} elevation={6}>
            <form onSubmit={submitForm} className={classes.form}>
                <Typography
                    component='h1'
                    variant='h5'
                    className={classes.root}
                >
                    Log In
                </Typography>
                <TextField
                    className={classes.root}
                    variant='outlined'
                    required
                    fullWidth
                    id='username'
                    label='Username'
                    autoFocus
                    onChange={e => setUsername(e.target.value)}
                    error={invalidCred}
                />
                <TextField
                    className={classes.root}
                    variant='outlined'
                    required
                    fullWidth
                    label='Password'
                    type='password'
                    id='password'
                    onChange={e => setPassword(e.target.value)}
                    error={invalidCred}
                />

                <Button
                    className={classes.root}
                    name='submit'
                    label='Submit'
                    type='submit'
                    variant='contained'
                    color='primary'
                >
                    Log In
                </Button>

                {invalidCred && (
                    <FormHelperText
                        error={invalidCred}
                        className={classes.root}
                    >
                        Please enter valid credentials
                    </FormHelperText>
                )}

                {unknownError && (
                    <FormHelperText
                        error={unknownError}
                        className={classes.root}
                    >
                        Unknown Error Occurred
                    </FormHelperText>
                )}

                <Link
                    component={RouterLink}
                    to='/signup'
                    className={classes.root}
                >
                    Need an account? Sign up
                </Link>
            </form>
        </Paper>
    )
}

export default props => (
    <Layout>
        <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justify='center'
            style={{ minHeight: '80vh' }}
        >
            <Grid item xs={10} sm={8} md={6} lg={4}>
                <Login {...props} />
            </Grid>
        </Grid>
    </Layout>
)
