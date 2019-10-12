import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import authContext from '../authContext';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography, CssBaseline } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import gql from "graphql-tag";
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import ArtefactCard from '../components/ArtefactCard';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
    },
    gridList: {
        width: '80%',
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
        }`

const SELECT_FAMILY_MUTATION = gql`
mutation SelectFamilyMutation($profileId: Int!, $toFamily: String!) {
    updateProfile(input: {
        id: $profileId,
        selectedFamily: $toFamily
    }) {
        id
        selectedFamily
    }
}`

function UserHomeView(props) {
    const classes = useStyles()

    const context = useContext(authContext)
    const username = context.user.username

    const _homepageInfoCompleted = (data) => {
        const selectedFamily = data.me.profile.selectedFamily
        if (!selectedFamily) {
            console.error("User has not selected a family");
            return;
        }
    }

    let { data: home_data, loading, called: home_page_info_called } = useQuery(HOMEPAGE_INFO, {
        onCompleted: (data) => {
            _homepageInfoCompleted(data)
        }
    })


    const [selectFamily, { data: mutation_data }] = useMutation(SELECT_FAMILY_MUTATION,
        {
            refetchQueries: (data) => [
                { query: HOMEPAGE_INFO },
            ],
        });

    const inputLabel = React.useRef(null);

    const handleChange = event => {
        event.preventDefault()
        const newFamily = event.target.value;
        selectFamily({ variables: { profileId: profileId, toFamily: newFamily } })
    };

    if (loading) {
        return <p>Loading...</p>
    }

    const selectedFamily = home_data.me.profile.selectedFamily
    const families = home_data.me.isMemberOf;
    const profileId = home_data.me.profile.id;
    const artefacts = home_data.me.profile.selectedFamily.hasArtefacts.edges;

    console.log("Artefacts")
    console.log(artefacts)


    return (
        <Layout>
            <CssBaseline />
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    {selectedFamily && (
                        <Typography variant="h1">{selectedFamily.familyName}</Typography>
                    )}
                    {!selectedFamily && (
                        <Typography variant="h2">Join and/or Select a Family</Typography>
                    )}
                    <h4>Your username is (temp, for testing): {username}</h4>
                    <GridList cellHeight={"auto"} className={classes.gridList} cols={2}>
                        {artefacts.map((artefact, key) => (
                            <GridListTile>
                                <ArtefactCard
                                    key={key}
                                    mediaURI={artefact.node.upload}
                                    title={artefact.node.name}
                                    description={artefact.node.description}
                                    id={artefact.node.id} />
                            </GridListTile>
                        ))}
                    </GridList>
                </Grid>
                <Grid item xs={3}>
                    <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                        Select Family
                    </InputLabel>
                    <Select
                        variant='outlined'
                        fullWidth
                        value={selectedFamily ? selectedFamily.id : null}
                        onChange={handleChange}
                        inputProps={{
                            name: 'age',
                            id: 'outlined-age-simple',
                            styles: { padding: '4px' }
                        }}
                        padding="5px"
                    >
                        {families && (families.map((item, key) =>
                            <MenuItem
                                key={item.id}
                                value={item.id}
                            >
                                {item.familyName}
                            </MenuItem>
                        )
                        )}
                    </Select>
                </Grid>
            </Grid>
        </Layout>
    )
}

export default UserHomeView
