import React, { Fragment } from 'react'
import { Grid, Typography, Button } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'

export default ({ mode, classes, isAdmin, goToEdit, openDelete }) => {
    const { create, edit, view } = mode
    const showEditButton = view && isAdmin
    const showDeleteButton = edit && isAdmin

    return (
        <Fragment>
            {(showEditButton || showDeleteButton) && (
                <div
                    className={classes.editLinkButton}
                    style={{
                        marginRight: 'auto',
                        // width: '65px',
                        height: '20px',
                        visibility: 'hidden'
                    }}
                />
            )}
            <Typography variant='h4' className={classes.title}>
                {create && 'Create'} {edit && 'Edit'} {view && 'View'} Artefact
            </Typography>
            {showEditButton && (
                <Button
                    color='secondary'
                    variant='outlined'
                    onClick={goToEdit}
                    className={classes.editLinkButton}
                    style={{ marginLeft: 'auto' }}
                >
                    Edit
                </Button>
            )}
            {showDeleteButton && (
                <Button
                    color='default'
                    variant='outlined'
                    onClick={openDelete}
                    className={classes.editLinkButton}
                    style={{ marginLeft: 'auto' }}
                >
                    Delete
                </Button>
            )}
            {create && (
                <Grid item xs={12}>
                    <Typography variant='subtitle1' className={classes.title}>
                        Artefacts are belongings of the family, enter as much or
                        as little detail as you like
                    </Typography>
                </Grid>
            )}
        </Fragment>
    )
}
