import React, { useState, Fragment, useRef } from 'react'
import { useTheme } from '@material-ui/styles'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@material-ui/core'
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
        backgroundColor: 'transparent',
        margin: theme.spacing(1),
        minWidth: 120,
    }
}))

function MapView(props) {
    const theme = useTheme()
    const classes = useStyles()
    var mapStyle = 'mapbox://styles/mapbox/streets-v9?optimize=true'
    if (theme.palette.type === 'dark') {
        mapStyle = 'mapbox://styles/mapbox/dark-v10?optimize=true'
    }

    var { families, familiesLoading } = props
    const target = useRef(null)

    // initally query is run with invalid ID
    const [state, setState] = useState({
        value: {id: "-1"}
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
        variables: { id: state.value.id },
        onCompleted: getArtefactMapData,
        onError: error => console.log(error)
    })

    var artefacts = []

    const handleChange = event => {
        if (event.target.value === state.value) return
        setMapArtefacts([])
        setState({
            value: event.target.value,
        })
    }

    return (
        <Fragment>
            <Map
                className={classes.map}
                mapStyle={mapStyle}
                mapState={{ zoom: [2] }}
                containerStyle={{
                    height: '100vh',
                    width: '100vw'
                }}
                artefacts={mapArtefacts}
            />
            {!familiesLoading && (
                <TextField
                    className={classes.overlay}
                    label='Select Family'
                    variant='outlined'
                    value={state.value || {}}
                    select
                    onChange={handleChange}
                    SelectProps={{
                        autoWidth: true
                    }}
                >
                    {families.map(fam => (
                        <MenuItem value={fam} key={fam.id}>
                            {fam.familyName}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        </Fragment>
    )
}

export default props => (
    <Layout>
        <GetFamiliesWrapper {...props} child={MapView} />
    </Layout>
)
