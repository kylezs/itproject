import React from 'react'
import { TextField } from '@material-ui/core'

export default ({ states, setters, disabled, name, numFams }) => {
    var { view } = states.mode
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
            rows={numFams * 2 > 5 ? numFams * 2 : 8}
            value={state.description || ''}
            inputProps={{
                readOnly: view
            }}
            onChange={e => handleSetField(name, e.target.value)}
            disabled={disabled}
        />
    )
}
