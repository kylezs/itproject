import React, { useContext, useState, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    MenuItem,
    Snackbar,
    IconButton,
    FormControl
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import {
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    ListItemText,
    Collapse,
    Checkbox,
    Paper,
    FormHelperText,
    ClickAwayListener
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { Loading, Map } from '../components'
import { geocodeQuery } from '../components/Map'
import authContext from '../authContext'
import { useMutation } from '@apollo/react-hooks'
import { DropzoneArea } from 'material-ui-dropzone'

import SearchIcon from '@material-ui/icons/Search'

import {
    CREATE_ARTEFACT_MUTATION,
    UPDATE_ARTEFACT_MUTATION
} from '../gqlQueriesMutations'

const useStyles = makeStyles(theme => ({
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
        flexWrap: 'wrap'
    },
    iconButton: {
        padding: 10
    }
}))

function ArtefactView(props) {
    var create = true,
        edit = false
    if (props.mode === 'edit') {
        create = false
        edit = true
    } else if (props.mode !== 'create') {
        console.log('unknown mode provided, defaulted to create')
    }

    const theme = useTheme()
    const classes = useStyles()

    const context = useContext(authContext)

    const [beingEdited, setBeingEdited] = useState('')
    const [prevValue, setPrevValue] = useState({})
    const [currValue, setCurrValue] = useState({})
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const [locationState, setLocationState] = useState({
        locationText: '',
        mapState: {},
        locationError: '',
        locationType: ''
    })
    const [queryResults, setQueryResults] = useState([])

    // only need to exlicitly set the unrequired fields here
    const [state, setState] = useState({})
    const stateLen = Object.keys(state).length
    const artefactLoaded = edit && Object.keys(props.artefact).length !== 0
    if (artefactLoaded && stateLen === 0) {
        var belong = {}
        props.artefact.belongsToFamilies.map(val => (belong[val.id] = true))

        // run geocode query here and process result
        if (props.artefact.location.length){
            var args = [props.artefact.location, [props.artefact.locationType.toLowerCase()]]
            console.log('Query run with arguments: ', ...args)
            geocodeQuery(...args).then(response => {
                console.log("response: ", response)
                var errMsg = ''
                if (response.error) {
                    errMsg = 'Unknown error occurred, check console for details'
                    console.log(response.error)
                }
                if (response.noResults) errMsg = 'No results'
                if (errMsg) {
                    setLocationState({
                        ...locationState,
                        locationError: errMsg
                    })
                } else {
                    setLocationState({
                        locationText: response.results[0].placeName,
                        mapState: response.results[0].mapState,
                        locationError: '',
                        locationType: props.artefact.locationType
                    })
                }
            })
        }

        setState({
            ...props.artefact,
            belongsToFamiliesBools: belong
        })
    }

    const _pushViewArtefactURL = id => {
        const { history } = props
        if (history) {
            history.push(`/artefacts/${id}`)
        }
    }

    const _creationCompleted = async data => {
        var id = data.artefactCreate.artefact.id
        _pushViewArtefactURL(id)
    }

    const _handleCreationError = async errors => {
        // TO DO
        console.log('Creation errors occurred:', errors)
    }

    const _handleUpdateError = async errors => {
        console.log('update error occured: ', errors)
    }

    const [
        createArtefact,
        { error: creationErrors, loading: creationLoading }
    ] = useMutation(CREATE_ARTEFACT_MUTATION, {
        onCompleted: _creationCompleted,
        onError: _handleCreationError
    })

    const _updateCompleted = async data => {
        setBeingEdited('')
        setSnackbarOpen(true)
    }

    const [updateArtefact, { error: updateErrors }] = useMutation(
        UPDATE_ARTEFACT_MUTATION,
        {
            onCompleted: _updateCompleted,
            onError: _handleUpdateError
        }
    )

    const setField = (fieldName, value) => {
        var prev = state[fieldName]
        setState({
            ...state,
            [fieldName]: value
        })

        if (edit && beingEdited !== fieldName) {
            setPrevValue(prev)
        }
    }

    const handleSetField = (fieldName, value, famId) => {
        if (fieldName === 'belongsToFamiliesBools') {
            value = {
                ...state.belongsToFamiliesBools,
                [famId]: value
            }
        }

        setField(fieldName, value)
        setCurrValue(value)
        if (edit && beingEdited !== fieldName) {
            setBeingEdited(fieldName)
        }
    }

    const _handleGeocodeQuery = query => {
        if (query) {
            console.log('Query run with argument: ', query)
            return geocodeQuery(query, ['place', 'address']).then(response => {
                var errMsg = ''
                if (response.error) {
                    errMsg = 'Unknown error occurred, check console for details'
                    console.log(response.error)
                }
                if (response.noErrors) errMsg = 'No results'
                if (errMsg) {
                    setLocationState({
                        ...locationState,
                        locationError: errMsg
                    })
                } else {
                    setQueryResults(response.results)
                }
                return response
            })
        }
    }

    const handleSetLocationResult = result => {
        handleSetField('location', result.mapState.center)
        setQueryResults([])
        setLocationState({
            locationText: result.placeName,
            mapState: result.mapState,
            locationError: '',
            locationType: result.locationType
        })
    }

    const cancelEditing = () => {
        setField(beingEdited, prevValue)
        setBeingEdited('')

        if (beingEdited === 'location') {
            _handleGeocodeQuery(prevValue)
        }
    }

    const submitForm = async event => {
        event.preventDefault()

        // read image files
        // TO DO
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result
            console.log(binaryStr)
        }

        if (state.files) {
            state.files.forEach(file => reader.readAsArrayBuffer(file))
        }

        var famIDs
        if (state.belongsToFamiliesBools) {
            famIDs = Object.keys(state.belongsToFamiliesBools).filter(
                id => state.belongsToFamiliesBools[id]
            )
        } else {
            famIDs = []
        }

        var input = {
            name: state.name,
            description: state.description,
            state: state.state,
            isPublic: state.isPublic,
            belongsToFamilies: famIDs,
            location: state.location,
            locationType: locationState.locationType.toUpperCase()
        }
        if (state.isPublic) {
            input.isPublic = state.isPublic
        }
        console.log('Input to GQL mutation:', input)

        createArtefact({
            variables: input
        })
    }

    const saveChange = async event => {
        event.preventDefault()
        if (edit) {
            var input = {}

            if (beingEdited === 'belongsToFamiliesBools') {
                input[beingEdited] = Object.keys(
                    state.belongsToFamiliesBools
                ).filter(id => state.belongsToFamiliesBools[id])
            } else if (beingEdited === 'location') {
                input[beingEdited] = currValue
            } else {
                input[beingEdited] = currValue
            }

            console.log(input)

            updateArtefact({
                variables: {
                    id: props.artefact.id,
                    artefactInput: input
                }
            })
        }
    }

    function SaveButton() {
        return (
            <Button
                variant='contained'
                color='primary'
                type='submit'
                className={classes.button}
                onClick={saveChange}
                fullWidth
                padding={1}
            >
                Save
            </Button>
        )
    }

    function CancelButton() {
        return (
            <Button
                variant='contained'
                color='default'
                className={classes.button}
                onClick={cancelEditing}
                fullWidth
                padding={1}
            >
                Cancel
            </Button>
        )
    }

    function EditButtons() {
        return (
            <Grid
                container
                justify='space-evenly'
                alignItems='center'
                spacing={1}
                style={{ marginTop: 1 }}
            >
                <Grid item xs={6}>
                    <SaveButton />
                </Grid>
                <Grid item xs={6}>
                    <CancelButton />
                </Grid>

                {updateErrors && (
                    <Grid item xs={12}>
                        <FormHelperText error>
                            Error Updating Artefact
                        </FormHelperText>
                    </Grid>
                )}
            </Grid>
        )
    }

    function handleCloseSnackbar(event, reason) {
        if (reason === 'clickaway') {
            return
        }

        setSnackbarOpen(false)
    }

    const invalidInputs =
        !state.name || !state.state || !state.description
    const noErrors = !creationErrors
    const dataLoading = props.familyLoading || props.statesLoading

    var mapStyle
    if (theme && theme.palette.type === 'dark') {
        mapStyle = 'mapbox://styles/mapbox/dark-v10?optimize=true'
    } else {
        mapStyle = 'mapbox://styles/mapbox/light-v10?optimize=true'
    }

    if (edit && dataLoading) {
        return <Loading />
    }

    return (
        <Fragment>
            <CssBaseline />
            <form
                onSubmit={create ? submitForm : saveChange}
                className={classes.form}
            >
                <Grid
                    container
                    spacing={1}
                    alignItems='stretch'
                    alignContent='stretch'
                    justify='space-evenly'
                >
                    <Grid item xs={12} container justify='center'>
                        <Grid item xs={12} sm={8}>
                            <Typography variant='h4' className={classes.title}>
                                {create ? 'Create' : 'Edit'} Artefact
                            </Typography>
                            <Typography
                                variant='subtitle1'
                                className={classes.title}
                            >
                                {create
                                    ? 'Artefacts are belongings of the family, enter as much or as little detail as you like'
                                    : 'Click to start editing'}
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* Left Pane */}
                    <Grid item xs={12} sm={6} container spacing={1}>
                        <Grid item xs={12}>
                            <Paper className={classes.paperTextWrapper}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <TextField
                                        // style={{ height: '100%' }}
                                        // InputProps={{ style: {height: '100%'} }}
                                        id='artefact-name'
                                        label='Artefact name'
                                        variant='outlined'
                                        required
                                        fullWidth
                                        value={state.name || ''}
                                        onChange={e =>
                                            handleSetField(
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            edit &&
                                            !!beingEdited &&
                                            beingEdited !== 'name'
                                        }
                                    />

                                    {edit && beingEdited === 'name' && (
                                        <EditButtons />
                                    )}
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className={classes.paperTextWrapper}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <TextField
                                        id='state'
                                        label='Artefact State'
                                        variant='outlined'
                                        required
                                        fullWidth
                                        value={state.state || ''}
                                        onChange={e =>
                                            handleSetField(
                                                'state',
                                                e.target.value
                                            )
                                        }
                                        select
                                        disabled={
                                            edit &&
                                            !!beingEdited &&
                                            beingEdited !== 'state'
                                        }
                                    >
                                        {Object.keys(props.artefactStates).map(
                                            value => {
                                                return (
                                                    <MenuItem
                                                        value={
                                                            props.artefactStates[
                                                                value
                                                            ]
                                                        }
                                                        key={value}
                                                    >
                                                        {value}
                                                    </MenuItem>
                                                )
                                            }
                                        )}
                                    </TextField>

                                    {edit && beingEdited === 'state' && (
                                        <EditButtons />
                                    )}
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className={classes.paperTextWrapper}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <TextField
                                        id='description'
                                        label='Description'
                                        variant='outlined'
                                        required
                                        fullWidth
                                        multiline
                                        rows={6}
                                        value={state.description || ''}
                                        onChange={e =>
                                            handleSetField(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            edit &&
                                            !!beingEdited &&
                                            beingEdited !== 'description'
                                        }
                                    />

                                    {edit && beingEdited === 'description' && (
                                        <EditButtons />
                                    )}
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className={classes.paperTextWrapper}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <TextField
                                        id='artefact-admin'
                                        label='Artefact Admin'
                                        variant='outlined'
                                        required
                                        fullWidth
                                        value={
                                            state.admin &&
                                            Object.keys(state.admin).length !==
                                                0
                                                ? state.admin.username
                                                : context.user.username
                                        }
                                        onChange={e =>
                                            console.log(
                                                'admin field was changed'
                                            )
                                        }
                                        disabled
                                    />
                                </FormControl>
                            </Paper>
                        </Grid>
                    </Grid>
                    {/* Right Pane */}
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        container
                        spacing={1}
                        alignContent='stretch'
                    >
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <List
                                        subheader={
                                            <ListSubheader component='div'>
                                                Privacy
                                            </ListSubheader>
                                        }
                                        dense
                                    >
                                        <ListItem
                                            disabled={
                                                edit &&
                                                !!beingEdited &&
                                                beingEdited !== 'isPublic'
                                            }
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge='start'
                                                    checked={
                                                        state.isPublic || false
                                                    }
                                                    tabIndex={-1}
                                                    onClick={e =>
                                                        handleSetField(
                                                            'isPublic',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={'Public'} />
                                        </ListItem>
                                    </List>

                                    {edit && beingEdited === 'isPublic' && (
                                        <EditButtons />
                                    )}
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <List
                                        subheader={
                                            <ListSubheader component='div'>
                                                Select which of your families
                                                the artefact belongs to
                                            </ListSubheader>
                                        }
                                    >
                                        {props.families.map(family => {
                                            if (
                                                state.belongsToFamiliesBools &&
                                                !state.belongsToFamiliesBools[
                                                    family.id
                                                ]
                                            ) {
                                                state.belongsToFamiliesBools[
                                                    family.id
                                                ] = false
                                            }

                                            return (
                                                <ListItem
                                                    key={family.id}
                                                    dense
                                                    disabled={
                                                        edit &&
                                                        !!beingEdited &&
                                                        beingEdited !==
                                                            'belongsToFamiliesBools'
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge='start'
                                                            checked={
                                                                (state.belongsToFamiliesBools &&
                                                                    state
                                                                        .belongsToFamiliesBools[
                                                                        family
                                                                            .id
                                                                    ]) ||
                                                                false
                                                            }
                                                            onClick={e =>
                                                                handleSetField(
                                                                    'belongsToFamiliesBools',
                                                                    e.target
                                                                        .checked,
                                                                    family.id
                                                                )
                                                            }
                                                            tabIndex={-1}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            family.familyName
                                                        }
                                                    />
                                                </ListItem>
                                            )
                                        })}
                                    </List>

                                    {edit &&
                                        beingEdited ===
                                            'belongsToFamiliesBools' && (
                                            <EditButtons />
                                        )}
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <DropzoneArea
                                    initialFiles={state.files || []}
                                    onChange={files =>
                                        handleSetField('files', files)
                                    }
                                    disabled={
                                        edit &&
                                        !!beingEdited &&
                                        beingEdited !== 'files'
                                    }
                                    dropzoneClass={classes.paper}
                                />
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} spacing={1}>
                        <Grid item xs={12}>
                            <Paper className={classes.paperTextWrapper}>
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <TextField
                                        id='locationText'
                                        label='Address'
                                        variant='outlined'
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    className={
                                                        classes.iconButton
                                                    }
                                                    aria-label='search'
                                                    id='search'
                                                    onClick={() =>
                                                        _handleGeocodeQuery(
                                                            locationState.locationText
                                                        )
                                                    }
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            ),
                                            style: { marginBottom: 3 }
                                        }}
                                        fullWidth
                                        value={locationState.locationText || ''}
                                        onChange={e => {
                                            setLocationState({
                                                ...locationState,
                                                locationText: e.target.value
                                            })
                                        }
                                        }
                                        error={!!locationState.locationError}
                                        onKeyDown={e => {
                                            if (e.keyCode === 13) {
                                                document
                                                    .getElementById('search')
                                                    .click()
                                            }
                                        }}
                                        helperText={locationState.locationError}
                                    />

                                    <Collapse
                                        in={!!queryResults}
                                        timeout='auto'
                                        unmountOnExit
                                    >
                                        <List component='div' disablePadding>
                                            {queryResults.map(result => (
                                                <ListItem
                                                    key={result.placeName}
                                                    button
                                                    className={classes.nested}
                                                    onClick={e =>
                                                        handleSetLocationResult(
                                                            result
                                                        )
                                                    }
                                                >
                                                    {/* <ListItemIcon>
                                                        <StarBorder />
                                                    </ListItemIcon> */}
                                                    <ListItemText
                                                        primary={
                                                            result.placeName
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>

                                    {edit && beingEdited === 'location' && (
                                        <EditButtons />
                                    )}

                                    <Grid container style={{ marginTop: 1 }}>
                                        <Map
                                            className={classes.map}
                                            mapStyle={mapStyle}
                                            mapState={locationState.mapState}
                                            coord={state.location}
                                            setCoord={coord => {
                                                setLocationState({
                                                    ...locationState,
                                                    locationType: 'address'
                                                })
                                                handleSetField(
                                                    'location',
                                                    coord
                                                )
                                            }
                                            }
                                        />
                                    </Grid>
                                </FormControl>
                            </Paper>
                        </Grid>
                    </Grid>

                    {create && (
                        <Grid item xs={6}>
                            <Button
                                name='create'
                                label='Create'
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='primary'
                                disabled={invalidInputs || creationLoading}
                            >
                                Create
                            </Button>
                            {!noErrors && (
                                <FormHelperText error={!noErrors}>
                                    Unknown Error Occurred
                                </FormHelperText>
                            )}
                        </Grid>
                    )}
                </Grid>

                <ClickAwayListener onClickAway={handleCloseSnackbar}>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        open={snackbarOpen}
                        autoHideDuration={2000}
                        onClose={handleCloseSnackbar}
                        ContentProps={{
                            'aria-describedby': 'message-id'
                        }}
                        message={<span id='message-id'>Edit successful</span>}
                        action={[
                            <Button
                                key='view'
                                color='secondary'
                                size='small'
                                onClick={e => {
                                    _pushViewArtefactURL(props.artefact.id) &&
                                        handleCloseSnackbar(e)
                                }}
                            >
                                VIEW
                            </Button>,
                            <IconButton
                                key='close'
                                aria-label='close'
                                color='inherit'
                                onClick={handleCloseSnackbar}
                                className={classes.close}
                            >
                                <CloseIcon />
                            </IconButton>
                        ]}
                    />
                </ClickAwayListener>
            </form>
        </Fragment>
    )
}

export default withRouter(ArtefactView)
