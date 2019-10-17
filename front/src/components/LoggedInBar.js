import React, { useContext } from 'react'
import {
    IconButton,
    Menu,
    MenuItem,
    Button,
    makeStyles,
    Drawer,
    List,
    ListItem,
    ListItemText
} from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle'
import authContext from '../authContext'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 'auto',
        margin: theme.spacing(1),
        marginTop: theme.spacing(5)
    }
}))

export default ({ drawerOpen, setDrawerOpen }) => {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const context = useContext(authContext)
    const open = Boolean(anchorEl)

    function handleMenu(event) {
        setAnchorEl(event.currentTarget)
    }

    function handleClose() {
        setAnchorEl(null)
    }

    function handleLogout() {
        context.logout()
    }

    return (
        <div>
            <Drawer
                anchor='left'
                open={drawerOpen}
                onClose={e => setDrawerOpen(false)}
            >
                <div
                    className={classes.drawer}
                    role='presentation'
                    onClick={e => setDrawerOpen(false)}
                    onKeyDown={e => setDrawerOpen(false)}
                >
                    <List>
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'Create Family', path: '/family/create/' },
                            {
                                name: 'Manage Artefacts',
                                path: '/artefacts/manage/'
                            },
                            {
                                name: 'Create Artefact',
                                path: '/artefacts/create/'
                            },
                            { name: 'Artefact Map', path: '/map/' }
                        ].map(({ name, path }) => (
                            <ListItem
                                button
                                key={path}
                                component={RouterLink}
                                to={path}
                                style={{borderRadius: 10}}
                            >
                                {/* <ListItemIcon>
                                    {index % 2 === 0 ? (
                                        <InboxIcon />
                                    ) : (
                                        <MailIcon />
                                    )}
                                </ListItemIcon> */}
                                <ListItemText
                                    primary={name}
                                    // primaryTypographyProps={{variant: 'h6'}}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    )
}
