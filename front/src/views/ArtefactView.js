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
    FormControl,
    Popover,
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    ListItemText,
    Checkbox,
    Paper,
    FormHelperText,
    ClickAwayListener,
    Popper
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTheme } from '@material-ui/styles'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers'

import {
    Loading,
    Map,
    geocodeQuery,
    artefactFamilyFormUseStyles
} from '../components'
import authContext from '../authContext'
import { useMutation } from '@apollo/react-hooks'
import { DropzoneArea } from 'material-ui-dropzone'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios';

import { Layout } from '../components'
import {
    CREATE_ARTEFACT_MUTATION_STR,
    UPDATE_ARTEFACT_MUTATION
} from '../gqlQueriesMutations'
import { AUTH_TOKEN, config } from '../constants'

function ArtefactView(props) {
    // get the mode
    var { create, edit, view } = props

    // get families, states, and artefact data
    var { statesLoading, familiesLoading, artefactLoading } = props
    var { artefactStates, families } = props

    // if viewing an existing artefact get the details (potentially unloaded)
    const context = useContext(authContext)
    const username = context.user.username
    let creationErrors, creationLoading;

    if (!create) {
        var artefact = !artefactLoading ? props.artefactData.artefact : {}
        var isAdmin = !artefactLoading
            ? artefact.admin.username === username
            : false
    }

    // only allow admins to see the edit page
    if (!isAdmin && edit) {
        edit = false
        view = true
    }

    const theme = useTheme()
    const classes = artefactFamilyFormUseStyles()

    // state variables for use in the "edit" mode:
    // the name of the field being edited, for use in the "edit" mode
    const [beingEdited, setBeingEdited] = useState('')
    // the value of the field being edited before it was changed
    const [prevValue, setPrevValue] = useState({})
    // a message indicating successful edit
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    // state variables for the map
    const [locationState, setLocationState] = useState({
        mapState: {},
        prevMapState: {},
        error: '',
        queryResults: []
    })
    // the address field of the main state object must be a query result on submit
    const [addressIsSearchResult, setAddressIsSearchResult] = useState(true)

    // makes a geocode query and sets the map's state accordingly
    // <inital> intended for use on loading in an artefact in edit or view mode
    // if <initial> is true then it will set the map to the first
    // result of the query rather than presenting query results
    const handleGeocodeQuery = ({ query, initial }) => {
        if (query) {
            console.log('Query run with argument: ', query)
            return geocodeQuery(query).then(response => {
                var newState = {}
                if (response.noErrors) {
                    newState.error = 'No results'
                } else if (response.error) {
                    newState.error =
                        'Unknown error occurred, check console for details'
                    console.log(response.error)
                }

                if (initial) {
                    newState.mapState = response.results[0].mapState
                    setAddressIsSearchResult(true)
                } else {
                    newState.queryResults = response.results
                }
                setLocationState({
                    ...locationState,
                    ...newState
                })
            })
        }
    }

    // state object for the input fields, GQL mutation variables taken from this
    const [state, setState] = useState({})
    // if in edit or view mode load in the data for the artefact into the state
    // only if the artefact has loaded and this hasn't already run
    if (
        (edit || view) &&
        !artefactLoading &&
        Object.keys(state).length === 0 &&
        families
    ) {
        var belong = {}
        families.map(val => (belong[val.id] = false))
        artefact.belongsToFamilies.map(val => (belong[val.id] = true))
        
        setState({
            ...artefact,
            belongsToFamiliesBools: belong
        })
        handleGeocodeQuery({ query: artefact.address, initial: true })
    }

    // if in create mode, initialise the booleans for the family checkboxes to false
    if (create && families && !state.belongsToFamiliesBools) {
        var belong = {}
        families.map(val => (belong[val.id] = false))

        setState({ belongsToFamiliesBools: belong, date: null })
    }

    // handler for setting the state object
    const handleSetField = (fieldName, value) => {
        if (edit && beingEdited !== fieldName) {
            setBeingEdited(fieldName)
            setPrevValue(state[fieldName])
        }
        setState({
            ...state,
            [fieldName]: value
        })
    }

    // handler for setting the map state when a user selects a location result
    const handleSetLocationResult = result => {
        var newLocationState = {
            mapState: result.mapState,
            error: '',
            queryResults: []
        }
        if (beingEdited === 'address' && !locationState.prevMapState) {
            newLocationState.prevMapState = locationState.mapState
        }
        handleSetField('address', result.placeName)

        setLocationState({
            ...locationState,
            ...newLocationState
        })
        setAddressIsSearchResult(true)
    }

    // reset the map to before the location was edited
    const resetMapToPrevState = () => {
        setLocationState({
            ...locationState,
            mapState: locationState.prevMapState,
            queryResults: [],
            prevMapState: {}
        })
    }

    // reset the field being edited
    const cancelEditing = () => {
        handleSetField(beingEdited, prevValue)
        setBeingEdited('')

        if (beingEdited === 'address') {
            resetMapToPrevState()
        }
    }

    // handle an edited but not finalised search field on submit
    const handleUnselectedSearchField = () => {
        setLocationState({
            ...locationState,
            error: 'Select a search result or clear search field before saving'
        })
    }

    // send user to view the specified artefact
    const pushViewArtefactURL = id => {
        const { history } = props
        if (history) {
            history.push(`/artefacts/${id}`)
        }
    }

    // handlers for GQL mutations
    const creationCompleted = async data => {
        var id = data.artefactCreate.artefact.id
        pushViewArtefactURL(id)
    }

    const updateCompleted = async data => {
        setBeingEdited('')
        setSnackbarOpen(true)
    }
    const handleCreationError = async errors => {
        console.error('Creation errors occurred:', errors)
    }
    const handleUpdateError = async errors => {
        console.error('Update errors occured: ', errors)
    }

    // const [
    //     createArtefact,
    //     { error: creationErrors, loading: creationLoading }
    // ] = useMutation(CREATE_ARTEFACT_MUTATION, {
    //     onCompleted: creationCompleted,
    //     onError: handleCreationError
    // })

    const createArtefact = (variables) => {
        console.log("here's input from call")
        console.log(variables);
        // const input = "hello"
        let form_data = new FormData();
        // Image not passed through by variables
        form_data.append('itemImage', state.files[0]);
        form_data.append('query', CREATE_ARTEFACT_MUTATION_STR);
        form_data.append('variables', JSON.stringify(variables));
        let url = config.uri;
        axios.post(url, form_data, {
            headers: {
                'Authorization': "JWT " + localStorage.getItem(AUTH_TOKEN),
                'Content-Type': 'application/x-www-form-urlencoded',
                "Content-Transfer-Encoding": "multipart/form-data",
            },
        })
            .then(data => {
                console.log("Success, run some stuff")
                console.log(data)
                // _creationCompleted(data)
            })
            .catch(err => {
                console.error(err);
                // _handleCreationError(err)
            })
    };

    const [updateArtefact, { error: updateErrors }] = useMutation(
        UPDATE_ARTEFACT_MUTATION,
        {
            onCompleted: updateCompleted,
            onError: handleUpdateError
        }
    )

    const parseDate = date => {
        return date ? date.toISOString().slice(0, -1) : null
    }

    // for creation of a new artefact
    const submitForm = async event => {
        if (!addressIsSearchResult) {
            handleUnselectedSearchField()
            return
        }

        var famIDs = []
        if (state.belongsToFamiliesBools) {
            famIDs = Object.keys(state.belongsToFamiliesBools).filter(
                id => state.belongsToFamiliesBools[id]
            )
        }

        // File/uploaded included directly from state, multipart request
        // in createArtefact
        var input = {
            name: state.name,
            description: state.description,
            state: state.state,
            isPublic: state.isPublic ? state.isPublic : false,
            belongsToFamilies: famIDs,
            address: state.address ? state.address : '',
        }
        if (state.date) {
            input.date = parseDate(state.date)
        }

        createArtefact(input)
    }

    // for updating an existing artefact
    const saveChange = async event => {
        if (edit) {
            var input = {}
            if (!addressIsSearchResult) {
                handleUnselectedSearchField()
                return
            } else if (beingEdited === 'belongsToFamiliesBools') {
                input['belongsToFamilies'] = Object.keys(
                    state.belongsToFamiliesBools
                ).filter(id => state.belongsToFamiliesBools[id])
            } else if (beingEdited === 'date') {
                input[beingEdited] = parseDate(state[beingEdited])
            } else {
                input[beingEdited] = state[beingEdited]
            }

            console.log('Input to GQL update mutation: input', input)
            // TODO:
            const variables = {
                "name": "hello",
                "state": "OKY",
                "description": "here's a short desc"
            }
            updateArtefact({
                variables: {
                    id: artefact.id,
                    artefactInput: input
                }
            })
        }
    }

    function MyButton(props) {
        return (
            <Button
                variant='contained'
                color={props.color}
                className={classes.button}
                onClick={props.onClick}
                fullWidth
                padding={1}
            >
                {props.name}
            </Button>
        )
    }

    // buttons to be rendered beneath a field when being edited
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
                    <MyButton
                        onClick={saveChange}
                        name='Save'
                        color='primary'
                    />
                </Grid>
                <Grid item xs={6}>
                    <MyButton
                        onClick={cancelEditing}
                        name='Cancel'
                        color='secondary'
                    />
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

    const noErrors = !creationErrors
    const dataLoading = familiesLoading || statesLoading

    var mapStyle
    if (theme && theme.palette.type === 'dark') {
        mapStyle = 'mapbox://styles/mapbox/dark-v10?optimize=true'
    } else {
        mapStyle = 'mapbox://styles/mapbox/streets-v9?optimize=true'
    }

    // select the submit handler
    const submitHandler = e => {
        e.preventDefault()
        create ? submitForm(e) : saveChange(e)
    }

    if ((edit || view) && dataLoading) {
        return <Loading />
    }

    return (
        <Fragment>
            <CssBaseline />
            <form onSubmit={submitHandler} className={classes.form}>
                <Grid container className={classes.outerContainer} spacing={1}>
                    <Grid item xs={12} container justify='center'>
                        <Grid item xs={12} sm={8}>
                            <Typography variant='h4' className={classes.title}>
                                {create && 'Create'} {edit && 'Edit'}{' '}
                                {view && 'View'} Artefact
                            </Typography>
                            {!view && (
                                <Typography
                                    variant='subtitle1'
                                    className={classes.title}
                                >
                                    {create &&
                                        'Artefacts are belongings of the family, enter as much or as little detail as you like'}
                                    {edit && 'Click to start editing'}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    {/* Left Pane */}
                    <Grid item xs={12} sm={6} container spacing={1}>
                        <Grid item xs={12}>
                            <Paper
                                className={classes.paperWrapper}
                                elevation={3}
                            >
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
                                        autoFocus={!view}
                                        required
                                        fullWidth
                                        value={state.name || ''}
                                        inputProps={{
                                            readOnly: view
                                        }}
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
                            <Paper
                                className={classes.paperWrapper}
                                elevation={3}
                            >
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
                                        inputProps={{
                                            readOnly: view
                                        }}
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
                                        {Object.keys(artefactStates).map(
                                            value => {
                                                return (
                                                    <MenuItem
                                                        value={
                                                            props
                                                                .artefactStates[
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
                            <Paper
                                className={classes.paperWrapper}
                                elevation={3}
                            >
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
                                        inputProps={{
                                            readOnly: view
                                        }}
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
                            <Paper
                                className={classes.paperWrapper}
                                elevation={3}
                            >
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
                                        inputProps={{
                                            readOnly: view
                                        }}
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

                        <Grid item xs={12}>
                            <Paper
                                className={classes.paperWrapper}
                                elevation={3}
                            >
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <KeyboardDatePicker
                                        disabled={view}
                                        clearable
                                        // variant='inline'
                                        inputVariant='outlined'
                                        format='dd/MM/yyyy'
                                        openTo='year'
                                        label='Date'
                                        value={state.date}
                                        onChange={date =>
                                            handleSetField('date', date)
                                        }
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date'
                                        }}
                                    />
                                    {edit && beingEdited === 'date' && (
                                        <EditButtons />
                                    )}
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
                            <Paper
                                className={classes.paperWrapper}
                                elevation={3}
                            >
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
                                            {!view && (
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge='start'
                                                        checked={
                                                            state.isPublic ||
                                                            false
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
                                            )}
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
                            <Paper
                                className={classes.paperWrapper}
                                elevation={3}
                            >
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <List
                                        subheader={
                                            <ListSubheader component='div'>
                                                {!view
                                                    ? 'Select which of your families the artefact belongs to'
                                                    : 'Belongs to'}
                                            </ListSubheader>
                                        }
                                    >
                                        {families.map(family => {
                                            if (!state.belongsToFamiliesBools) {
                                                return
                                            }

                                            if (
                                                !view ||
                                                state.belongsToFamiliesBools[
                                                    family.id
                                                ]
                                            ) {
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
                                                        {!view && (
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge='start'
                                                                    checked={
                                                                        state
                                                                            .belongsToFamiliesBools[
                                                                            family
                                                                                .id
                                                                        ] ||
                                                                        false
                                                                    }
                                                                    onClick={e =>
                                                                        handleSetField(
                                                                            'belongsToFamiliesBools',
                                                                            {
                                                                                ...state.belongsToFamiliesBools,
                                                                                [family.id]:
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                            }
                                                                        )
                                                                    }
                                                                    tabIndex={
                                                                        -1
                                                                    }
                                                                />
                                                            </ListItemIcon>
                                                        )}
                                                        <ListItemText
                                                            primary={
                                                                family.familyName
                                                            }
                                                        />
                                                    </ListItem>
                                                )
                                            }
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

                        {/* TO DO: show images in different way on view page */}
                        {!view && (
                            <Grid item xs={12}>
                                <Paper
                                    className={classes.paperWrapper}
                                    elevation={3}
                                >
                                    <DropzoneArea
                                        initialFiles={state.files || []}
                                        onChange={files =>
                                            handleSetField('files', files)
                                        }
                                        dropzoneClass={classes.dropzone}
                                    />
                                </Paper>
                            </Grid>
                        )}
                    </Grid>

                    <Grid container item xs={12} spacing={1}>
                        <Grid item xs={12}>
                            <Paper
                                className={classes.paperWrapper}
                                elevation={3}
                            >
                                <FormControl
                                    className={classes.formControl}
                                    fullWidth
                                >
                                    <TextField
                                        id='address'
                                        label='Address'
                                        variant='outlined'
                                        fullWidth
                                        value={state.address || ''}
                                        inputProps={{
                                            readOnly: view
                                        }}
                                        onChange={e => {
                                            handleSetField(
                                                'address',
                                                e.target.value
                                            )
                                            if (e.target.value) {
                                                setAddressIsSearchResult(false)
                                            } else {
                                                // allow blank address
                                                setAddressIsSearchResult(true)
                                            }
                                        }}
                                        error={!!locationState.error}
                                        InputProps={{
                                            endAdornment: !view && (
                                                <IconButton
                                                    className={
                                                        classes.iconButton
                                                    }
                                                    aria-label='search'
                                                    id='search'
                                                    onClick={e =>
                                                        handleGeocodeQuery({
                                                            query:
                                                                state.address,
                                                            initial: false
                                                        })
                                                    }
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            ),
                                            style: { marginBottom: 3 }
                                        }}
                                        onKeyDown={e => {
                                            if (e.keyCode === 13 && !view) {
                                                e.preventDefault()
                                                document
                                                    .getElementById('search')
                                                    .click()
                                            }
                                        }}
                                        helperText={locationState.error}
                                    />
                                    <Popover
                                        id={
                                            locationState.queryResults.length
                                                ? 'results'
                                                : undefined
                                        }
                                        open={
                                            !!locationState.queryResults.length
                                        }
                                        anchorEl={document.getElementById(
                                            'address'
                                        )}
                                        onClose={e =>
                                            setLocationState({
                                                ...locationState,
                                                queryResults: []
                                            })
                                        }
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left'
                                        }}
                                    >
                                        <List component='div' disablePadding>
                                            {locationState.queryResults.map(
                                                result => (
                                                    <ListItem
                                                        key={result.placeName}
                                                        button
                                                        className={
                                                            classes.nested
                                                        }
                                                        onClick={e =>
                                                            handleSetLocationResult(
                                                                result
                                                            )
                                                        }
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                result.placeName
                                                            }
                                                        />
                                                    </ListItem>
                                                )
                                            )}
                                        </List>
                                    </Popover>

                                    {edit && beingEdited === 'address' && (
                                        <EditButtons />
                                    )}

                                    <Grid container style={{ marginTop: 1 }}>
                                        <Map
                                            interactive={false}
                                            className={classes.map}
                                            mapStyle={mapStyle}
                                            mapState={locationState.mapState}
                                            containerStyle={{
                                                height: '60vh',
                                                width: '100vw',
                                                borderRadius: 20,
                                                marginTop: 5
                                            }}
                                            artefacts={[
                                                {
                                                    center:
                                                        locationState.mapState
                                                            .center
                                                }
                                            ]}
                                        />
                                    </Grid>
                                </FormControl>
                            </Paper>
                        </Grid>
                    </Grid>

                    {create && (
                        <Grid item xs={5}>
                            <Button
                                name='create'
                                label='Create'
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='primary'
                                disabled={creationLoading}
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

                <ClickAwayListener onClickAway={() => setSnackbarOpen(false)}>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        open={snackbarOpen}
                        autoHideDuration={2000}
                        onClose={() => setSnackbarOpen(false)}
                        ContentProps={{
                            'aria-describedby': 'message-id'
                        }}
                        message={<span id='message-id'>Edit successful</span>}
                        action={[
                            <Button
                                key='view'
                                color='secondary'
                                size='small'
                                onClick={e => pushViewArtefactURL(artefact.id)}
                            >
                                VIEW
                            </Button>,
                            <IconButton
                                key='close'
                                aria-label='close'
                                color='inherit'
                                onClick={() => setSnackbarOpen(false)}
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

function Wrapped(props) {
    return (
        <Layout>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                    container
                    spacing={0}
                    direction='column'
                    alignItems='center'
                    justify='center'
                    style={{ minHeight: '80vh' }}
                >
                    <Grid item xs={10}>
                        <ArtefactView {...props} />
                    </Grid>
                </Grid>
            </MuiPickersUtilsProvider>
        </Layout>
    )
}

export default withRouter(Wrapped)
