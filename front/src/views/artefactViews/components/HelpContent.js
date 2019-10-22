import React, {Fragment} from 'react'
import {
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core'

export default ({ mode }) => {
    const { edit, create, view } = mode
    return (
        <Fragment>
            <DialogTitle id='help-title'>Help</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select from your families in the corner to view their
                    artefacts
                </DialogContentText>
                <DialogContentText>
                    Enter a family's join code in the box underneath to join
                    someone's family
                </DialogContentText>
                <DialogContentText>
                    The join code can be copied by clicking the button
                    underneath the family name
                </DialogContentText>
            </DialogContent>
        </Fragment>
    )
}
