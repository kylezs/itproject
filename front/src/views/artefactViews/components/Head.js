import React, { Fragment } from 'react'
import { Grid, Typography, Button } from '@material-ui/core'
import CreateButton from './CreateButton'

export default ({
    states,
    setters,
    classes,
    isAdmin,
    openDelete,
    noErrors
}) => {
    const { create, edit, view } = states.mode
    const showEditButton = view && isAdmin
    const showDeleteButton = edit && isAdmin

    return (
        <Fragment>
            {(showEditButton || showDeleteButton || create) && (
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
                    variant='contained'
                    onClick={e => setters.setMode({ edit: true })}
                    className={classes.editLinkButton}
                    style={{ marginLeft: 'auto' }}
                >
                    Edit
                </Button>
            )}
            {showDeleteButton && (
                <Button
                    color='default'
                    variant='contained'
                    onClick={openDelete}
                    className={classes.editLinkButton}
                    style={{ marginLeft: 'auto' }}
                >
                    Delete
                </Button>
            )}

            {create && (
                <CreateButton
                    noErrors={noErrors}
                    color='secondary'
                    variant='contained'
                    type='submit'
                    className={classes.editLinkButton}
                    style={{ marginLeft: 'auto' }}
                />
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
