import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@material-ui/core'

export default ({ open, setOpen, deleteArtefact, id }) => {
    return (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby='help-title'
        >
            <DialogTitle>Delete Artefact</DialogTitle>
            <DialogContent>
                <DialogContentText>This cannot be undone</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color='secondary'>
                    Cancel
                </Button>
                <Button
                    onClick={() => deleteArtefact({ variables: { id: id } })}
                    color='primary'
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}
