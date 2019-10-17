import React, { useContext } from 'react'
import {
    IconButton,
    Toolbar,
    AppBar,
    Button,
    makeStyles,
    Grid
} from '@material-ui/core'
// import MenuIcon from '@material-ui/icons/Menu'

import Brightness3Icon from '@material-ui/icons/Brightness3'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'

import LoggedInBar from './LoggedInBar'
import NotLoggedInBar from './NotLoggedInBar'
import { Link as RouterLink } from 'react-router-dom'
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
            <AppBar position='static' color='primary' elevation={6}>
            {/* <AppBar position='static' color={dark ? 'inherit' : 'primary'} elevation={6}> */}
                <Toolbar>
                    <Grid container>
                        <Grid item xs={2} container>
                            <Button
                                fullWidth
                                component={RouterLink}
                                to='/'
                                color='inherit'
                            >
                                Home
                            </Button>
                        </Grid>

                        <Grid item xs={10} container justify='flex-end' alignItems='center'>
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
