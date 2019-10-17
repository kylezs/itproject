import React from 'react'
import {
    List,
    ListSubheader,
    ListItem,
    Checkbox,
    ListItemIcon,
    ListItemText
} from '@material-ui/core'

export default ({ mode, states, setters, families, disabled, name }) => {
    var { create, edit, view } = mode
    var { state } = states
    var { handleSetField } = setters
    return (
        <List
            subheader={
                <ListSubheader component='div'>
                    {!view
                        ? 'Select which of your families the artefact belongs to'
                        : 'Belongs to'}
                </ListSubheader>
            }
        >
            {families.map(family => {
                if (!state.belongsToFamiliesBools) {
                    return
                }

                if (!view || state.belongsToFamiliesBools[family.id]) {
                    return (
                        <ListItem key={family.id} dense disabled={disabled}>
                            {!view && (
                                <ListItemIcon>
                                    <Checkbox
                                        edge='start'
                                        checked={
                                            state.belongsToFamiliesBools[
                                                family.id
                                            ] || false
                                        }
                                        onClick={e =>
                                            handleSetField(name, {
                                                ...state.belongsToFamiliesBools,
                                                [family.id]: e.target.checked
                                            })
                                        }
                                        tabIndex={-1}
                                    />
                                </ListItemIcon>
                            )}
                            <ListItemText primary={family.familyName} />
                        </ListItem>
                    )
                }
            })}
        </List>
    )
}
