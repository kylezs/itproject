import React, { useContext, useState } from 'react'
import {
    IconButton,
    Toolbar,
    AppBar,
    makeStyles,
    Typography,
} from '@material-ui/core'
// import MenuIcon from '@material-ui/icons/Menu'

import { Home, Menu, Brightness4, Brightness7 } from '@material-ui/icons'

import LoggedInBar from './LoggedInBar'
import NotLoggedInBar from './NotLoggedInBar'
import { Link as RouterLink } from 'react-router-dom'
import { useTheme } from '@material-ui/styles'

import authContext from '../authContext'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    iconButton: {
        marginRight: theme.spacing(1)
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

    const [open, setOpen] = useState(false)
    return (
        <div className={classes.root}>
            <AppBar position='static' color='primary' elevation={6}>
                <Toolbar>
                    <IconButton
                        className={classes.iconButton}
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        onClick={e => setOpen(true)}
                    >
                        <Menu />
                    </IconButton>

                    <IconButton
                        className={classes.iconButton}
                        color='inherit'
                        aria-label='home'
                        component={RouterLink}
                        to='/'
                    >
                        <Home />
                    </IconButton>

                    <Typography variant='h6' className={classes.title} noWrap>
                        AMS
                    </Typography>


                    <IconButton
                        className={classes.iconButton}
                        color='inherit'
                        aria-label='theme-toggle'
                        onClick={props.onToggleDarkTheme}
                    >
                        {!dark ? <Brightness4 /> : <Brightness7 />}
                    </IconButton>

                    {loggedIn ? (
                        <LoggedInBar
                            username={username}
                            drawerOpen={open}
                            setDrawerOpen={setOpen}
                            setHelpOpen={props.setHelpOpen}
                        />
                    ) : (
                        <NotLoggedInBar />
                    )}
                </Toolbar>
            </AppBar>
        </div>
    )
}
