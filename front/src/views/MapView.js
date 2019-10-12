import React, { useState } from 'react'
import { useTheme } from '@material-ui/styles'
import { Popover } from '@material-ui/core'
import { Loading, Map, geocodeQuery } from '../components'
import { artefactGeocodeQuery } from '../components/MapAPI'

import { GetFamiliesWrapper, Layout } from '../components'

import { GET_FAMILY_ARTEFACTS } from '../gqlQueriesMutations'
import { useLazyQuery } from '@apollo/react-hooks'

function MapView(props) {
    const theme = useTheme()
    var mapStyle = 'mapbox://styles/mapbox/streets-v9?optimize=true'
    if (theme.palette.type === 'dark') {
        mapStyle = 'mapbox://styles/mapbox/dark-v10?optimize=true'
    }

    const [getArtefacts, { called, loading, data }] = useLazyQuery(
        GET_FAMILY_ARTEFACTS
    )
    var { families, familiesLoading } = props
    if (families.length && !called) {
        getArtefacts({
            variables: { id: families[0].id }
        })
    }

    var artefacts = []
    const [mapArtefacts, setMapArtefacts] = useState([])
    const [init, setInit] = useState(false)

    if (data && data.family && !init) {
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
                                showPopup: true,
                                center: response.results[0].mapState.center
                            }
                            return mapArtefact
                        }
                    })
                )
            }
        }

        Promise.all(promiseArr).then(result => setMapArtefacts(result))
        setInit(true)
    }

    // process artefacts into { center, showPopup, <artefact card props> }
    return (
        <Map
            // className={classes.map}
            mapStyle={mapStyle}
            // mapState={locationState.mapState}
            containerStyle={{
                height: '100vh',
                width: '100vw'
            }}
            artefacts={mapArtefacts}
        />
    )
}

export default props => (
    <Layout>
        <GetFamiliesWrapper {...props} child={MapView} />
    </Layout>
)
