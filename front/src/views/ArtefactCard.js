import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

function ArtefactCard({ mediaURI, title, description, id }) {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={mediaURI}
                    title={title}
                />
                <CardContent>
                    <Grid item xs zeroMinWidth>
                        <Typography gutterBottom variant="h5" component="h2" noWrap>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                        <Typography variant="body2" color="textSecondary" component="p" noWrap>
                            {description}
                        </Typography>
                    </Grid>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" component={RouterLink} to={`/artefacts/${id}`}>
                    View
                 </Button>
                <Button size="small" color="primary">
                    Edit
                </Button>
            </CardActions>
        </Card>
    );
}

export default ArtefactCard;