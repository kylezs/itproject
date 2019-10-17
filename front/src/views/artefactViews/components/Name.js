import React from 'react'
import { TextField } from '@material-ui/core'

export default ({ mode, states, setters, disabled, name }) => {
    var { view } = mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <TextField
            // style={{ height: '100%' }}
            // InputProps={{ style: {height: '100%'} }}
            id='artefact-name'
            label='Artefact name'
            variant='outlined'
            autoFocus={!view}
            required
            fullWidth
            value={state.name || ''}
            inputProps={{ readOnly: view }}
            onChange={e => handleSetField(name, e.target.value)}
            disabled={disabled}
        />
    )
}
