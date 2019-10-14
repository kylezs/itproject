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
        justifyContent: 'center',
        textAlign: 'left'
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
    paperWrapper: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        alignItems: 'center',
        borderRadius: 10
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
        textAlign: 'center'
    },
    iconButton: {
        padding: 10
    },
    dropzone: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '80px',
        borderRadius: 10
    },
    outerContainer: {
        spacing: theme.spacing(1),
        alignItems: 'stretch',
        alignContent: 'stretch',
        justifyContent: 'center'
    }
}))
