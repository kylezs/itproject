import React, { useContext, useState } from 'react'
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

import { teal, deepPurple, indigo } from '@material-ui/core/colors'

import {
    Home,
    Group,
    Create,
    Map,
    Apps,
    AccountCircle,
    Help
} from '@material-ui/icons'

import authContext from '../authContext'
import { Link as RouterLink } from 'react-router-dom'
import zIndex from '@material-ui/core/styles/zIndex'

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 'auto',
        marginTop: theme.spacing(5)
    }
}))

const Trianglify = require('trianglify')
const pattern = Trianglify({ width: 200, height: 200 })
const mediaURI = pattern.png()

const ComingSoon = () => {
    return (
            <span style={{
                position: "absolute",
                marginTop: "14px",
                marginLeft: "2px",
                padding: "1px",
                fontSize: "10px",
                color: "white",
                backgroundColor: "#00BCD4",
                borderRadius: "4px",
                zIndex: 2
            }}>
                Coming Soon
            </span>
    )
}

export default ({ drawerOpen, setDrawerOpen, setHelpOpen }) => {
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
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            <IconButton
                edge='start'
                color='inherit'
                aria-label='menu'
                onClick={() => setHelpOpen(true)}
            >
                <Help />
            </IconButton>

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
                <MenuItem onClick={handleClose} disabled>
                    Profile
                    <ComingSoon />
                </MenuItem>
                <MenuItem onClick={handleClose} disabled>
                    Settings
                    <ComingSoon />
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    )
}
