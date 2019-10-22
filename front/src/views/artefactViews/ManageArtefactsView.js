import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, Grid } from '@material-ui/core'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { ArtefactCard, Loading } from '../../components'

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
        padding: theme.spacing(1)
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
                        admin {
                            username
                        }
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
            SetArtefactEdges(data.me.artefactAdministratorOf.edges),
        onError: errors => console.log(errors),
        fetchPolicy: 'network-only'
    })

    console.log('The data is: ', data)

    if (loading) {
        return <Loading />
    }
    return (
        <Layout>
            <CssBaseline />
            <Grid
                container
                spacing={2}
                justify='center'
                className={classes.container}
            >
                {artefactEdges.map(edge => (
                    <Grid item key={edge.node.id}>
                        <ArtefactCard artefact={edge.node} />
                    </Grid>
                ))}
            </Grid>
        </Layout>
    )
}

export default ManageArtefactsView
