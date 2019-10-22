import React, { useState, Fragment } from 'react'
import { useTheme } from '@material-ui/styles'
import {
    MenuItem,
    TextField,
    Grid,
    Paper,
    IconButton,
    Snackbar,
    SnackbarContent,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core'
import HelpIcon from '@material-ui/icons/Help'
import ErrorIcon from '@material-ui/icons/Error'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { green } from '@material-ui/core/colors'

import { Map } from '../components'
import { artefactGeocodeQuery } from '../components/MapAPI'

import { GetFamiliesWrapper, HelpDialog } from '../components'

import { GET_FAMILY_ARTEFACTS } from '../gqlQueriesMutations'
import { useQuery } from '@apollo/react-hooks'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    overlay: {
        position: 'absolute',
        top: '70px',
        right: '5px',
        // backgroundColor: theme.palette.background.paper,
        margin: theme.spacing(1),
        minWidth: 120
    },
    paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        borderRadius: 10
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    success: {
        backgroundColor: green[600]
    },
    icon: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
        fontSize: 20
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
}))

const MyDialogContent = () => (
    <Fragment>
        <DialogTitle id='help-title'>Help</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Select from your families in the corner to view their artefacts
            </DialogContentText>
            <DialogContentText>
                Only artefacts with a location will be shown
            </DialogContentText>
        </DialogContent>

        <DialogTitle id='help-title'>Map Controls</DialogTitle>
        <DialogContent>
            <DialogContentText>Scroll to zoom</DialogContentText>
            <DialogContentText>Click and drag to move</DialogContentText>
            <DialogContentText>
                Click on an artefact to show more information
            </DialogContentText>
        </DialogContent>
    </Fragment>
)

const MapStyles = [
    { value: 'mapbox://styles/mapbox/streets-v11', name: 'Streets' },
    { value: 'mapbox://styles/mapbox/satellite-v9', name: 'Satellite' },
    { value: 'mapbox://styles/mapbox/light-v10', name: 'Light' },
    { value: 'mapbox://styles/mapbox/dark-v10', name: 'Dark' },
    {
        value: 'mapbox://styles/zduffield/ck1q1hwgo2idy1cl3jt3rh1vk',
        name: 'Ugly'
    }
]

function MapView(props) {
    const theme = useTheme()
    const classes = useStyles()
    var defaultMapStyle = 'mapbox://styles/mapbox/streets-v9?optimize=true'
    if (theme.palette.type === 'dark') {
        defaultMapStyle = 'mapbox://styles/mapbox/dark-v10?optimize=true'
    }

    var { families, familiesLoading } = props

    // initally query is run with invalid ID
    const [state, setState] = useState({
        family: { id: '-1' },
        defaultMapStyle: defaultMapStyle,
        mapStyle: defaultMapStyle,
        selectedArtefact: {}
    })

    if (state.defaultMapStyle !== defaultMapStyle) {
        // avoid unnecessary rerender of map
        if (state.mapStyle !== defaultMapStyle) {
            setState({
                ...state,
                defaultMapStyle: defaultMapStyle,
                mapStyle: defaultMapStyle
            })
        } else {
            setState({
                ...state,
                defaultMapStyle: defaultMapStyle
            })
        }
    }

    const [mapArtefacts, setMapArtefacts] = useState([])
    const initMapState = { zoom: [2] }
    const [mapState, setMapState] = useState(initMapState)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [errorSnackbar, setErrorSnackbar] = useState({ open: false, msg: '' })
    const getArtefactMapData = data => {
        console.log('Query resulted')
        if (!data) return
        artefacts = data.family.hasArtefacts.edges.map(edge => edge.node)

        var promiseArr = []
        for (var i = 0; i < artefacts.length; i++) {
            if (artefacts[i].address) {
                promiseArr.push(
                    artefactGeocodeQuery(artefacts[i]).then(result => {
                        var { response, artefact } = result
                        if (response.error) {
                            console.log(response.error)
                            setErrorSnackbar({
                                open: true,
                                msg: 'Error loading artefacts'
                            })
                        } else {
                            var mapArtefact = {
                                ...artefact,
                                popup: true,
                                center: response.results[0].mapState.center,
                                initPopupOpen: false
                            }
                            return mapArtefact
                        }
                    })
                )
            }
        }
        Promise.all(promiseArr).then(result => {
            setMapArtefacts(result)
            setSnackbarOpen(true)
        })
    }

    useQuery(GET_FAMILY_ARTEFACTS, {
        variables: { id: state.family.id },
        onCompleted: getArtefactMapData,
        onError: error => {
            if (state.family.id > 0) {
                setErrorSnackbar({ open: true, msg: 'Error loading family' })
                console.log(error)
            }
        },
        fetchPolicy: 'network-only'
    })

    var artefacts = []

    const handleChange = event => {
        if (event.target.value === state.family) return

        if (event.target.name === 'family') {
            setMapArtefacts([])
        }

        if (event.target.name === 'selectedArtefact') {
            if (event.target.value !== null) {
                var newCenter = event.target.value.center
                if (newCenter === mapState.center) {
                    newCenter = newCenter.map(coord => 0.99999999 * coord)
                }
                setMapState({
                    center: newCenter
                })
                event.target.value.initPopupOpen = true
            }
        }
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    return (
        <Paper className={classes.paper} elevation={10}>
            <Grid container>
                <Map
                    interactive
                    mapStyle={state.mapStyle}
                    mapState={mapState}
                    containerStyle={{
                        height: '87vh',
                        width: '100vw',
                        position: 'relative',
                        zIndex: 0,
                        borderRadius: 10
                    }}
                    artefacts={mapArtefacts}
                    // onClick={e => setState({ ...state, selectedArtefact: {} })}
                />
            </Grid>
            <Grid
                container
                item
                xs={4}
                sm={1}
                className={classes.overlay}
                justify='flex-end'
            >
                {!familiesLoading && (
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <TextField
                                fullWidth
                                label='Family'
                                variant='outlined'
                                value={state.family || {}}
                                select
                                onChange={handleChange}
                                SelectProps={{
                                    name: 'family',
                                    autoWidth: true
                                }}
                            >
                                {families.map(fam => (
                                    <MenuItem value={fam} key={fam.id}>
                                        {fam.familyName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Paper>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <TextField
                            fullWidth
                            label='Map Style'
                            variant='outlined'
                            value={state.mapStyle}
                            select
                            onChange={handleChange}
                            SelectProps={{
                                name: 'mapStyle',
                                autoWidth: true
                            }}
                        >
                            <MenuItem value={defaultMapStyle}>Default</MenuItem>
                            {MapStyles.map(style => (
                                <MenuItem value={style.value} key={style.value}>
                                    {style.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Paper>
                </Grid>

                {mapArtefacts.length > 0 && (
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <TextField
                                fullWidth
                                label='Jump to'
                                variant='outlined'
                                value={state.selectedArtefact || {}}
                                select
                                onChange={handleChange}
                                SelectProps={{
                                    name: 'selectedArtefact',
                                    autoWidth: true
                                }}
                            >
                                {mapArtefacts.map(artefact => (
                                    <MenuItem
                                        value={artefact}
                                        key={artefact.id}
                                    >
                                        {artefact.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            <HelpDialog
                open={props.helpOpen}
                setOpen={props.setHelpOpen}
                content={MyDialogContent}
            />

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={e => setSnackbarOpen(false)}
            >
                <SnackbarContent
                    className={classes.success}
                    aria-describedby='success-message-id'
                    message={
                        <span
                            id='success-message-id'
                            className={classes.message}
                        >
                            <CheckCircleIcon className={classes.icon} />
                            {mapArtefacts.length} Artefacts Loaded
                        </span>
                    }
                />
            </Snackbar>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={errorSnackbar.open}
                autoHideDuration={2000}
                onClose={e => setErrorSnackbar({ open: false, msg: '' })}
            >
                <SnackbarContent
                    className={classes.error}
                    aria-describedby='err-message-id'
                    message={
                        <span id='err-message-id' className={classes.message}>
                            <ErrorIcon className={classes.icon} />
                            {errorSnackbar.msg}
                        </span>
                    }
                />
            </Snackbar>
        </Paper>
    )
}

export default props => <GetFamiliesWrapper {...props} child={MapView} />
