import React, { Fragment } from 'react'
import {
    Switch,
    FormHelperText,
    Typography,
    FormControlLabel
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
                <FormControlLabel
                    control={
                        <Switch
                            checked={state.isPublic || false}
                            onChange={e =>
                                handleSetField(name, e.target.checked)
                            }
                            // edge='end'
                            disabled={disabled}
                        />
                    }
                    style={{ marginLeft: 3 }}
                    label='Public'
                />
                <FormHelperText className={classes.fieldTitle}>
                    {state.isPublic
                        ? 'Viewable by anyone'
                        : 'Viewable by family members only'}
                </FormHelperText>
            </Fragment>
        )
    } else {
        return null
    }
}
