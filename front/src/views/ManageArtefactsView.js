import React, { useContext } from 'react';
import Layout from '../components/Layout';
import authContext from '../authContext';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';
import ArtefactCard from './ArtefactCard';


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


const LIST_OF_ARTEFACTS = gql`
query artefactsQuery($first: Int!){
  me {
    artefactAdministratorOf(first: $first){
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
`

function ManageArtefactsView(props) {

    const tempImgURI = "https://assets.pernod-ricard.com/nz/media_images/test.jpg?hUV74FvXQrWUBk1P2.fBvzoBUmjZ1wct"


    const classes = useStyles();

    const context = useContext(authContext);
    const username = context.user.username;
    const numArtefactsFetched = 10

    let { data, loading } = useQuery(
        LIST_OF_ARTEFACTS,
        {
            variables: {
                first: numArtefactsFetched
            }
        }
    )

    console.log("The data is: ", data);

    if (loading) {
        return <p>Loading...</p>
    }
    const artefact_edges = data.me.artefactAdministratorOf.edges
    return (
        <Layout>
            <Grid container spacing={2} className={classes.root}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>
                        {artefact_edges.map(edge => (
                            <Grid item key={edge.node.id}>
                                <ArtefactCard mediaURI={tempImgURI} title={edge.node.name} description={edge.node.description} id={edge.node.id} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default ManageArtefactsView
