import React, { useState, Fragment, useRef } from 'react'
import { useTheme } from '@material-ui/styles'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Grid,
    Paper,
    Container,
    IconButton
} from '@material-ui/core'
import HelpIcon from '@material-ui/icons/Help'
import { Map } from '../components'
import { artefactGeocodeQuery } from '../components/MapAPI'

import { GetFamiliesWrapper, Layout } from '../components'

import { GET_FAMILY_ARTEFACTS } from '../gqlQueriesMutations'
import { useQuery } from '@apollo/react-hooks'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    map: {
        position: 'relative'
    },
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
        margin: theme.spacing(1)
    },
    menuButton: {
        // margin: theme.spacing(2)
    }
}))

function MapView(props) {
    const theme = useTheme()
    const classes = useStyles()
    var defaultMapStyle = 'mapbox://styles/mapbox/streets-v9?optimize=true'
    if (theme.palette.type === 'dark') {
        defaultMapStyle = 'mapbox://styles/mapbox/dark-v10?optimize=true'
    }

    var { families, familiesLoading } = props
    const target = useRef(null)

    // initally query is run with invalid ID
    const [state, setState] = useState({
        family: { id: '-1' },
        mapStyle: defaultMapStyle
    })

    const [mapArtefacts, setMapArtefacts] = useState([])
    const getArtefactMapData = data => {
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
                        } else {
                            var mapArtefact = {
                                ...artefact,
                                popup: true,
                                center: response.results[0].mapState.center
                            }
                            return mapArtefact
                        }
                    })
                )
            }
        }
        Promise.all(promiseArr).then(result => setMapArtefacts(result))
    }

    useQuery(GET_FAMILY_ARTEFACTS, {
        variables: { id: state.family.id },
        onCompleted: getArtefactMapData,
        onError: error => console.log(error)
    })

    var artefacts = []

    const handleChange = event => {
        if (event.target.value === state.family) return

        if (event.target.name === 'family') {
            setMapArtefacts([])
        }
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    return (
        <Fragment>
            <Map
                className={classes.map}
                mapStyle={state.mapStyle}
                mapState={{ zoom: [2] }}
                containerStyle={{
                    height: '100vh',
                    width: '100vw'
                }}
                artefacts={mapArtefacts}
            />
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
                            <MenuItem
                                value={'mapbox://styles/mapbox/streets-v11'}
                            >
                                Streets
                            </MenuItem>
                            <MenuItem
                                value={'mapbox://styles/mapbox/outdoors-v11'}
                            >
                                Outdoors
                            </MenuItem>
                            <MenuItem
                                value={'mapbox://styles/mapbox/satellite-v9'}
                            >
                                Satellite
                            </MenuItem>
                            <MenuItem
                                value={'mapbox://styles/mapbox/light-v10'}
                            >
                                Light
                            </MenuItem>
                            <MenuItem value={'mapbox://styles/mapbox/dark-v10'}>
                                Dark
                            </MenuItem>
                        </TextField>
                    </Paper>
                </Grid>

                <IconButton
                    edge='start'
                    className={classes.menuButton}
                    color='inherit'
                    aria-label='menu'
                >
                    <HelpIcon />
                </IconButton>
            </Grid>
        </Fragment>
    )
}

export default props => (
    <Layout>
        <GetFamiliesWrapper {...props} child={MapView} />
    </Layout>
)
