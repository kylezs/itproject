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
        justifyContent: 'flex-start',
        textAlign: 'left'
    },
    fieldTitle: {
        textAlign: 'left',
        marginLeft: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(1),
        // textAlign: 'center',
        backgroundColor: theme.palette.background.paper
    },
    paperWrapper: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        borderRadius: 10
    },
    button: {
        height: '100%'
    },
    editLinkButton: {
        width: '60px',
        height: '30px',
        margin: theme.spacing(1)
    },
    deleteButton: {
        width: '60px',
        height: '30px',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.error.main
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
        backgroundColor: theme.palette.background.paper + '!important',
        height: '100%',
        borderRadius: 10,
        alignItems: 'flex-start !important'
    },
    dropzoneText: {
        fontSize: 'medium !important'
        // margin: '0 !important'
    },
    outerContainer: {
        spacing: theme.spacing(1),
        alignItems: 'stretch',
        alignContent: 'stretch',
        justifyContent: 'center'
    },
    switch: {
        justifyContent: 'center',
        textAlign: 'center'
    }
}))
