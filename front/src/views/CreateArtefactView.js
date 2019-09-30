import React, { useContext, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import authContext from '../authContext';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import { DropzoneArea } from 'material-ui-dropzone'
import MenuItem from '@material-ui/core/MenuItem';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import CommentIcon from '@material-ui/icons/Comment';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '50%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

// Get the id back to allow for querying for the artefact later
const CREATE_ARTEFACT_MUTATION = gql`
mutation CreateArtefactMutation($name: String!, $state: String!, $isPublic: Boolean!, $description: String!, $families: [ID]){
    artefactCreate(input: {
        name: $name
        state: $state
        description: $description
        isPublic: $isPublic
        belongsToFamily: $families
    })
    {
        artefact {
            id
        }
    }
}
`

const GET_ARTEFACT_STATES_QUERY = gql`
query ArtefactStatesQuery($name: String!){
    __type(name: $name){
        enumValues{
            name
            description
        }
    }
}
`

const LIST_OF_FAMILIES = gql`
query artefactsQuery{
  me {
    isMemberOf {
      familyName
      id
    }
  }
}
`

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

export default function CreateArtefactView (props) {

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
    const [belongFamilyIds, setBelongFamilyIds] = useState([])
    
    const [artefactId, setArtefactId] = useState(-1)
    
    const [anchorEl, setAnchorEl] = React.useState(null);

    const _completed = async (data) => {
        const id = data.artefactCreate.artefact.id
        setArtefactId(id)
        props.history.push(`/artefacts/${id}`)
    }

    const _handleError = async (errors) => {
        console.log(errors);
        // TO DO
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
        LIST_OF_FAMILIES,
        {
            onCompleted: _saveFamilies
        }
    )


    const handleToggle = id => () => {
        var ids = [...belongFamilyIds]
        if (ids.includes(id)){
            var index = ids.indexOf(id)
            ids.splice(index, 1)
            setBelongFamilyIds(ids)
        } else {
            setBelongFamilyIds([...belongFamilyIds, id])
        }
    };

    const _saveArtefactStates = async statesData => {
        var temp = {}
        var desc
        var state
        for (var i in statesData.__type.enumValues){
            state = statesData.__type.enumValues[i]
            desc = state.description
            temp[desc] = state.name
        }
        setArtefactStates(temp)
    }

    const {loading: artefactsLoading, error: artefactsError, data: statesData} = useQuery(
        GET_ARTEFACT_STATES_QUERY, 
        {
            variables: {"name": "ArtefactState"},
            onCompleted: _saveArtefactStates
        }
    )

    const submitForm = async (event) => {
        event.preventDefault();
        console.log("Artefact name: " + artefactName)
        console.log("About: " + about)
        createArtefact({variables: {
            name: artefactName,
            description: about,
            state: artefactCondition,
            isPublic: isPublic,
            families: belongFamilyIds
        }})
    }

    const validInputs = !artefactName || !artefactCondition;
    
    return (
        <Layout>
            <h1>Create an Artefact</h1>
            <p>$$ Description of what you should enter about an artefact $$ </p>

            <CssBaseline />
            <div className={classes.paper}>
                <form className={classes.form} onSubmit={submitForm}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5">
                                Create Artefact
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="artefact-name"
                                label="Artefact name"
                                autoFocus
                                onChange={e => setArtefactName(e.target.value)}
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="state"
                                label="Please select the state of the artefact"
                                select
                                className={classes.textField}
                                value={artefactCondition}
                                onChange={e => setArtefactCondition(e.target.value)}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                >
                                {
                                    Object.keys(artefactStates).map((value, index) => {
                                        return <MenuItem value={artefactStates[value]} key={value}>{value}</MenuItem>
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="public"
                                label="Is this artefact for public viewing?"
                                select
                                className={classes.textField}
                                value={isPublic}
                                onChange={e => setIsPublic(e.target.value)}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                >
                                {
                                    [true, false].map((value, index) => {
                                        return <MenuItem value={value} key={value}>{value ? "Public" : "Not Public"}</MenuItem>
                                    })
                                }
                            </TextField>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <List 
                                className={classes.root}
                                subheader={<ListSubheader>Select families for the artefact to belong to</ListSubheader>}
                            >
                                {families.map(family => {
                                    const labelId = `checkbox-list-label-${family.id}`;
                                    const isChecked = [...belongFamilyIds].includes(family.id)

                                    return (
                                        <ListItem key={family.id} role={undefined} dense button onClick={handleToggle(family.id)}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={isChecked}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={family.familyName} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                multiline
                                rows={6}
                                fullWidth
                                value={about}
                                id="about"
                                label="Tell people about your artefact"
                                onChange={e => setAbout(e.target.value)}
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                disabled
                                defaultValue={username}
                                fullWidth
                                id="artefact-admin"
                                label="Artefact Admin"
                                onChange={e => console.log("hello")}
                                />
                        </Grid>

                        <Grid item xs={12}>
                            <DropzoneArea onChange={files => setFiles(files)}/>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                name="create"
                                label="Create"
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={validInputs}
                                >
                                Create
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </div>
        </Layout>

    );
}
