import React from 'react'
import { Grid, FormControl, Paper } from '@material-ui/core'
import EditButtons from './EditButtons'

export default ({
    child: Child,
    childProps,
    name,
    classes,
    editButtonProps
}) => {
    var { beingEdited, mode } = childProps
    var { edit } = mode
    var thisBeingEdited = beingEdited === name
    var someBeingEdited = edit && !!beingEdited
    return (
        <Paper className={classes.paperWrapper} elevation={3}>
            <FormControl className={classes.formControl} fullWidth>
                <Child
                    {...childProps}
                    disabled={someBeingEdited && !thisBeingEdited}
                    name={name}
                    classes={classes}
                />

                {thisBeingEdited && <EditButtons {...editButtonProps} />}
            </FormControl>
        </Paper>
    )
}
