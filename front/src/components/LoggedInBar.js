import React, { useContext } from 'react';
import { IconButton, Menu, MenuItem, Button } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import authContext from '../authContext';

export default props => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const context = useContext(authContext);
    const open = Boolean(anchorEl);

    function handleMenu(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleLogout() {
        context.logout();
    }

    return (
        <div>
            <Button color="inherit">
                Manage Artefacts
            </Button>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
};
