import React from 'react'
import { Button, Dialog, DialogActions } from '@material-ui/core'

export default ({ open, setOpen, content: MyDialogContent, ...rest }) => (
    <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='help-title'
    >
        <MyDialogContent {...rest} />
        <DialogActions>
            <Button onClick={() => setOpen(false)} color='primary'>
                Close
            </Button>
        </DialogActions>
    </Dialog>
)
