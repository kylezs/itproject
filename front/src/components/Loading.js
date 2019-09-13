import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import CircularProgress from '@material-ui/core/CircularProgress';

function Loading() {
    const useStyles = makeStyles(theme => ({
        progress: {
            margin: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    return (
        <Layout>
            <CircularProgress className={classes.progress} />
        </Layout>
    );
}

export default Loading;
