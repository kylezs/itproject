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
    ListItemText,
    ListItemIcon
} from '@material-ui/core'

import {
    Home,
    Group,
    Create,
    Map,
    Apps,
    AccountCircle
} from '@material-ui/icons'

import authContext from '../authContext'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 'auto',
        // margin: theme.spacing(1),
        marginTop: theme.spacing(5)
    }
}))

const Trianglify = require('trianglify')
const pattern = Trianglify({ width: 200, height: 200 })
const mediaURI = pattern.png()

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
                            { name: 'Home', path: '/', icon: Home },
                            {
                                name: 'Create Family',
                                path: '/family/create/',
                                icon: Group
                            },
                            {
                                name: 'Manage Artefacts',
                                path: '/artefacts/manage/',
                                icon: Apps
                            },
                            {
                                name: 'Create Artefact',
                                path: '/artefacts/create/',
                                icon: Create
                            },
                            { name: 'Artefact Map', path: '/map/', icon: Map }
                        ].map(({ name, path, icon: Icon }) => (
                            <ListItem
                                button
                                key={path}
                                component={RouterLink}
                                to={path}
                                style={{ borderRadius: 10 }}
                            >
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
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
