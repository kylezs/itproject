import React from 'react'
import { TextField, MenuItem } from '@material-ui/core'

export default ({ mode, states, setters, artefactStates, disabled, name }) => {
    var { view } = mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <TextField
            id='state'
            label='Artefact State'
            variant='outlined'
            required
            fullWidth
            value={state.state || ''}
            inputProps={{
                readOnly: view
            }}
            onChange={e => handleSetField(name, e.target.value)}
            select
            disabled={disabled}
        >
            {Object.keys(artefactStates).map(value => {
                return (
                    <MenuItem value={artefactStates[value]} key={value}>
                        {value}
                    </MenuItem>
                )
            })}
        </TextField>
    )
}
