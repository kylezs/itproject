import React from 'react'
import {
    List,
    ListSubheader,
    ListItem,
    Checkbox,
    ListItemIcon,
    ListItemText
} from '@material-ui/core'

export default ({ mode, states, setters, disabled, name }) => {
    var { view } = mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <List
            subheader={<ListSubheader component='div'>Privacy</ListSubheader>}
            dense
        >
            <ListItem disabled={disabled}>
                {!view && (
                    <ListItemIcon>
                        <Checkbox
                            edge='start'
                            checked={state.isPublic || false}
                            tabIndex={-1}
                            onClick={e =>
                                handleSetField(name, e.target.checked)
                            }
                        />
                    </ListItemIcon>
                )}
                <ListItemText primary={'Public'} />
            </ListItem>
        </List>
    )
}
