import React from 'react'

import 'date-fns'
import { KeyboardDatePicker } from '@material-ui/pickers'

export default ({ states, setters, disabled, name }) => {
    var { view } = states.mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <KeyboardDatePicker
            disabled={view || disabled}
            clearable
            minDate={'1500-01-01'}
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
