import React from 'react'
import { CircularProgress, Grid } from '@material-ui/core'
import { Layout } from './'

export default () => (
    <Layout>
        <Grid
            container
            alignItems='center'
            justify='center'
            style={{ height: '90vh' }}
        >
            <CircularProgress />
        </Grid>
    </Layout>
)
