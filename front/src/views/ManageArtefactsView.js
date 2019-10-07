import React from 'react'
import Layout from '../components/Layout'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { CssBaseline } from '@material-ui/core'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import ArtefactCard from './ArtefactCard'

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

const LIST_OF_ARTEFACTS = gql`
    query artefactsQuery($first: Int!) {
        me {
            artefactAdministratorOf(first: $first) {
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
    const tempImgURI =
        'https://assets.pernod-ricard.com/nz/media_images/test.jpg?hUV74FvXQrWUBk1P2.fBvzoBUmjZ1wct'

    const classes = useStyles()
    const numArtefactsFetched = 10

    let { data, loading } = useQuery(LIST_OF_ARTEFACTS, {
        variables: {
            first: numArtefactsFetched
        }
    })

    console.log('The data is: ', data)

    if (loading) {
        return <p>Loading...</p>
    }
    const artefact_edges = data.me.artefactAdministratorOf.edges
    return (
        <Layout>
            <CssBaseline />
            <Grid container spacing={2} className={classes.root}>
                <Grid item xs={12}>
                    <Grid container justify='center' spacing={2}>
                        {artefact_edges.map(edge => (
                            <Grid item key={edge.node.id}>
                                <ArtefactCard
                                    mediaURI={tempImgURI}
                                    title={edge.node.name}
                                    description={edge.node.description}
                                    id={edge.node.id}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    )
}

export default ManageArtefactsView
