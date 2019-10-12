import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        margin: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        alignItems: 'center',
        alignContent: 'stretch',
        justify: 'center'
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}))