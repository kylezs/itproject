import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        justifyContent: 'center'
    },
    formControl: {
        height: '100%',
        justifyContent: 'center'
    },
    title: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        padding: theme.spacing(1),
        textAlign: 'center'
    },
    paper: {
        padding: theme.spacing(1),
        // textAlign: 'center',
        backgroundColor: theme.palette.background.paper
    },
    paperTextWrapper: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        alignItems: 'center'
    },
    button: {
        height: '100%'
    },
    map: {
        height: '200px',
        type: theme.palette.type
    },
    form: {
        marginBottom: theme.spacing(10),
        marginTop: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
    },
    iconButton: {
        padding: 10
    },
    dropzone: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '80px'
    }
}))
