import React, { useState, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import {
    Button,
    TextField,
    FormHelperText,
    Link,
    Grid,
    Typography,
    Paper
} from '@material-ui/core'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import { useMutation } from '@apollo/react-hooks'

import authContext from '../authContext'
import { AUTH_TOKEN, INVALID_CRED_ERR_MSG } from '../constants.js'
import { Layout, formUseStyles } from '../components'

import { LOGIN_MUTATION } from '../gqlQueriesMutations'

function Login({ history }) {
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
        history.push(`/`)
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
                    helperText={
                        invalidCred ? 'Please enter valid credentials' : ''
                    }
                />

                <Grid
                    container
                    justify='center'
                    alignItems='center'
                    spacing={3}
                >
                    <Grid item xs={6}>
                        <Button
                            className={classes.root}
                            name='submit'
                            label='Submit'
                            type='submit'
                            variant='contained'
                            color='primary'
                            fullWidth
                        >
                            Log In
                        </Button>

                        {unknownError && (
                            <FormHelperText
                                error={unknownError}
                                className={classes.root}
                            >
                                Unknown Error Occurred
                            </FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={6}>
                        <Link
                            component={RouterLink}
                            to='/signup'
                            className={classes.root}
                            color='secondary'
                        >
                            Need an account? Sign up
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
}

const CenterWrapping = props => (
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
)

export default props => (
    <Layout>
        <CenterWrapping {...props} />
    </Layout>
)
