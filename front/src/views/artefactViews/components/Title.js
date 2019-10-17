import React from 'react'
import { Grid, Typography } from '@material-ui/core'

export default ({ mode, classes }) => {
    var {create, edit, view} = mode
    return (
        <Grid item xs={12} sm={8}>
            <Typography variant='h4' className={classes.title}>
                {create && 'Create'} {edit && 'Edit'} {view && 'View'} Artefact
            </Typography>
            {!view && (
                <Typography variant='subtitle1' className={classes.title}>
                    {create &&
                        'Artefacts are belongings of the family, enter as much or as little detail as you like'}
                    {edit && 'Click to start editing'}
                </Typography>
            )}
        </Grid>
    )
}
