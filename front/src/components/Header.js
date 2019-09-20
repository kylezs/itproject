import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import LoggedInBar from './LoggedInBar';
import NotLoggedInBar from './NotLoggedInBar';
import { Link as RouterLink } from 'react-router-dom';
import { Link }  from '@material-ui/core';

import authContext from '../authContext';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function MenuAppBar() {
    const classes = useStyles();
    const context = useContext(authContext);
    let loggedIn = context.authenticated;
    let username = null;

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Link component={RouterLink} to='/' color="inherit" variant="inherit" underline="none">
                            Family AR
                        </Link>
                    </Typography>
            {loggedIn && (
                <LoggedInBar username={username} />
            )}
            {!loggedIn && (
                <NotLoggedInBar />
            )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
