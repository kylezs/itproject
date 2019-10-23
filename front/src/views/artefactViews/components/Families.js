import React, { Fragment } from 'react'
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Typography
} from '@material-ui/core'

/*
Handles the families list as part of an artefact view
Will only show the artefact as part of the families that you are a part of.
i.e. Will maintain other family's privacy.
 */
export default ({ states, setters, families, disabled, name, classes }) => {
    var { view } = states.mode
    var { state } = states
    var { handleSetField } = setters

    if (
        view &&
        state.belongsToFamiliesBools &&
        Object.values(state.belongsToFamiliesBools).filter(value => value)
            .length === 0
    ) {
        return (
            <Typography variant='h6' className={classes.fieldTitle}>
                This artefact doesn't belong to any of your families
            </Typography>
        )
    }

    return (
        <Fragment>
            <Typography variant='h6' className={classes.fieldTitle}>
                {!view
                    ? 'Families the artefact belongs to'
                    : 'Belongs to your families'}
            </Typography>
            <List disablePadding>
                {families.map(family => {
                    if (
                        state.belongsToFamiliesBools &&
                        (!view || state.belongsToFamiliesBools[family.id])
                    ) {
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
                                                    [family.id]:
                                                        e.target.checked
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
                    return null
                })}
            </List>
        </Fragment>
    )
}
