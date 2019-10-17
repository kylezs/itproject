import React from 'react'
import { TextField } from '@material-ui/core'

export default ({ mode, states, setters, disabled, name }) => {
    var { view } = mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <TextField
            id='description'
            label='Description'
            variant='outlined'
            required
            fullWidth
            multiline
            rows={6}
            value={state.description || ''}
            inputProps={{
                readOnly: view
            }}
            onChange={e => handleSetField(name, e.target.value)}
            disabled={disabled}
        />
    )
}
