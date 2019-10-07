import React, { useContext, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Layout from '../components/Layout'
import authContext from '../authContext'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { Paper } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    textField: {
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        marginTop: theme.spacing(1)
    },
    paper: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center'
    },
    button: {
        margin: theme.spacing(1)
    }
}))

// Get the familyName and joinCode back to present to the user straight away after
// successful creation
const CREATE_FAMILY_MUTATION = gql`
    mutation FamilyCreate($familyName: String!, $about: String) {
        familyCreate(input: { familyName: $familyName, about: $about }) {
            family {
                familyName
                joinCode
            }
        }
    }
`

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
})

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose } = props
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant='h6'>{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label='close'
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    )
})

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent)

export default function CreateFamilyView(props) {
    const classes = useStyles()

    const context = useContext(authContext)
    const username = context.user.username

    const [familyName, setFamilyName] = useState('')
    const [about, setAbout] = useState('')
    const [joinCode, setJoinCode] = useState('')
    const [open, setOpen] = useState(false)

    const _completed = async data => {
        console.log(data)
        const { joinCode } = data.familyCreate.family
        setJoinCode(joinCode)
        setOpen(true)
    }

    const [createFamily, { data }] = useMutation(CREATE_FAMILY_MUTATION, {
        onCompleted: _completed
    })

    const submitForm = async event => {
        event.preventDefault()
        console.log('Family name: ' + familyName)
        console.log('About: ' + about)
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
    }

    return (
        <Layout>
            <CssBaseline />
            <form className={classes.form} onSubmit={submitForm}>
                <Grid
                    container
                    spacing={2}
                    direction='row'
                    alignItems='stretch'
                    alignContent='stretch'
                    justify='space-evenly'
                >
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant='h4'>Create Family</Typography>
                            <Typography variant='subtitle1'>
                                Families are how you manage your artefacts. We
                                recognise there is often complex overlap between
                                families. That's why you can create and be a
                                part of several families, so you can separate
                                which of the artefacts you manage belong to
                                which family.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <TextField
                                className={classes.textField}
                                variant='outlined'
                                required
                                fullWidth
                                id='family-name'
                                label='Family name'
                                autoFocus
                                onChange={e => setFamilyName(e.target.value)}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <TextField
                                className={classes.textField}
                                variant='outlined'
                                multiline
                                rows={6}
                                fullWidth
                                id='about'
                                label='Tell people about your family'
                                onChange={e => setAbout(e.target.value)}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <TextField
                                className={classes.textField}
                                variant='outlined'
                                disabled
                                defaultValue={username}
                                fullWidth
                                id='family-admin'
                                label='Family Admin'
                                onChange={e => console.log('hello')}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <Button
                            name='create'
                            label='Create'
                            type='submit'
                            fullWidth
                            variant='contained'
                            color='primary'
                        >
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {data && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle onClose={handleClose}>
                        Begin adding members to '{familyName}'!
                    </DialogTitle>
                    <DialogContent>
                        <Typography align='center'>
                            Begin getting members to join your family! Simply
                            share the code below to your family members, get
                            them to sign up and then they can join!
                            <br />
                            {joinCode}
                        </Typography>
                    </DialogContent>
                </Dialog>
            )}
        </Layout>
    )
}
