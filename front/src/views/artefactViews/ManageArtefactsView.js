/**
 * @summary Renders the artefacts a user is admin of in a grid of artefact cards
 * @author Zane Duffield, Kyle Zsembery
 *
 * Last modified  : 2019-10-26 18:15:36
 */

import React, { useState, Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, Grid, Typography, Container } from '@material-ui/core'
import {
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Link
} from '@material-ui/core'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { ArtefactCard, Loading, HelpDialog } from '../../components'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3)
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

const HelpContent = () => (
    <Fragment>
        <DialogTitle id='help-title'>Help</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Here you can view all of the artefacts which you are an admin
                of.
            </DialogContentText>
            <DialogContentText>
                Click view to see more about the artefact or to edit it.
            </DialogContentText>
        </DialogContent>
    </Fragment>
)

export default function ManageArtefactsView(props) {
    const classes = useStyles()
    const [state, setState] = useState({ loading: true })

    useQuery(LIST_OF_ARTEFACTS, {
        variables: {},
        onCompleted: data =>
            setState({
                artefactEdges: data.me.artefactAdministratorOf.edges,
                loading: false
            }),
        onError: errors => console.log(errors),
        fetchPolicy: 'cache-and-network'
    })

    return (
        <Container>
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
                {state.loading ? (
                    <Loading />
                ) : state.artefactEdges.length !== 0 ? (
                    state.artefactEdges.map(edge => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={edge.node.id}
                        >
                            <ArtefactCard artefact={edge.node} />
                        </Grid>
                    ))
                ) : (
                    <Paper
                        className={classes.paper}
                        style={{
                            marginTop: 15,
                            padding: '6px'
                        }}
                    >
                        You are not managing any artefacts, click
                        <Link
                            component={RouterLink}
                            to='/artefacts/create'
                            color='secondary'
                        >
                            {' here '}
                        </Link>
                        to create one.
                    </Paper>
                )}
            </Grid>

            <HelpDialog
                open={props.helpOpen}
                setOpen={props.setHelpOpen}
                content={HelpContent}
            />
        </Container>
    )
}
