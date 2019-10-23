import React, { Fragment } from 'react'
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
            {create && (
                <DialogContent>
                    <DialogContentText>
                        Create an artefact by filling out the form and clicking
                        "save"
                    </DialogContentText>
                    <DialogContentText>
                        You can assign the artefact to any number of your
                        families
                    </DialogContentText>
                    <DialogContentText>
                        The artefact will only be viewable by members of the
                        selected families, unless the artefact is set to
                        "public"
                    </DialogContentText>
                    <DialogContentText>
                        Only you will be able to edit the artefact after
                        creation
                    </DialogContentText>
                </DialogContent>
            )}

            {edit && (
                <DialogContent>
                    <DialogContentText>
                        Edit a field by clicking on it, save and cancel buttons
                        will appear
                    </DialogContentText>
                    <DialogContentText>
                        After clicking "save" the change is final
                    </DialogContentText>
                </DialogContent>
            )}

            {view && (
                <DialogContent>
                    <DialogContentText>
                        Here you can view the details of an artefact
                    </DialogContentText>
                    <DialogContentText>
                        If you are the admin of the artefact, a button labelled
                        "edit" in the top right corner will enable editing mode
                    </DialogContentText>
                </DialogContent>
            )}
        </Fragment>
    )
}
