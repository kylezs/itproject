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
    MenuItem
} from '@material-ui/core'
import {
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    ListItemText,
    Checkbox,
    Paper,
    FormHelperText
} from '@material-ui/core'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import authContext from '../authContext'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { DropzoneArea } from 'material-ui-dropzone'

import {
    CREATE_ARTEFACT_MUTATION,
    GET_ARTEFACT_STATES_QUERY,
    GET_FAMILIES_QUERY
} from '../gqlQueriesMutations'

const useStyles = makeStyles(theme => ({
    root: {
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        textAlign: 'left',
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
        marginTop: theme.spacing(3)
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

    const [artefactName, setArtefactName] = useState('')
    const [about, setAbout] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [artefactCondition, setArtefactCondition] = useState('')
    const [files, setFiles] = useState([])
    const [belongFamilyIds, setBelongFamilyIds] = useState({})
    const [admin, setAdmin] = useState({})

    const [beingEdited, setBeingEdited] = useState('')
    const [prevValue, setPrevValue] = useState({})

    const _genericHandleError = async errors => {
        console.log(errors)
    }

    const [initialised, setInitialised] = useState(false)

    const _setArtefactVars = () => {
        setArtefactName(props.artefact.name)
        setAbout(props.artefact.description)
        setIsPublic(props.artefact.isPublic)
        setArtefactCondition(props.artefact.state)
        setFiles(props.artefact.upload)

        var belong = {}
        props.artefact.belongsToFamilies.map(val => (belong[val.id] = true))
        setBelongFamilyIds(belong)

        setAdmin(props.artefact.admin)

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
        _setArtefactVars()
    }

    const _creationCompleted = async data => {
        const id = data.artefactCreate.artefact.id

        const { history } = props
        if (history) {
            history.push(`/artefacts/${id}`)
        }
    }

    const _handleCreationError = async errors => {
        // TO DO
        console.log(errors)
    }

    const [
        createArtefact,
        { error: creationErrors, loading: creationLoading }
    ] = useMutation(CREATE_ARTEFACT_MUTATION, {
        onCompleted: _creationCompleted,
        onError: _handleCreationError
    })

    const _saveFamilies = async data => {
        setFamilies(data.me.isMemberOf)
    }

    const {
        loading: familyLoading,
        error: familyErrors,
        data: familyData
    } = useQuery(GET_FAMILIES_QUERY, {
        onCompleted: _saveFamilies,
        onError: _genericHandleError
    })

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

    const handleSetField = (fieldName, event) => {
        var prev
        if (fieldName === 'name') {
            prev = artefactName
            setArtefactName(event.target.value)
        } else if (fieldName === 'condition') {
            prev = artefactCondition
            setArtefactCondition(event.target.value)
        } else if (fieldName === 'isPublic') {
            prev = isPublic
            setIsPublic(event.target.checked)
        } else if (fieldName === 'about') {
            prev = about
            setAbout(event.target.value)
        } else if (fieldName === 'families') {
            prev = belongFamilyIds
            // setting new value is handled separately
        } else {
            console.log('unknown field was changed and not handled')
        }

        if (edit && beingEdited !== fieldName) {
            setBeingEdited(fieldName)
            setPrevValue(prev)
        }
    }

    const handleFamiliesToggle = id => event => {
        setBelongFamilyIds({ ...belongFamilyIds, [id]: event.target.checked })
        handleSetField('families', event)
    }

    const cancelEditing = () => {
        if (beingEdited === 'name') {
            setArtefactName(prevValue)
        } else if (beingEdited === 'condition') {
            setArtefactCondition(prevValue)
        } else if (beingEdited === 'isPublic') {
            setIsPublic(prevValue)
        } else if (beingEdited === 'about') {
            setAbout(prevValue)
        } else if (beingEdited === 'families') {
            setBelongFamilyIds(prevValue)
        }
        setBeingEdited('')
    }

    const submitForm = async event => {
        event.preventDefault()
        createArtefact({
            variables: {
                name: artefactName,
                description: about,
                state: artefactCondition,
                isPublic: isPublic,
                families: belongFamilyIds
            }
        })
    }

    const invalidInputs = !artefactName || !artefactCondition || !about
    const noErrors = !familyErrors && !creationErrors && !statesErrors
    const dataLoading = familyLoading || statesLoading

    function SaveButton() {
        return (
            <Button
                variant='contained'
                color='primary'
                className={classes.button}
            >
                Save (WIP)
            </Button>
        )
    }

    function CancelButton() {
        return (
            <Button
                variant='contained'
                color='primary'
                className={classes.button}
                onClick={cancelEditing}
            >
                Cancel
            </Button>
        )
    }

    function EditButtons() {
        return (
            <Fragment>
                <Grid item xs={3}>
                    <SaveButton />
                </Grid>
                <Grid item xs={3}>
                    <CancelButton />
                </Grid>
            </Fragment>
        )
    }

    if (edit && dataLoading) {
        return <Loading />
    }

    return (
        <Layout>
            <CssBaseline />
            <form onSubmit={submitForm}>
                <Container maxWidth={'md'}>
                    <Grid
                        container
                        spacing={1}
                        direction='row'
                        alignItems='center'
                        justify='center'
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
                                    value={artefactName}
                                    onChange={e => handleSetField('name', e)}
                                    disabled={
                                        edit &&
                                        !!beingEdited &&
                                        beingEdited !== 'name'
                                    }
                                />
                            </Paper>
                        </Grid>

                        {edit && beingEdited === 'name' && <EditButtons />}

                        <Grid item xs={12}>
                            <Paper className={classes.root}>
                                <TextField
                                    className={classes.root}
                                    id='state'
                                    label='Please select the state of the artefact'
                                    variant='outlined'
                                    required
                                    fullWidth
                                    value={artefactCondition}
                                    onChange={e =>
                                        handleSetField('condition', e)
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
                                        beingEdited !== 'condition'
                                    }
                                >
                                    {Object.keys(artefactStates).map(value => {
                                        return (
                                            <MenuItem
                                                value={artefactStates[value]}
                                                key={value}
                                            >
                                                {value}
                                            </MenuItem>
                                        )
                                    })}
                                </TextField>
                            </Paper>
                        </Grid>

                        {edit && beingEdited === 'condition' && <EditButtons />}

                        <Grid item xs={12}>
                            <Paper className={classes.root}>
                                <List
                                    subheader={
                                        <ListSubheader component='div'>
                                            Select privacy of artefact
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
                                                checked={isPublic}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={'Public'} />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>

                        {edit && beingEdited === 'isPublic' && <EditButtons />}

                        <Grid item xs={12}>
                            <Paper className={classes.root}>
                                <List
                                    subheader={
                                        <ListSubheader component='div'>
                                            Select which of your families the
                                            artefact belongs to
                                        </ListSubheader>
                                    }
                                >
                                    {families.map(family => {
                                        if (!belongFamilyIds[family.id]) {
                                            belongFamilyIds[family.id] = false
                                        }

                                        return (
                                            <ListItem
                                                key={family.id}
                                                role={undefined}
                                                dense
                                                button
                                                onClick={handleFamiliesToggle(
                                                    family.id
                                                )}
                                                disabled={
                                                    edit &&
                                                    !!beingEdited &&
                                                    beingEdited !== 'families'
                                                }
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge='start'
                                                        checked={
                                                            belongFamilyIds[
                                                                family.id
                                                            ]
                                                        }
                                                        tabIndex={-1}
                                                        disableRipple
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={family.familyName}
                                                />
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Paper>
                        </Grid>

                        {edit && beingEdited === 'families' && <EditButtons />}

                        <Grid item xs={12}>
                            <Paper className={classes.root}>
                                <TextField
                                    className={classes.root}
                                    id='about'
                                    label='Tell people about your artefact'
                                    variant='outlined'
                                    required
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={about}
                                    onChange={e => handleSetField('about', e)}
                                    disabled={
                                        edit &&
                                        !!beingEdited &&
                                        beingEdited !== 'about'
                                    }
                                />
                            </Paper>
                        </Grid>

                        {edit && beingEdited === 'about' && <EditButtons />}

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
                                        Object.keys(admin).length !== 0
                                            ? admin.username
                                            : context.user.username
                                    }
                                    onChange={e =>
                                        console.log('admin field was changed')
                                    }
                                    disabled
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className={classes.root}>
                                <DropzoneArea
                                    onChange={files => setFiles(files)}
                                />
                            </Paper>
                        </Grid>

                        {create && (
                            <Grid item xs={12}>
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
                </Container>
            </form>
        </Layout>
    )
}

export default withRouter(ArtefactView)
