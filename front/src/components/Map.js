import React, { useState } from 'react'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
// import RoomIcon from '@material-ui/icons/Room'
import { MY_ACCESS_TOKEN } from '../constants'

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingService = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN })

export const geocodeQuery = query => {
    return geocodingService
        .forwardGeocode({
            query: query,
            limit: 1,
            types: ['address', 'place']
        })
        .send()
        .then(
            response => {
                var result = {}
                console.log('GEOCODING RESPONSE: ', response.body)
                const feature = response.body.features[0]
                if (!feature) {
                    result.noResults = true
                    return result
                }
                if (feature.place_type[0] === 'place') {
                    const bboxCoords = feature.bbox
                    const bbox = [
                        [bboxCoords[0], bboxCoords[1]],
                        [bboxCoords[2], bboxCoords[3]]
                    ]
                    result.mapState = {
                        fitBounds: bbox
                    }
                } else if (feature.place_type[0] === 'address') {
                    result.mapState = {
                        center: feature.center,
                        zoom: [15]
                    }
                }
                result.place_name = feature.placeName
                return result
            },
            error => {
                var result = {}
                console.log(error)
                result.error = error
                return result
            }
        )
}

const Mapbox = ReactMapboxGl({
    accessToken: MY_ACCESS_TOKEN,
    interactive: true,
    attributionControl: false,
    maxZoom: 18
})

export default function Map(props) {
    const [mapState, setMapState] = useState({})
    
    const setCenter = coord => {
        setMapState({ ...mapState, center: coord })
        props.setCoord(coord)
    }

    const setMarker = (map, e) => {
        var newCoord = [e.lngLat.lng, e.lngLat.lat]
        setCenter(newCoord)
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
            {...props.mapState}
        >
            <Layer
                type='symbol'
                id='marker'
                layout={{
                    'icon-image': 'dot-11',
                    'icon-size': 4
                }}
            >
                {mapState.center && <Feature coordinates={mapState.center} />}
            </Layer>

            {/* <Marker coordinates={[coord.lng, coord.lat]} anchor='bottom'>
                <img
                    src={'http://maps.google.com/mapfiles/ms/icons/blue.png'}
                />
            </Marker> */}
        </Mapbox>
    )
}
