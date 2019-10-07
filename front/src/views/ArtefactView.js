import React, { useContext, useState, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import {
    Container,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    makeStyles,
    MenuItem,
    Snackbar,
    IconButton
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import {
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    ListItemText,
    Checkbox,
    Paper,
    FormHelperText,
    ClickAwayListener
} from '@material-ui/core'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import authContext from '../authContext'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { DropzoneArea } from 'material-ui-dropzone'

import {
    CREATE_ARTEFACT_MUTATION,
    GET_ARTEFACT_STATES_QUERY,
    GET_FAMILIES_QUERY,
    UPDATE_ARTEFACT_MUTATION
} from '../gqlQueriesMutations'

const useStyles = makeStyles(theme => ({
    root: {
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        marginTop: theme.spacing(1)
    },
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        textAlign: 'center'
    },
    form: {
        width: '60%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
        backgrounColor: theme.palette.common.dark,
        justify: 'center'
    },
    container: {
        width: '60%', // Fix IE 11 issue.
        display: 'flex',
        flexWrap: 'wrap',
        direction: 'column',
        alignItems: 'center',
        justify: 'center'
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    gridContainer: {
        // alignContent: 'center',
        container: true,
        spacing: 2,
        marginTop: 10,
        marginBottom: 10,
        padding: 20
    },
    gridItem: {
        // alignItems: 'center',
        item: true,
        marginTop: 10,
        marginBottom: 10,
        xs: 6,
        textAlign: 'center'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    list: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1)
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

    const classes = useStyles()

    const context = useContext(authContext)

    const [artefactStates, setArtefactStates] = useState({})
    const [families, setFamilies] = useState([])

    const [state, setState] = useState({
        name: '',
        description: '',
        isPublic: false,
        state: '',
        upload: [],
        admin: '',
        belongsToFamiliesBools: {}
    })
    const [initialised, setInitialised] = useState(false)

    const [beingEdited, setBeingEdited] = useState('')
    const [prevValue, setPrevValue] = useState({})
    const [currValue, setCurrValue] = useState({})
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const _genericHandleError = async errors => {
        console.log(errors)
    }

    const _setArtefactVars = artefact => {
        var belong = {}
        artefact.belongsToFamilies.map(val => (belong[val.id] = true))

        setState({ ...artefact, belongsToFamiliesBools: belong })
        setInitialised(true)
    }

    // if in edit mode (but not in create mode) load in data for the artefact
    if (
        !initialised &&
        !create &&
        edit &&
        props.artefact &&
        Object.keys(props.artefact).length !== 0
    ) {
        _setArtefactVars(props.artefact)
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
        console.log('Update error occured: ', errors)
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

    const [
        updateArtefact,
        { error: updateErrors, loading: updateLoading }
    ] = useMutation(UPDATE_ARTEFACT_MUTATION, {
        onCompleted: _updateCompleted,
        onError: _handleUpdateError
    })

    const _saveFamilies = async data => {
        setFamilies(data.me.isMemberOf)
    }

    const { loading: familyLoading, error: familyErrors } = useQuery(
        GET_FAMILIES_QUERY,
        {
            onCompleted: _saveFamilies,
            onError: _genericHandleError
        }
    )

    const _saveArtefactStates = async statesData => {
        var temp = {}
        var desc
        var state
        for (var i in statesData.__type.enumValues) {
            state = statesData.__type.enumValues[i]
            desc = state.description
            temp[desc] = state.name
        }
        setArtefactStates(temp)
    }

    const { loading: statesLoading, error: statesErrors } = useQuery(
        GET_ARTEFACT_STATES_QUERY,
        {
            variables: { name: 'ArtefactState' },
            onCompleted: _saveArtefactStates,
            onError: _genericHandleError
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

    const handleSetField = (fieldName, event, famId) => {
        var value = event.target.value
        if (fieldName === 'isPublic') {
            value = event.target.checked
        } else if (fieldName === 'belongsToFamiliesBools') {
            value = {
                ...state.belongsToFamiliesBools,
                [famId]: event.target.checked
            }
        }
        setField(fieldName, value)
        setCurrValue(value)
        if (edit && beingEdited !== fieldName) {
            setBeingEdited(fieldName)
        }
    }

    const cancelEditing = () => {
        setField(beingEdited, prevValue)
        setBeingEdited('')
    }

    const submitForm = async event => {
        event.preventDefault()
        var famIDs = Object.keys(state.belongsToFamiliesBools).filter(
            id => state.belongsToFamiliesBools[id]
        )
        var input = {
            name: state.name,
            description: state.description,
            state: state.state,
            isPublic: state.isPublic,
            belongsToFamilies: famIDs
        }
        console.log(input)

        createArtefact({
            variables: input
        })
    }

    const saveChange = async event => {
        event.preventDefault()
        if (edit) {
            var input = {}

            if (beingEdited === 'belongsToFamiliesBools') {
                input['belongsToFamilies'] = Object.keys(
                    state.belongsToFamiliesBools
                ).filter(id => state.belongsToFamiliesBools[id])
            } else {
                input[beingEdited] = currValue
            }

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
            >
                Cancel
            </Button>
        )
    }

    function EditButtons() {
        return (
            <Grid container justify='space-evenly'>
                <Grid item xs={6}>
                    <Grid container>
                        <SaveButton />
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container>
                        <CancelButton />
                    </Grid>
                </Grid>

                {updateErrors && (
                    <FormHelperText error>Error Occurred</FormHelperText>
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

    const invalidInputs = !state.name || !state.state || !state.description
    const noErrors = !familyErrors && !creationErrors && !statesErrors
    const dataLoading = familyLoading || statesLoading

    if (edit && dataLoading) {
        return <Loading />
    }

    return (
        <Layout>
            <CssBaseline />
            <form onSubmit={create ? submitForm : saveChange}>
                <Grid
                    container
                    spacing={2}
                    direction='row'
                    alignItems='stretch'
                    alignContent='stretch'
                    justify='space-evenly'
                >
                    <Grid item xs={12}>
                        <Paper className={classes.root}>
                            <Typography variant='h4'>
                                {create ? 'Create' : 'Edit'} Artefact
                            </Typography>
                            <Typography variant='subtitle1'>
                                {create
                                    ? 'Artefacts are belongings of the family, enter as much or as little detail as you like'
                                    : 'Click to start editing'}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Left Pane */}
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={1} alignContent='stretch'>
                            <Grid item xs={12}>
                                <Paper className={classes.root}>
                                    <TextField
                                        className={classes.root}
                                        id='artefact-name'
                                        label='Artefact name'
                                        variant='outlined'
                                        required
                                        fullWidth
                                        autoFocus
                                        value={state.name}
                                        onChange={e =>
                                            handleSetField('name', e)
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
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.root}>
                                    <TextField
                                        className={classes.root}
                                        id='state'
                                        label='Artefact State'
                                        variant='outlined'
                                        required
                                        fullWidth
                                        value={state.state}
                                        onChange={e =>
                                            handleSetField('state', e)
                                        }
                                        select
                                        SelectProps={{
                                            MenuProps: {
                                                className: classes.menu
                                            }
                                        }}
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
                                                            artefactStates[
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
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.root}>
                                    <TextField
                                        className={classes.root}
                                        id='description'
                                        label='Description'
                                        variant='outlined'
                                        required
                                        fullWidth
                                        multiline
                                        rows={6}
                                        value={state.description}
                                        onChange={e =>
                                            handleSetField('description', e)
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
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.root}>
                                    <TextField
                                        className={classes.root}
                                        id='artefact-admin'
                                        label='Artefact Admin'
                                        variant='outlined'
                                        required
                                        fullWidth
                                        value={
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
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Right Pane */}
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={1} alignItems='stretch'>
                            <Grid item xs={12}>
                                <Paper className={classes.root}>
                                    <List
                                        subheader={
                                            <ListSubheader component='div'>
                                                Privacy
                                            </ListSubheader>
                                        }
                                    >
                                        <ListItem
                                            role={undefined}
                                            dense
                                            button
                                            onClick={e =>
                                                handleSetField('isPublic', e)
                                            }
                                            disabled={
                                                edit &&
                                                !!beingEdited &&
                                                beingEdited !== 'isPublic'
                                            }
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge='start'
                                                    checked={state.isPublic}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={'Public'} />
                                        </ListItem>
                                    </List>

                                    {edit && beingEdited === 'isPublic' && (
                                        <EditButtons />
                                    )}
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.root}>
                                    <List
                                        subheader={
                                            <ListSubheader component='div'>
                                                Select which of your families
                                                the artefact belongs to
                                            </ListSubheader>
                                        }
                                    >
                                        {families.map(family => {
                                            if (
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
                                                    role={undefined}
                                                    dense
                                                    button
                                                    onClick={e =>
                                                        handleSetField(
                                                            'belongsToFamiliesBools',
                                                            e,
                                                            family.id
                                                        )
                                                    }
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
                                                                state
                                                                    .belongsToFamiliesBools[
                                                                    family.id
                                                                ]
                                                            }
                                                            tabIndex={-1}
                                                            disableRipple
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
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.root}>
                                    <DropzoneArea
                                        onChange={e =>
                                            handleSetField('upload', e)
                                        }
                                        disabled={
                                            edit &&
                                            !!beingEdited &&
                                            beingEdited !== 'upload'
                                        }
                                    />
                                </Paper>
                            </Grid>
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
        </Layout>
    )
}

export default withRouter(ArtefactView)
