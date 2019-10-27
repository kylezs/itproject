/**
 * Must be provided a component "content" via props which renders the
 * specific help DialogContent for the page it appears on
 *
 * @summary Provides a generic template for the help dialog on each page
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 18:00:41
 */

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
