import React, { useState } from 'react'
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

import { Layout, formUseStyles } from '../components'
import { USERNAME_TAKEN_ERR_MSG } from '../constants.js'
import {
    PASSWORD_SCHEMA,
    parseFailedRules
} from '../components/passwordValidator.js'

import { SIGNUP_MUTATION } from '../gqlQueriesMutations'

const useStyles = makeStyles(theme => ({
    root: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        margin: theme.spacing(1),
        borderRadius: 10
    },
    paper: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        alignItems: 'center',
        alignContent: 'stretch',
        justify: 'center',
        borderRadius: 10
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}))

function Signup(props) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [usernameIsTaken, setUsernameIsTaken] = useState(false)
    const [emailIsTaken, setEmailIsTaken] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [failedPassRules, setFailedPassRules] = useState([])
    const [unknownError, setUnknownError] = useState(false)

    var emailValidator = require('email-validator')

    const classes = useStyles()
    const _confirm = async data => {
        // handle signup errors and potentially login
        props.history.push(`/login`)
    }

    const _handleError = async errors => {
        console.log('_handleError run')
        if (errors.graphQLErrors) {
            const subMessage = errors.graphQLErrors[0].message.substring(0, 10)
            if (USERNAME_TAKEN_ERR_MSG.startsWith(subMessage)) {
                setUsernameIsTaken(true)
            } else {
                console.log('unexpect error(s):')
                console.log(errors)
                setUnknownError(true)
            }
        }
    }

    const [signup] = useMutation(SIGNUP_MUTATION, {
        onCompleted: _confirm,
        onError: _handleError
    })

    const submitForm = async event => {
        event.preventDefault()
        console.log('form submitted')
        signup({
            variables: { username: username, email: email, password: password }
        })
    }

    const changePassword = async pass => {
        setPassword(pass)

        // password validation
        var failedRules = PASSWORD_SCHEMA.validate(pass, { list: true })
        setFailedPassRules(failedRules)
        if (failedRules.length !== 0) {
            setValidPassword(false)
        } else {
            setValidPassword(true)
        }
    }

    const errorPassword = !!password && !validPassword
    const errorConfirmPassword =
        !!confirmPassword && !(confirmPassword === password)

    const disableSubmit =
        (!!password && (!(confirmPassword === password) || !validPassword)) ||
        (!!email && !emailValidator.validate(email))

    const invalidEmail = !!email && !emailValidator.validate(email)
    const emailError = emailIsTaken || invalidEmail
    var emailErrMsg = ''
    if (invalidEmail) {
        emailErrMsg = 'Email is invalid'
    } else if (emailIsTaken) {
        emailErrMsg = 'Email is taken'
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form className={classes.form} onSubmit={submitForm}>
                <Typography
                    component='h1'
                    variant='h5'
                    className={classes.root}
                >
                    Sign up
                </Typography>

                <TextField
                    className={classes.root}
                    onChange={e => setUsername(e.target.value)}
                    variant='outlined'
                    required
                    fullWidth
                    autoComplete='username'
                    label='Username'
                    type='username'
                    autoFocus
                    error={usernameIsTaken}
                    helperText={usernameIsTaken ? 'Username is taken' : ''}
                />

                <TextField
                    className={classes.root}
                    variant='outlined'
                    required
                    fullWidth
                    autoComplete='email'
                    label='Email'
                    type='email'
                    onChange={e => setEmail(e.target.value)}
                    error={emailError}
                    helperText={emailErrMsg}
                />

                <TextField
                    className={classes.root}
                    variant='outlined'
                    required
                    fullWidth
                    autoComplete='password'
                    label='Password'
                    type='password'
                    onChange={e => changePassword(e.target.value)}
                    error={errorPassword}
                    helperText={
                        errorPassword ? parseFailedRules(failedPassRules) : ''
                    }
                />

                <TextField
                    className={classes.root}
                    variant='outlined'
                    required
                    fullWidth
                    label='Confirm Password'
                    type='password'
                    onChange={e => setConfirmPassword(e.target.value)}
                    error={errorConfirmPassword}
                    helperText={
                        errorConfirmPassword ? 'Passwords must match' : ''
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
                            fullWidth
                            label='Submit'
                            type='submit'
                            variant='contained'
                            color='primary'
                            disabled={disableSubmit}
                        >
                            Sign Up
                        </Button>
                        {unknownError && (
                            <FormHelperText
                                error={unknownError}
                            ></FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={6}>
                        <Link
                            className={classes.root}
                            component={RouterLink}
                            to='/login'
                            color='secondary'
                        >
                            Already have an account? Log in
                        </Link>
                    </Grid>
                </Grid>
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
                <Signup {...props} />
            </Grid>
        </Grid>
    </Layout>
)
