import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, Grid, Typography } from '@material-ui/core'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { ArtefactCard, Loading } from '../../components'

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3),
    }
}))

const LIST_OF_ARTEFACTS = gql`
    query artefactsQuery {
        me {
            artefactAdministratorOf {
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
    const [artefactEdges, SetArtefactEdges] = useState([])

    let { data, loading } = useQuery(LIST_OF_ARTEFACTS, {
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
                <Grid item xs={12}>
                    <Typography variant='h4' align='center'>
                        Manage Artefacts
                    </Typography>
                    <Typography variant='subtitle1' align='center'>
                        Here you can view all the artefacts you are an admin of
                    </Typography>
                </Grid>
                {artefactEdges.map(edge => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={edge.node.id}>
                        <ArtefactCard artefact={edge.node} />
                    </Grid>
                ))}
            </Grid>
        </Layout>
    )
}

export default ManageArtefactsView
