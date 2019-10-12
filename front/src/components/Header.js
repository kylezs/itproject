import React, { useContext } from 'react'
import {
    IconButton,
    Typography,
    Toolbar,
    AppBar,
    Button,
    makeStyles,
    Grid
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import Brightness3Icon from '@material-ui/icons/Brightness3'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'

import LoggedInBar from './LoggedInBar'
import NotLoggedInBar from './NotLoggedInBar'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import authContext from '../authContext'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1,
        alignText: 'left'
    }
}))

export default function MenuAppBar(props) {
    const classes = useStyles()
    const context = useContext(authContext)
    let loggedIn = context.authenticated
    let username = null
    const theme = useTheme()
    const dark = theme && theme.palette.type === 'dark'
    return (
        <div className={classes.root}>
            <AppBar position='static' color='inherit'>
                <Toolbar>
                    <Grid container>
                        <Grid item xs={4} container>
                            <IconButton
                                edge='start'
                                className={classes.menuButton}
                                color='inherit'
                                aria-label='menu'
                            >
                                <MenuIcon />
                            </IconButton>

                            <Button
                                className={classes.title}
                                component={RouterLink}
                                to='/'
                                color='inherit'
                            >
                                Home
                            </Button>
                        </Grid>

                        <Grid item xs={8} container justify='flex-end' alignItems='center'>
                            <IconButton
                                className={classes.menuButton}
                                color='inherit'
                                aria-label='menu'
                                onClick={props.onToggleDarkTheme}
                            >
                                {!dark ? (
                                    <Brightness3Icon />
                                ) : (
                                    <BrightnessHighIcon />
                                )}
                            </IconButton>

                            {loggedIn && <LoggedInBar username={username} />}
                            {!loggedIn && <NotLoggedInBar />}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )
}
