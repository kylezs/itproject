import React, { Fragment } from 'react'
import { Grid, Typography, Button } from '@material-ui/core'
import CreateButton from './CreateButton'
import { withGetScreen } from 'react-getscreen'

export default withGetScreen(
    ({ states, setters, classes, isAdmin, openDelete, noErrors, isMobile }) => {
        const { create, edit, view } = states.mode
        const showEditButton = view && isAdmin
        const showDeleteButton = edit && isAdmin
        const marginLeftButton = isMobile() ? 18 : 'auto'

        return (
            <Fragment>
                {(showEditButton || showDeleteButton || create) && !isMobile() && (
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
                <Typography variant='h4' align='center'>
                    {create && 'Create'} {edit && 'Edit'} {view && 'View'}{' '}
                    Artefact
                </Typography>
                {showEditButton && (
                    <Button
                        color='secondary'
                        variant='contained'
                        onClick={e => setters.setMode({ edit: true })}
                        className={classes.editLinkButton}
                        style={{ marginLeft: marginLeftButton }}
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
                        style={{ marginLeft: marginLeftButton }}
                    >
                        Delete
                    </Button>
                )}

                {create && (
                    <CreateButton
                        noErrors={noErrors}
                        className={classes.editLinkButton}
                        style={{ marginLeft: marginLeftButton }}
                    />
                )}
                {create && (
                    <Grid item xs={12}>
                        <Typography
                            variant='subtitle1'
                            align={isMobile() ? 'left' : 'center'}
                        >
                            Artefacts are belongings of the family, enter as
                            much or as little detail as you like
                        </Typography>
                    </Grid>
                )}
            </Fragment>
        )
    }
)
