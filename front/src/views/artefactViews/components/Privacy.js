import React, { Fragment } from 'react'
import {
    Switch,
    FormHelperText,
    Typography,
    FormControlLabel,
    Button
} from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default ({ states, setters, disabled, name, classes }) => {
    var { create, edit, view } = states.mode
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
    } else if (view && state.isPublic) {
        return (
            <Fragment>
                <Typography variant='h6' className={classes.fieldTitle}>
                    This artefact is public, accessible by link
                </Typography>
                <CopyToClipboard text={window.location.href}>
                    <Button variant='outlined'>Copy Link</Button>
                </CopyToClipboard>
            </Fragment>
        )
    } else {
        return null
    }
}
