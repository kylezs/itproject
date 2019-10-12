import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Link as RouterLink } from 'react-router-dom'

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
        maxWidth: 345
    },
    media: {
        backgroundColor: theme.palette.background.paper,
        height: 140
    }
}))

function ArtefactCard({ mediaURI, title, description, id }) {
    const classes = useStyles()

    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={mediaURI || undefined}
                    title={title}
                />
                <CardContent>
                    <Grid item xs zeroMinWidth>
                        <Typography
                            gutterBottom
                            variant='h5'
                            component='h2'
                            noWrap
                        >
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                        <Typography
                            variant='body2'
                            color='textSecondary'
                            component='p'
                            noWrap
                        >
                            {description}
                        </Typography>
                    </Grid>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button
                    size='small'
                    color='primary'
                    component={RouterLink}
                    to={`/artefacts/${id}`}
                >
                    View
                </Button>
                <Button
                    size='small'
                    color='primary'
                    component={RouterLink}
                    to={`/artefacts/edit/${id}`}
                >
                    Edit
                </Button>
            </CardActions>
        </Card>
    )
}

export default ArtefactCard
