import React, { useContext, useState } from 'react';
import { withStyles, Button, CssBaseline, TextField, Grid, Typography, makeStyles, MenuItem } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListSubheader, ListItemText, Checkbox, Paper, FormHelperText, Switch } from '@material-ui/core';
import Layout from '../components/Layout';
import authContext from '../authContext';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { DropzoneArea } from 'material-ui-dropzone'

import { CREATE_ARTEFACT_MUTATION, GET_ARTEFACT_STATES_QUERY, GET_FAMILIES_QUERY} from '../gqlQueriesMutations'

const useStyles = makeStyles(theme => ({
    root: {
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
        // padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        textAlign: 'left'
    },
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        textAlign: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
        position: 'center'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
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
        xs: 12,
        textAlign: 'center'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    list: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
}));


export default function CreateArtefactView(props) {

    const classes = useStyles();

    const context = useContext(authContext);
    const username = context.user.username;

    const [artefactStates, setArtefactStates] = useState({})
    const [families, setFamilies] = useState([])

    const [artefactName, setArtefactName] = useState("")
    const [about, setAbout] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [artefactCondition, setArtefactCondition] = useState("")
    const [files, setFiles] = useState([])
    const [belongFamilyIds, setBelongFamilyIds] = useState({})

    const [artefactId, setArtefactId] = useState(-1)
    const [mutationErrors, setMutationErrors] = useState({})

    const _completed = async (data) => {
        const id = data.artefactCreate.artefact.id
        setArtefactId(id)
        props.history.push(`/artefacts/${id}`)
    }

    const _handleError = async (errors) => {
        console.log(errors);
        // TO DO
        setMutationErrors(errors)
    }

    const [createArtefact, { data }] = useMutation(
        CREATE_ARTEFACT_MUTATION, {
        onCompleted: _completed,
        onError: _handleError,
    }
    );

    const _saveFamilies = async familyData => {
        setFamilies(familyData.me.isMemberOf)
    }

    const { loading: familyLoading, error: familyError, data: familyData } = useQuery(
        GET_FAMILIES_QUERY,
        {
            onCompleted: _saveFamilies
        }
    )


    const handleToggle = id => event => {
        setBelongFamilyIds({ ...belongFamilyIds, [id]: event.target.checked })
    };

    const handlePublicToggle = event => {
        setIsPublic(event.target.checked)
    };

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

    const { loading: artefactsLoading, error: artefactsError, data: statesData } = useQuery(
        GET_ARTEFACT_STATES_QUERY,
        {
            variables: { "name": "ArtefactState" },
            onCompleted: _saveArtefactStates
        }
    )

    const submitForm = async (event) => {
        event.preventDefault();
        console.log("Artefact name: " + artefactName)
        console.log("About: " + about)
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
    const noMutErrors = (Object.keys(mutationErrors).length === 0)

    return (
        <Layout>
            <CssBaseline />
            <form className={classes.container} onSubmit={submitForm}>
                <Grid className={classes.gridContainer}>
                    <Grid className={classes.gridItem}>
                        <Typography variant="h4">
                            Create Artefact
                        </Typography>
                    </Grid>
                    <Grid className={classes.gridItem}>
                        <Typography variant="subtitle1">
                            Artefacts are belongings of the family, enter as much or as little detail as you like
                        </Typography>
                    </Grid>

                    <Grid className={classes.gridItem}>
                        <TextField
                            className={classes.root}
                            id="artefact-name"
                            label="Artefact name"
                            variant="outlined"
                            required
                            fullWidth
                            autoFocus
                            onChange={e => setArtefactName(e.target.value)}
                        />
                    </Grid>
                    <Grid className={classes.gridItem}>
                        <TextField
                            className={classes.root}                            
                            id="state"
                            label="Please select the state of the artefact"
                            variant="outlined"
                            required
                            fullWidth
                            value={artefactCondition}
                            onChange={e => setArtefactCondition(e.target.value)}
                            select
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            disabled={artefactsLoading}
                        >
                            {
                                Object.keys(artefactStates).map((value, index) => {
                                    return <MenuItem value={artefactStates[value]} key={value}>{value}</MenuItem>
                                })
                            }
                        </TextField>
                    </Grid>

                    <Grid className={classes.gridItem}>
                        <Paper className={classes.root}>
                            <List
                                subheader={<ListSubheader component='div'>Select privacy of artefact</ListSubheader>}
                            >
                                <ListItem role={undefined} dense button onClick={handlePublicToggle}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={isPublic}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={"Public"} />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>

                    <Grid className={classes.gridItem}>
                        <Paper className={classes.root}>
                            <List
                                subheader={<ListSubheader component='div'>Select which of your families the artefact belongs to</ListSubheader>}
                            >
                                {families.map(family => {
                                    return (
                                        <ListItem key={family.id} role={undefined} dense button onClick={handleToggle(family.id)}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={belongFamilyIds[family.id]}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={family.familyName} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Paper>
                    </Grid>

                    <Grid className={classes.gridItem}>
                        <TextField
                            className={classes.root}
                            id="about"
                            label="Tell people about your artefact"
                            variant="outlined"
                            required
                            fullWidth
                            multiline
                            rows={6}
                            value={about}
                            onChange={e => setAbout(e.target.value)}
                        />
                    </Grid>
                    <Grid className={classes.gridItem}>
                        <TextField
                            className={classes.root}
                            id="artefact-admin"
                            label="Artefact Admin"
                            variant="outlined"
                            required
                            fullWidth
                            defaultValue={username}
                            onChange={e => console.log("admin field was changed")}
                            disabled
                        />
                    </Grid>

                    <Grid className={classes.gridItem}>
                        <DropzoneArea onChange={files => setFiles(files)} />
                    </Grid>

                    <Grid className={classes.gridItem}>
                        <Button
                            name="create"
                            label="Create"
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={invalidInputs}
                        >
                            Create
                        </Button>
                        {
                            !noMutErrors &&
                            <FormHelperText error={!noMutErrors}>Unknown Error Occurred</FormHelperText>
                        }
                    </Grid>
                </Grid>
            </form>
        </Layout>

    );
}
