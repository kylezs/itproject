import React from 'react'
import {
    Button,
    Snackbar,
    IconButton,
    ClickAwayListener
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

export default ({ open, setOpen, viewArtefact, classes, id }) => {
    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                ContentProps={{
                    'aria-describedby': 'message-id'
                }}
                message={<span id='message-id'>Edit successful</span>}
                action={[
                    <Button
                        key='view'
                        color='secondary'
                        size='small'
                        onClick={e => viewArtefact(id)}
                    >
                        VIEW
                    </Button>,
                    <IconButton
                        key='close'
                        aria-label='close'
                        color='inherit'
                        onClick={() => setOpen(false)}
                        className={classes.close}
                    >
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        </ClickAwayListener>
    )
}
