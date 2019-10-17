import React, { useContext, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import { CssBaseline, Grid } from '@material-ui/core'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'

import {
    Loading,
    geocodeQuery,
    artefactFamilyFormUseStyles
} from '../../components'

import {
    Title,
    Name,
    State,
    Description,
    Admin,
    Date,
    Privacy,
    Families,
    Images,
    FieldWrapper,
    Address,
    SuccessSnackbar,
    CreateButton
} from './components'
import authContext from '../../authContext'

import { Layout } from '../../components'
import {
    CREATE_ARTEFACT_MUTATION,
    UPDATE_ARTEFACT_MUTATION
} from '../../gqlQueriesMutations'

function ArtefactView(props) {
    // get the mode
    var { create, edit, view } = props
    var mode = { create: create, edit: edit, view: view }

    // get families, states, and artefact data
    var { statesLoading, familiesLoading, artefactLoading } = props
    var { artefactStates, families } = props

    // if viewing an existing artefact get the details (potentially unloaded)
    const context = useContext(authContext)
    const username = context.user.username
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
        console.log('Creation errors occurred:', errors)
    }
    const handleUpdateError = async errors => {
        console.log('Update errors occured: ', errors)
    }

    const [
        createArtefact,
        { error: creationErrors, loading: creationLoading }
    ] = useMutation(CREATE_ARTEFACT_MUTATION, {
        onCompleted: creationCompleted,
        onError: handleCreationError
    })

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

        var famIDs = []
        if (state.belongsToFamiliesBools) {
            famIDs = Object.keys(state.belongsToFamiliesBools).filter(
                id => state.belongsToFamiliesBools[id]
            )
        }

        var input = {
            name: state.name,
            description: state.description,
            state: state.state,
            isPublic: state.isPublic ? state.isPublic : false,
            belongsToFamilies: famIDs,
            address: state.address ? state.address : ''
        }
        if (state.date) {
            input.date = parseDate(state.date)
        }
        console.log('Input to GQL creation mutation:', input)

        createArtefact({
            variables: input
        })
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
            updateArtefact({
                variables: {
                    id: artefact.id,
                    artefactInput: input
                }
            })
        }
    }

    const noErrors = !creationErrors
    const dataLoading = familiesLoading || statesLoading

    // select the submit handler
    const submitHandler = e => {
        e.preventDefault()
        create ? submitForm(e) : saveChange(e)
    }

    if ((edit || view) && dataLoading) {
        return <Loading />
    }

    const editButtonProps = {
        save: saveChange,
        cancel: cancelEditing,
        updateErrors: updateErrors,
        classes: classes
    }

    const componentProps = {
        beingEdited: beingEdited,
        mode: mode,
        classes: classes,
        artefactStates: artefactStates,
        username: context.user.username,
        families: families,
        states: {
            state: state,
            locationState: locationState
        },
        setters: {
            handleSetField: handleSetField
        }
    }

    const addressProps = {
        ...componentProps,
        handleGeocodeQuery: handleGeocodeQuery,
        setters: {
            ...componentProps.setters,
            setLocationState: setLocationState,
            setAddressIsSearchResult: setAddressIsSearchResult,
            handleSetLocationResult: handleSetLocationResult
        }
    }

    const LeftPaneComponents = [
        { comp: Name, name: 'name' },
        { comp: State, name: 'state' },
        { comp: Description, name: 'description' },
        { comp: Admin, name: 'admin' },
        { comp: Date, name: 'date' }
    ]

    const RightPaneComponents = [
        { comp: Privacy, name: 'isPublic' },
        { comp: Families, name: 'belongsToFamiliesBools' },
        { comp: Images, name: 'files' }
    ]

    const Panes = [LeftPaneComponents, RightPaneComponents]

    return (
        <form onSubmit={submitHandler} className={classes.form}>
            <Grid container className={classes.outerContainer} spacing={1}>
                <Grid item xs={12} container justify='center'>
                    <Title mode={mode} classes={classes} />
                </Grid>

                {Panes.map(pane => (
                    <Grid item xs={12} sm={6} container spacing={1}>
                        {pane.map(({ comp, name }) => {
                            return (
                                <FieldWrapper
                                    child={comp}
                                    name={name}
                                    childProps={componentProps}
                                    editButtonProps={editButtonProps}
                                    classes={classes}
                                />
                            )
                        })}
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <FieldWrapper
                        child={Address}
                        name='address'
                        childProps={addressProps}
                        editButtonProps={editButtonProps}
                        classes={classes}
                    />
                </Grid>

                {create && (
                    <Grid item xs={5}>
                        <CreateButton noErrors={noErrors} />
                    </Grid>
                )}

                <SuccessSnackbar
                    open={snackbarOpen}
                    setOpen={setSnackbarOpen}
                    viewArtefact={pushViewArtefactURL}
                    classes={classes}
                    id={artefact ? artefact.id : '-1'}
                />
            </Grid>
        </form>
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
                        <CssBaseline />
                        <ArtefactView {...props} />
                    </Grid>
                </Grid>
            </MuiPickersUtilsProvider>
        </Layout>
    )
}

export default withRouter(Wrapped)
