import React from 'react'

import 'date-fns'
import { KeyboardDatePicker } from '@material-ui/pickers'

export default ({ mode, states, setters, disabled, name }) => {
    var { view } = mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <KeyboardDatePicker
            disabled={view || disabled}
            clearable
            // variant='inline'
            inputVariant='outlined'
            format='dd/MM/yyyy'
            openTo='year'
            label='Date'
            value={state.date}
            onChange={date => handleSetField(name, date)}
            KeyboardButtonProps={{
                'aria-label': 'change date'
            }}
        />
    )
}
