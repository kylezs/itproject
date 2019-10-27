/**
 * Requires as input an artefact as provided by GQL backend.
 *
 * @summary Provides a material card-like summary of an artefact
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 17:47:35
 */

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Link as RouterLink } from 'react-router-dom'

import { config } from '../constants'

var Trianglify = require('trianglify')

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
    },
    card: {
        backgroundColor: theme.palette.background.paper,
        // maxWidth: 345,
        borderRadius: 10
        // height: '100%'
    },
    media: {
        backgroundColor: theme.palette.background.paper,
        height: 170
    }
}))

/*
This component is to present a summary of the artefact to a user, it's used in the homepage
and manage page as a quick way to assist navigating through artefacts
*/
function ArtefactCard({ artefact }) {
    const classes = useStyles()
    const theme = useTheme()

    const { upload, name, description, id, admin } = artefact
    const [patternURI, setPatternURI] = useState('')

    var mediaURI = config.mediaRoot + upload
    if (upload === 'False' && !patternURI) {
        // use primary and seconary colours of theme as a seed for the random colour generation
        var pattern = Trianglify({
            width: 500,
            height: 500,
            x_colors: [
                theme.palette.primary.dark,
                theme.palette.secondary.light
            ],
            y_colors: 'random'
        })
        setPatternURI(pattern.png())
    }

    return (
        <Card className={classes.card} elevation={3}>
            <CardMedia
                className={classes.media}
                image={patternURI ? patternURI : mediaURI}
                title={name}
            />
            <CardContent>
                <Grid container>
                    <Grid item xs={9}>
                        <Typography
                            gutterBottom
                            variant='h5'
                            component='h2'
                            noWrap
                        >
                            {name}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography
                            gutterBottom
                            variant='overline'
                            component='h2'
                            noWrap
                            align='right'
                        >
                            {admin.username}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant='body2'
                            color='textSecondary'
                            component='p'
                            noWrap
                        >
                            {description}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button
                    size='small'
                    fullWidth
                    color='primary'
                    component={RouterLink}
                    to={`/artefacts/${id}`}
                >
                    View
                </Button>
                {/* <Button
                    size='small'
                    color='secondary'
                    component={RouterLink}
                    to={`/artefacts/edit/${id}`}
                >
                    Edit
                </Button> */}
            </CardActions>
        </Card>
    )
}

export default ArtefactCard
