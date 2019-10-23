import React, { useContext, useState, Fragment } from 'react'
import {
    Button,
    CssBaseline,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    Paper,
    FormControl
} from '@material-ui/core'

import { useMutation } from '@apollo/react-hooks'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { HelpDialog } from '../components'
import authContext from '../authContext'
import { artefactFamilyFormUseStyles } from '../components'
import { CREATE_FAMILY_MUTATION } from '../gqlQueriesMutations'

const HelpContent = () => (
    <Fragment>
        <DialogTitle id='help-title'>Help</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Create a family by filling out the form and clicking "create"
            </DialogContentText>
            <DialogContentText>
                On creation you will receive a join code which will allow others
                to join your new family
            </DialogContentText>
        </DialogContent>
    </Fragment>
)

function CreateFamilyView(props) {
    const classes = artefactFamilyFormUseStyles()

    const context = useContext(authContext)
    const username = context.user.username

    const [familyName, setFamilyName] = useState('')
    const [about, setAbout] = useState('')
    const [joinCode, setJoinCode] = useState('')
    const [open, setOpen] = useState(false)

    const _completed = async data => {
        const { joinCode } = data.familyCreate.family
        setJoinCode(joinCode)
        setOpen(true)
    }

    // back to const once done
    const [createFamily, { data }] = useMutation(CREATE_FAMILY_MUTATION, {
        onCompleted: _completed
    })

    // Call the mutation on form submission
    const submitForm = async event => {
        event.preventDefault()
        createFamily({
            variables: {
                familyName: familyName,
                about: about
            }
        })
    }

    const handleClose = event => {
        event.preventDefault()
        setOpen(false)
        props.history.push(`/`)
    }

    return (
        <form className={classes.form} onSubmit={submitForm}>
            <Grid container spacing={1} className={classes.outerContainer}>
                <Grid item xs={12} container justify='center'>
                    <Typography variant='h4'>Create Family</Typography>

                    <Typography variant='subtitle1'>
                        Families are how you manage your artefacts. We recognise
                        there is often complex overlap between families. That's
                        why you can create and be a part of several families, so
                        you can separate which of the artefacts you manage
                        belong to which family.
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Paper className={classes.paperWrapper} elevation={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                id='family-name'
                                label='Family name'
                                autoFocus
                                onChange={e => setFamilyName(e.target.value)}
                            />
                        </FormControl>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paperWrapper} elevation={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <TextField
                                variant='outlined'
                                multiline
                                rows={6}
                                fullWidth
                                id='about'
                                label='Tell people about your family'
                                onChange={e => setAbout(e.target.value)}
                            />
                        </FormControl>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper className={classes.paperWrapper} elevation={3}>
                        <FormControl className={classes.formControl} fullWidth>
                            <TextField
                                variant='outlined'
                                disabled
                                defaultValue={username}
                                fullWidth
                                id='family-admin'
                                label='Family Admin'
                                onChange={e =>
                                    console.error(
                                        'The admin value was changed, how is this even possible?'
                                    )
                                }
                            />
                        </FormControl>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        name='create'
                        label='Create'
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='secondary'
                    >
                        Create
                    </Button>
                </Grid>
            </Grid>

            <HelpDialog
                open={props.helpOpen}
                setOpen={props.setHelpOpen}
                content={HelpContent}
            />

            {data && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle onClose={handleClose}>
                        Begin adding members to '{familyName}'!
                    </DialogTitle>
                    <DialogContent>
                        <Typography align='left'>
                            You can now add artefacts to this family. To view
                            them simply select '{familyName}' from the Select
                            Family dropdown on your home dashboard.
                            <br />
                            Begin getting members to join your family! Simply
                            share the code below to your family members, get
                            them to sign up and then they can join!
                            <br />
                            <br />
                            {joinCode} &nbsp;
                            <CopyToClipboard text={joinCode}>
                                <Button variant='outlined'>Copy</Button>
                            </CopyToClipboard>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color='primary' autoFocus>
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </form>
    )
}

export default props => (
    <Fragment>
        <CssBaseline />
        <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justify='center'
            style={{ minHeight: '80vh' }}
        >
            <Grid item xs={11} md={6}>
                <CreateFamilyView {...props} />
            </Grid>
        </Grid>
    </Fragment>
)
