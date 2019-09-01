import React, { Component } from 'react';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { MemoryRouter as Router } from 'react-router';
import { Link } from 'react-router-dom';

const LoginLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/login" {...props} />
));

const SignupLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/signup" {...props} />
));

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

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Family Artefacts Register
          </Typography>
          <Button color="inherit" component={LoginLink}>Login</Button>
          <Button color="inherit" component={SignupLink}>Sign Up</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
