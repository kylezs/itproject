import React from 'react'
import { TextField } from '@material-ui/core'

export default ({ mode, states, username }) => {
    var { view } = mode
    var { state } = states
    return (
        <TextField
            id='artefact-admin'
            label='Artefact Admin'
            variant='outlined'
            required
            fullWidth
            value={
                state.admin && Object.keys(state.admin).length !== 0
                    ? state.admin.username
                    : username
            }
            inputProps={{
                readOnly: view
            }}
            onChange={e => console.log('admin field was changed')}
            disabled
        />
    )
}
