import React, { useContext, useState } from 'react'
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
import ArtefactCard from '../components/ArtefactCard'

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
        const selectedFamily = data.me.profile.selectedFamily
        if (!selectedFamily) {
            console.error('User has not selected a family')
            return
        }
    }

    let { data: home_data, loading, called: home_page_info_called } = useQuery(
        HOMEPAGE_INFO,
        {
            onCompleted: data => {
                _homepageInfoCompleted(data)
            },
            fetchPolicy: 'network-only'
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
            variables: { profileId: profileId, toFamily: newFamily }
        })
    }

    if (loading) {
        return <p>Loading...</p>
    }

<<<<<<< HEAD
    let selectedFamily;
    let families;
    let profileId;
    if (home_data) {
        selectedFamily = home_data.me.profile.selectedFamily;
        families = home_data.me.isMemberOf;
        profileId = home_data.me.profile.id;
    } else {
        // Go to logout to remove token which is normally the cause of this error
        console.error("User data was not defined, but fetched, logging out");
        return <Redirect to='/logout' />
        
    }

=======
    const selectedFamily = home_data.me.profile.selectedFamily
    const families = home_data.me.isMemberOf
    const profileId = home_data.me.profile.id
>>>>>>> dev
    let artefacts = []

    // If the user has selected a family there will be a list of artefacts
    // Though the list may be empty
    if (selectedFamily) {
        artefacts = home_data.me.profile.selectedFamily.hasArtefacts.edges
    }

    return (
        <Layout>
            <CssBaseline />
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    {selectedFamily && (
                        <div>
                            <Typography variant='h1'>
                                {selectedFamily.familyName}
                            </Typography>
                            <Typography variant='h5'>
                                Join code: {selectedFamily.joinCode}
                            </Typography>
                        </div>
                    )}
                    {!selectedFamily && (
                        <Typography variant='h2'>
                            Join and/or Select a Family
                        </Typography>
                    )}
                    <h4>Your username is (temp, for testing): {username}</h4>
                    <GridList cellHeight={'auto'} cols={2}>
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
                <Grid item xs={3}>
                    <InputLabel ref={inputLabel} htmlFor='outlined-age-simple'>
                        Select Family
                    </InputLabel>
                    <Select
                        variant='outlined'
                        fullWidth
                        disabled={families.length <= 1}
                        value={selectedFamily ? selectedFamily.id : null}
                        onChange={handleChange}
                        inputProps={{
                            name: 'age',
                            id: 'outlined-age-simple'
                        }}
                    >
                        {families &&
                            families.map((item, key) => (
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
                        <Button variant='outlined' onClick={handleJoinFamily}>
                            Join Family
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
        </Layout>
    )
}

export default UserHomeView
