import React, { useState } from 'react'
import Layout from '../components/Layout'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, Grid } from '@material-ui/core'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import ArtefactCard from '../components/ArtefactCard'
import { config } from '../constants'

const useStyles = makeStyles(theme => ({
    textField: {
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        marginTop: theme.spacing(1)
    },
    container: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
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

    const classes = useStyles()
    const numArtefactsFetched = 10
    const [artefactEdges, SetArtefactEdges] = useState([])

    let { data, loading } = useQuery(LIST_OF_ARTEFACTS, {
        variables: {
            first: numArtefactsFetched
        },
        onCompleted: data =>
            SetArtefactEdges(data.me.artefactAdministratorOf.edges)
    })

    console.log('The data is: ', data)

    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <Layout>
            <CssBaseline />
            <Grid container spacing={2} className={classes.container}>
                <Grid item xs={12}>
                    <Grid container justify='center' spacing={2}>
                        {artefactEdges.map(edge => (
                            <Grid item key={edge.node.id}>
                                <ArtefactCard
                                    mediaURI={config.mediaRoot + edge.node.upload}
                                    name={edge.node.name}
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
