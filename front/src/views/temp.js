import React, { useContext, useState, Fragment } from 'react'
import Layout from '../components/Layout'
import authContext from '../authContext'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import {
    Typography,
    CssBaseline,
    Button,
    TextField,
    Grid,
    FormControl
} from '@material-ui/core'
import Select from '@material-ui/core/Select'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { ArtefactCard, Loading } from '../components'
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
        padding: theme.spacing(3)
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
                    hasArtefacts {
                        edges {
                            node {
                                id
                                name
                                description
                                upload
                                admin
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

function UserHomeView(props) {
    const classes = useStyles()

    const context = useContext(authContext)
    const username = context.user.username
    const [formJoinCode, setFormJoinCode] = useState('')
    const [copied, setCopied] = useState(false)

    const [state, setState] = useState({})

    const [joinFamilyMutation, { data: join_mutation_data }] = useMutation(
        JOIN_FAMILY_MUTATION,
        {
            refetchQueries: data => [{ query: HOMEPAGE_INFO }]
        }
    )

    const handleJoinFamily = () => {
        if (formJoinCode.length === 0) {
            console.error('Enter a valid joinCode')
            return
        }

        joinFamilyMutation({ variables: { joinCode: formJoinCode } })
    }

    const _homepageInfoCompleted = data => {
        console.log('HERE')
        const selectedFamily = data.me.profile.selectedFamily
        if (!selectedFamily) {
            console.error('User has not selected a family')
            return
        }
        setState({
            selectedFamily: data.me.profile.selectedFamily,
            families: data.me.isMemberOf,
            profileId: data.me.profile.id,
            init: true
        })
    }

    let { data: home_data, loading, called: home_page_info_called } = useQuery(
        HOMEPAGE_INFO,
        {
            onCompleted: _homepageInfoCompleted,
        }
    )

    const [selectFamily, { data: mutation_data }] = useMutation(
        SELECT_FAMILY_MUTATION,
        {
            refetchQueries: data => [{ query: HOMEPAGE_INFO }]
        }
    )

    const inputLabel = React.useRef(null)

    const handleChange = event => {
        event.preventDefault()
        const newFamily = event.target.value
        selectFamily({
            variables: { profileId: state.profileId, toFamily: newFamily }
        })
    }
    console.log(loading)
    console.log(home_data)
    if (loading || !state.init) {
        return <Loading />
    }

    if (!home_data && home_data.me) {
        // Go to logout to remove token which is normally the cause of this error
        console.error('User data was not defined, but fetched, logging out')
        return <Redirect to='/logout' />
    }

    let artefacts = []

    // If the user has selected a family there will be a list of artefacts
    // Though the list may be empty
    if (state.selectedFamily) {
        artefacts = home_data.me.profile.selectedFamily.hasArtefacts.edges
    }

    return (
        <Layout>
            <CssBaseline />
            <Grid
                container
                spacing={0}
                justify='center'
                className={classes.outerContainer}
            >
                <Grid item xs={12} container>
                    <Grid
                        item
                        xs={9}
                        container
                        justify='flex-start'
                        alignItems='stretch'
                    >
                        {state.selectedFamily && (
                            <Fragment>
                                <Typography variant='h1'>
                                    {state.selectedFamily.familyName}
                                </Typography>
                                <Typography variant='h5'>
                                    Join code: {state.selectedFamily.joinCode}
                                </Typography>
                            </Fragment>
                        )}
                        {!state.selectedFamily && (
                            <Typography variant='h2'>
                                Join and/or Select a Family
                            </Typography>
                        )}
                        <h4>
                            Your username is (temp, for testing): {username}
                        </h4>
                    </Grid>

                    <Grid item xs={3}>
                        <InputLabel
                            ref={inputLabel}
                            htmlFor='outlined-age-simple'
                        >
                            Select Family
                        </InputLabel>
                        <Select
                            variant='outlined'
                            fullWidth
                            disabled={state.families.length <= 1}
                            value={
                                state.selectedFamily
                                    ? state.selectedFamily.id
                                    : null
                            }
                            onChange={handleChange}
                            inputProps={{
                                name: 'age',
                                id: 'outlined-age-simple'
                            }}
                        >
                            {state.families &&
                                state.families.map((item, key) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.familyName}
                                    </MenuItem>
                                ))}
                        </Select>
                        <FormControl fullWidth>
                            <TextField
                                id='joinCodeField'
                                label='Join a family'
                                value={formJoinCode}
                                className={classes.textField}
                                margin='normal'
                                onChange={e => setFormJoinCode(e.target.value)}
                                fullWidth
                            />
                            <Button
                                variant='outlined'
                                onClick={handleJoinFamily}
                            >
                                Join Family
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <GridList cellHeight={'auto'} cols={3} spacing={9}>
                        {artefacts.map((artefact, key) => (
                            <GridListTile key={key}>
                                <ArtefactCard
                                    key={key}
                                    artefact={artefact.node}
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                </Grid>
            </Grid>
        </Layout>
    )
}

export default UserHomeView
