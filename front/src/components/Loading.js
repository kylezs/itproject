/**
 * @summary renders a loading symbol centered in the closest container
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 18:03:27
 */

import React from 'react'
import { CircularProgress, Grid } from '@material-ui/core'

// So user knows the page is loading, present a nice spinny circle
export default () => (
    <Grid
        container
        alignItems='center'
        justify='center'
        style={{ height: '90vh' }}
    >
        <CircularProgress />
    </Grid>
)
