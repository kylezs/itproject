import React, { useState, Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, Grid, Typography } from '@material-ui/core'
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
                Select from your families in the corner to view their artefacts
            </DialogContentText>
            <DialogContentText>
                Enter a family's join code in the box underneath to join
                someone's family
            </DialogContentText>
            <DialogContentText>
                The join code can be copied by clicking the button underneath
                the family name
            </DialogContentText>
        </DialogContent>
    </Fragment>
)

export default function ManageArtefactsView(props) {
    const classes = useStyles()
    const [artefactEdges, SetArtefactEdges] = useState([])

    let { data, loading } = useQuery(LIST_OF_ARTEFACTS, {
        onCompleted: data =>
            SetArtefactEdges(data.me.artefactAdministratorOf.edges),
        onError: errors => console.log(errors),
    })

    return (
        <Fragment>
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
                {loading ? (
                    <Loading />
                ) : (
                    artefactEdges.map(edge => (
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
                )}
                {artefactEdges.length === 0 && (
                    <Paper
                        className={classes.paper}
                        style={{ 
                            marginTop: 15,
                            padding: "6px",
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
        </Fragment>
    )
}
