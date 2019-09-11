import React from 'react';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const LoginLink = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} to="/login" {...props} />
));

const SignupLink = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} to="/signup" {...props} />
));


export default props => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    function handleMenu(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }
    return (
        <div>
            <Button color="inherit" underline="none" component={SignupLink}>Sign up</Button>
            <Button color="inherit" underline="none" component={LoginLink}>Login</Button>
        </div>
    );
};