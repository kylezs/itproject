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
import { Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import gql from "graphql-tag";
import { useMutation, useQuery } from '@apollo/react-hooks';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '80%',
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

const tileData = [
    {
        img: "https://assets.pernod-ricard.com/nz/media_images/test.jpg?hUV74FvXQrWUBk1P2.fBvzoBUmjZ1wct",
        title: 'Title1',
        author: 'Author 1',
    },
]

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

    const classes = useStyles();

    const context = useContext(authContext);
    const username = context.user.username;

    let { data, loading } = useQuery(HOMEPAGE_INFO)

    const [selectFamily] = useMutation(SELECT_FAMILY_MUTATION,
        {
            refetchQueries: () => [
                { query: HOMEPAGE_INFO }
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
    
    const selectedFamily = data.me.profile.selectedFamily
    const families = data.me.isMemberOf;
    const profileId = data.me.profile.id;

    return (
        <Layout>
        <Grid container spacing={3}>
            <Grid item xs={9}>
                {selectedFamily && (
                    <Typography variant="h1">{selectedFamily.familyName}</Typography>
                )}
                {!selectedFamily && (
                    <Typography variant="h2">Join and/or Select a Family</Typography>
                )}
                <h4>Your username is: {username}</h4>
                <h4>Your families:</h4>
                {data.me.isMemberOf.map(family => (
                    <p key={family.id} id={family.id}>{family.familyName}</p>
                ))}
                <div className={classes.root}>
                    <GridList cellHeight={180} className={classes.gridList}>
                        {tileData.map(tile => (
                            <GridListTile key={tile.img}>
                                <img src={tile.img} alt={tile.title} />
                                <GridListTileBar
                                    title={tile.title}
                                    subtitle={<span>by: {tile.author}</span>}
                                    actionIcon={
                                        <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                            <InfoIcon />
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                    </div>
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
                            styles: {padding: '4px'}
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
    );
}

export default UserHomeView
