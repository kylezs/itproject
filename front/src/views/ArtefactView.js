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

import { Layout } from '../components'
import {
    CREATE_ARTEFACT_MUTATION,
    UPDATE_ARTEFACT_MUTATION
} from '../gqlQueriesMutations'

function ArtefactView(props) {
    const context = useContext(authContext)
    const username = context.user.username

    // get the mode
    var { create, edit, view } = props

    // get families, states, and artefact data
    var { statesLoading, familiesLoading, artefactLoading } = props
    if (!create) {
        var artefact = !artefactLoading ? props.artefactData.artefact : {}
        var isAdmin = !artefactLoading
            ? artefact.admin.username === username
            : false
    }
    var { artefactStates, families } = props

    // only allow admins to see the edit page
    if (!isAdmin && edit) {
        edit = false
        view = true
    }

    const theme = useTheme()
    const classes = artefactFamilyFormUseStyles()

    const [beingEdited, setBeingEdited] = useState('')
    const [prevValue, setPrevValue] = useState({})
    const [currValue, setCurrValue] = useState({})
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const [locationState, setLocationState] = useState({
        mapState: {},
        prevMapState: {},
        locationError: ''
    })
    const [addressIsSearchResult, setAddressIsSearchResult] = useState(true)
    const [queryResults, setQueryResults] = useState([])

    const [state, setState] = useState({})

    if (
        (edit || view) &&
        !artefactLoading &&
        Object.keys(artefact).length !== 0 &&
        Object.keys(state).length === 0
    ) {
        var belong = {}
        artefact.belongsToFamilies.map(val => (belong[val.id] = true))

        setState({
            ...artefact,
            belongsToFamiliesBools: belong
        })

        // run geocode query here and process result
        // if the query is blank an empty promise is immediately returned
        console.log('Query run with argument: ', artefact.address)
        geocodeQuery(artefact.address).then(response => {
            if (artefact.address) {
                var address = ''
                var errMsg = ''
                console.log('response: ', response)
                if (response.error) {
                    errMsg = 'Unknown error occurred, check console for details'
                    console.log(response.error)
                } else if (response.noResults) {
                    errMsg = 'No results'
                }

                if (errMsg) {
                    setLocationState({
                        ...locationState,
                        locationError: errMsg
                    })
                } else {
                    setLocationState({
                        mapState: response.results[0].mapState,
                        locationError: ''
                    })
                    address = response.results[0].placeName
                }
                setAddressIsSearchResult(artefact.address === address)
            }
        })
    }

    if (create && families && !state.belongsToFamiliesBools) {
        var belong = {}
        families.map(val => (belong[val.id] = true))

        setState({
            ...artefact,
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
            return geocodeQuery(query).then(response => {
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
        var newLocationState = {
            mapState: result.mapState,
            locationError: ''
        }
        if (beingEdited === 'address' && !locationState.prevMapState) {
            newLocationState.prevMapState = locationState.mapState
        }
        handleSetField('address', result.placeName)
        setQueryResults([])

        setLocationState({
            ...locationState,
            ...newLocationState
        })
        setAddressIsSearchResult(true)
    }

    const resetMapToPrevState = () => {
        setLocationState({
            ...locationState,
            mapState: locationState.prevMapState,
            prevMapState: {}
        })
        setQueryResults([])
    }

    const cancelEditing = () => {
        setField(beingEdited, prevValue)
        setBeingEdited('')

        if (beingEdited === 'address') {
            resetMapToPrevState()
        }
    }

    const handleUnselectedSearchField = () => {
        setLocationState({
            ...locationState,
            locationError: 'Select a search result or clear search field'
        })
    }

    const submitForm = async event => {
        if (!addressIsSearchResult) {
            handleUnselectedSearchField()
            return
        }

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
            isPublic: state.isPublic ? state.isPublic : false,
            belongsToFamilies: famIDs,
            address: state.address ? state.address : ''
        }
        console.log('Input to GQL creation mutation:', input)

        createArtefact({
            variables: input
        })
    }

    const saveChange = async event => {
        if (edit) {
            var input = {}

            if (!addressIsSearchResult) {
                handleUnselectedSearchField()
                return
            }

            if (beingEdited === 'belongsToFamiliesBools') {
                input['belongsToFamilies'] = Object.keys(
                    state.belongsToFamiliesBools
                ).filter(id => state.belongsToFamiliesBools[id])
            } else {
                input[beingEdited] = currValue
            }

            console.log('Input to GQL update mutation: input', input)

            updateArtefact({
                variables: {
                    id: artefact.id,
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

    const noErrors = !creationErrors
    const dataLoading = familiesLoading || statesLoading

    var mapStyle
    if (theme && theme.palette.type === 'dark') {
        mapStyle = 'mapbox://styles/mapbox/dark-v10?optimize=true'
    } else {
        mapStyle = 'mapbox://styles/mapbox/streets-v9?optimize=true'
    }

    const submitHandler = e => {
        e.preventDefault()
        create ? submitForm(e) : saveChange(e)
    }

    if (edit && dataLoading) {
        return <Loading />
    }

    return (
        <Fragment>
            <CssBaseline />
            <form onSubmit={submitHandler} className={classes.form}>
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
                            <Paper className={classes.paper}>
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
                                                state.belongsToFamiliesBools &&
                                                !state.belongsToFamiliesBools[
                                                    family.id
                                                ]
                                            ) {
                                                state.belongsToFamiliesBools[
                                                    family.id
                                                ] = false
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
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                            family.id
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
                                <Paper className={classes.paper}>
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
                            <Paper className={classes.paperTextWrapper}>
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
                                            // setState({
                                            //     ...state,
                                            //     address: e.target.value
                                            // })
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
                                        error={!!locationState.locationError}
                                        InputProps={{
                                            endAdornment: !view && (
                                                <IconButton
                                                    className={
                                                        classes.iconButton
                                                    }
                                                    aria-label='search'
                                                    id='search'
                                                    onClick={e =>
                                                        _handleGeocodeQuery(
                                                            state.address
                                                        )
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
                                        helperText={locationState.locationError}
                                    />
                                    <Popover
                                        id={
                                            queryResults.length
                                                ? 'results'
                                                : undefined
                                        }
                                        open={!!queryResults.length}
                                        anchorEl={document.getElementById(
                                            'address'
                                        )}
                                        onClose={e => setQueryResults([])}
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
                                                    <ListItemText
                                                        primary={
                                                            result.placeName
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Popover>

                                    {edit && beingEdited === 'address' && (
                                        <EditButtons />
                                    )}

                                    <Grid container style={{ marginTop: 1 }}>
                                        <Map
                                            className={classes.map}
                                            mapStyle={mapStyle}
                                            mapState={locationState.mapState}
                                            containerStyle={{
                                                height: '60vh',
                                                width: '100vw'
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
                        <Grid item xs={6}>
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
                                    _pushViewArtefactURL(artefact.id) &&
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

function Wrapped(props) {
    return (
        <Layout>
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
        </Layout>
    )
}

export default withRouter(Wrapped)
