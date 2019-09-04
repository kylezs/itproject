import React, { Component } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

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

class Signup extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        showPassword: false,
    }

    render() {
        const classes = useStyles();

        const handleClickShowPassword = () => {
            this.setState({ showPassword: !this.state.showPassword })
        };

        const handleMouseDownPassword = event => {
            event.preventDefault();
        };

        const { username, email, password, showPassword } = this.state
        return (
            <Box component="span" m={1}>
                <form className={classes.container} noValidate autoComplete="off">
                    <FormControl className={clsx(classes.margin, classes.textField)}>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input
                            id="username"
                            type={'text'}
                            value={username}
                            onChange={e => this.setState({ username: e.target.value })}
                            />
                    </FormControl>

                    <FormControl className={clsx(classes.margin, classes.textField)}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input
                            id="email"
                            type={'text'}
                            value={email}
                            onChange={e => this.setState({ email: e.target.value })}
                            />
                    </FormControl>

                    <FormControl className={clsx(classes.margin, classes.textField)}>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => this.setState({ password: e.target.value })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            />
                    </FormControl>

                    <Mutation
                        mutation={SIGNUP_MUTATION}
                        variables={{ username, email, password }}
                        onCompleted={data => this._confirm(data)}
                        >
                        {mutation => (
                            <Button
                                color="inherit"
                                onClick={mutation}
                                >
                                Sign Up
                            </Button>
                        )}
                    </Mutation>

                </form>
            </Box   >
        );
    }

    _confirm = async data => {
        // handle signup errors and potentially login
        this.props.history.push(`/login`)
    }

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    }
}

export default Signup