import React, { useState, Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import {
    Typography,
    Button,
    TextField,
    Grid,
    Paper,
    Link,
    MenuItem,
    Snackbar,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CssBaseline
} from '@material-ui/core'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { ArtefactCard, Loading, HelpDialog } from '../components'
import { Redirect } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)'
    },
    outerContainer: {
        padding: theme.spacing(2)
    },
    card: {
        alignContent: 'stretch'
    },
    paper: {
        padding: theme.spacing(1),
        borderRadius: 10
    }
}))

const HOMEPAGE_INFO = gql`
    query {
        me {
            isMemberOf {
                id
                familyName
                joinCode
                hasArtefacts {
                    edges {
                        node {
                            id
                            name
                            admin {
                                username
                            }
                        }
                    }
                }
            }
            profile {
                id
                selectedFamily {
                    id
                    familyName
                    joinCode
                    about
                    hasArtefacts {
                        edges {
                            node {
                                id
                                name
                                description
                                upload
                                admin {
                                    username
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`

const JOIN_FAMILY_MUTATION = gql`
    mutation JoinFamily($joinCode: String!) {
        familyJoin(joinCode: $joinCode) {
            family {
                familyName
                familyAdmin {
                    username
                }
            }
        }
    }
`

const SELECT_FAMILY_MUTATION = gql`
    mutation SelectFamilyMutation($profileId: Int!, $toFamily: String!) {
        updateProfile(input: { id: $profileId, selectedFamily: $toFamily }) {
            id
            selectedFamily
        }
    }
`

const HelpContent = () => (
    <Fragment>
        <DialogTitle id='help-title'>Help</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Select from your families in the corner to view their artefacts.
            </DialogContentText>
            <DialogContentText>
                Enter a family's join code in the box underneath to join a
                family.
            </DialogContentText>
            <DialogContentText>
                The join code can be copied by clicking the button underneath
                the family name.
            </DialogContentText>
        </DialogContent>
    </Fragment>
)

export default function UserHomeView(props) {
    const classes = useStyles()
    const [formJoinCode, setFormJoinCode] = useState('')
    const [copied, setCopied] = useState(false)
    const [joinError, setJoinError] = useState('')

    // After a new family has been joined, refetch the home info to update it, so the user
    // Can now see that family in the bar
    const [joinFamilyMutation] = useMutation(JOIN_FAMILY_MUTATION, {
        refetchQueries: data => [{ query: HOMEPAGE_INFO }],
        onError: errors => setJoinError('Enter a valid join code'),
        onCompleted: data => setJoinError('')
    })

    const handleJoinFamily = () => {
        if (formJoinCode.length === 0) {
            console.error('Enter a valid joinCode')
        } else if (
            home_data &&
            home_data.me.isMemberOf
                .map(fam => fam.joinCode)
                .includes(formJoinCode)
        ) {
            setJoinError('You are already a member of this family')
        } else {
            joinFamilyMutation({ variables: { joinCode: formJoinCode } })
        }
    }

    let { data: home_data, loading: home_data_loading } = useQuery(
        HOMEPAGE_INFO,
        {
            fetchPolicy: 'cache-and-network'
        }
    )

    const [
        selectFamily,
    ] = useMutation(SELECT_FAMILY_MUTATION, {
        refetchQueries: data => [{ query: HOMEPAGE_INFO }]
    })

    const handleChange = event => {
        event.preventDefault()
        const newFamily = event.target.value
        selectFamily({
            variables: { profileId: profileId, toFamily: newFamily }
        })
    }

    if (home_data_loading) {
        console.log('home data is loading on refetch')
        return <Loading />
    }

    let selectedFamily
    let families
    let profileId
    if (home_data) {
        selectedFamily = home_data.me.profile.selectedFamily
        families = home_data.me.isMemberOf
        profileId = home_data.me.profile.id
    } else {
        // Go to logout to remove token which is normally the cause of this error
        console.error('User data was not defined, but fetched, logging out')
        return <Redirect to='/logout' />
    }

    let artefacts = []

    // If the user has selected a family there will be a list of artefacts
    // Though the list may be empty
    if (selectedFamily) {
        artefacts = home_data.me.profile.selectedFamily.hasArtefacts.edges
    }

    return (
        <Fragment>
            <CssBaseline />
            <Grid container justify='center'>
                <Grid
                    item
                    xs={12}
                    lg={10}
                    container
                    spacing={3}
                    justify='space-between'
                    className={classes.outerContainer}
                >
                    <Grid
                        item
                        xs={12}
                        sm={7}
                        container
                        justify='center'
                        alignItems='stretch'
                        spacing={1}
                        className={classes.paper}
                    >
                        {selectedFamily && (
                            <Fragment>
                                <Grid item xs={12}>
                                    <Typography variant='h1'>
                                        {selectedFamily.familyName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='subtitle1'>
                                        {selectedFamily.about}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <CopyToClipboard
                                        text={selectedFamily.joinCode}
                                        onCopy={() => setCopied(true)}
                                    >
                                        <Button variant='outlined'>
                                            Copy family join code
                                        </Button>
                                    </CopyToClipboard>
                                </Grid>
                            </Fragment>
                        )}

                        {!selectedFamily && (
                            <Typography variant='h2'>
                                Join or Create a Family
                            </Typography>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={5}
                        md={3}
                        container
                        spacing={1}
                        justify='center'
                        alignContent='flex-start'
                    >
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Select Family'
                                variant='outlined'
                                value={
                                    selectedFamily ? selectedFamily.id : null
                                }
                                select
                                onChange={handleChange}
                                SelectProps={{
                                    name: 'age',
                                    autoWidth: true
                                }}
                                disabled={families.length <= 1}
                            >
                                {families &&
                                    families.map((item, key) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.familyName}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id='joinCodeField'
                                variant='outlined'
                                label='Enter join code'
                                value={formJoinCode}
                                className={classes.textField}
                                onChange={e => {
                                    setJoinError('')
                                    setFormJoinCode(e.target.value)
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            onClick={handleJoinFamily}
                                            className={classes.button}
                                            size='small'
                                        >
                                            Join
                                        </Button>
                                    ),
                                    style: {}
                                }}
                                helperText={joinError}
                                error={!!joinError}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justify='flex-start'
                        alignItems='stretch'
                        spacing={1}
                        item
                        xs={12}
                    >
                        {artefacts.map((artefact, key) => (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                                <ArtefactCard
                                    artefact={artefact.node}
                                    className={classes.card}
                                />
                            </Grid>
                        ))}
                        {artefacts.length === 0 && selectedFamily && (
                            <Paper
                                className={classes.paper}
                                style={{
                                    marginTop: 15,
                                    padding: '6px'
                                }}
                            >
                                This family has no artefacts, click
                                <Link
                                    component={RouterLink}
                                    to='/artefacts/create'
                                    color='secondary'
                                >
                                    {' here '}
                                </Link>
                                to create one. Make sure to asign them to this
                                family
                            </Paper>
                        )}
                        {artefacts.length === 0 && !selectedFamily && (
                            <Paper
                                className={classes.paper}
                                style={{
                                    marginTop: 15,
                                    padding: '6px'
                                }}
                            >
                                You are not yet a member of a family. Click
                                <Link
                                    component={RouterLink}
                                    to='/family/create'
                                    color='secondary'
                                >
                                    {' here '}
                                </Link>
                                to create one. Or join using a join code on the
                                right.
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Grid>
            {selectedFamily && (
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={copied}
                    autoHideDuration={2000}
                    onClose={() => setCopied(false)}
                    message={
                        <span id='message-id'>
                            Join code copied to clipboard
                            <br />
                            {selectedFamily.joinCode}
                        </span>
                    }
                />
            )}

            <HelpDialog
                open={props.helpOpen}
                setOpen={props.setHelpOpen}
                content={HelpContent}
            />
        </Fragment>
    )
}
