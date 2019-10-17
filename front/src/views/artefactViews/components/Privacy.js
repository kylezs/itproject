import React, { Fragment } from 'react'
import {
    Switch,
    FormHelperText,
    Typography
} from '@material-ui/core'

export default ({ mode, states, setters, disabled, name, classes }) => {
    var { create, edit } = mode
    var { state } = states
    var { handleSetField } = setters

    if (create || edit) {
        return (
            <Fragment>
                <Typography variant='h6' className={classes.fieldTitle}>
                    Privacy
                </Typography>
                <Switch
                    checked={state.isPublic || false}
                    onChange={e => handleSetField(name, e.target.checked)}
                    edge='end'
                    style={{ marginLeft: 3 }}
                    disabled={disabled}
                />
                <FormHelperText className={classes.fieldTitle}>
                    {state.isPublic
                        ? 'This artefact will be viewable by anyone'
                        : 'This artefact will be viewable by family members'}
                </FormHelperText>
            </Fragment>
        )
    } else {
        return null
    }
}
