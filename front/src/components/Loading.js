import React from 'react'
import { CircularProgress, Grid } from '@material-ui/core'

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
