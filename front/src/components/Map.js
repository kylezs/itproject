import React, { useState } from 'react'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
// import RoomIcon from '@material-ui/icons/Room'
import { MY_ACCESS_TOKEN } from '../constants'

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingService = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN })

const Mapbox = ReactMapboxGl({
    accessToken: MY_ACCESS_TOKEN,
    interactive: true,
    attributionControl: false,
    maxZoom: 18
})

function Map(props) {
    const [query, setQuery] = useState('')
    const [state, setState] = useState({})

    if (props.location && props.location !== query) {
        setQuery(props.location)
        geocodingService
            .forwardGeocode({
                query: props.location,
                limit: 2,
                types: ['address', 'place']
            })
            .send()
            .then(
                response => {
                    console.log('GEOCODING RESPONSE: ', response.body)
                    const feature = response.body.features[0]
                    if (feature.place_type[0] === 'place') {
                        const bboxCoords = feature.bbox
                        const bbox = [
                            [bboxCoords[0], bboxCoords[1]],
                            [bboxCoords[2], bboxCoords[3]]
                        ]
                        setState({
                            fitBounds: bbox
                        })
                    } else if (feature.place_type[0] === 'address') {
                        setState({
                            center: feature.center,
                            zoom: [15]
                        })
                    }
                    props.setLocation(feature.place_name)
                },
                error => {
                    console.log(error)
                    props.setErrors(error)
                }
            )
    }

    const setMarker = (map, e) => {
        var newCoord = [e.lngLat.lng, e.lngLat.lat]
        setState({ center: newCoord })
    }

    const containerStyle = {
        height: '60vh',
        width: '100vw'
    }

    return (
        <Mapbox
            style={
                props.style
                    ? props.style
                    : 'mapbox://styles/mapbox/streets-v9?optimize=true'
            }
            containerStyle={containerStyle}
            onClick={(map, e) => setMarker(map, e)}
            {...state}
        >
            <Layer
                type='symbol'
                id='marker'
                layout={{
                    'icon-image': 'dot-11',
                    'icon-size': 4
                }}
            >
                {state.center && <Feature coordinates={state.center} />}
            </Layer>

            {/* <Marker coordinates={[coord.lng, coord.lat]} anchor='bottom'>
                <img
                    src={'http://maps.google.com/mapfiles/ms/icons/blue.png'}
                />
            </Marker> */}
        </Mapbox>
    )
}

export default Map
