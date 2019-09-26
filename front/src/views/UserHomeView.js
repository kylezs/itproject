import React, { useContext } from 'react';
import Layout from '../components/Layout';
import authContext from '../authContext';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';


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

const LIST_OF_FAMILIES = gql`
        query {
            me {
                isMemberOf {
                    id
                    familyName
                    joinCode
                }
            }
        }`



function UserHomeView(props) {

    const classes = useStyles();

    const context = useContext(authContext);
    const username = context.user.username;

    let { data, loading } = useQuery(LIST_OF_FAMILIES)
    console.log("The data is: ", data);

    if (loading) {
        return <p>Loading...</p>
    }
    const families = data.me.isMemberOf;
    return (
        <Layout>
            <h1>Family: {families[0].familyName}</h1>
            <h3>Join code: {families[0].joinCode}</h3>
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
        </Layout>
    );
}

export default UserHomeView
