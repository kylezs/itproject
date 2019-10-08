import React, { Component, useState } from 'react'
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl'

const Mapbox = ReactMapboxGl({
    accessToken:
        'pk.eyJ1IjoiemR1ZmZpZWxkIiwiYSI6ImNrMWdkODhpOTBiM28zZG03eDdjZ2dmN24ifQ.vAzlFYY5S9O82SKnwX69kQ'
})

function Map(props) {
    const [coord, setCoord] = useState({
        lat: 10,
        lng: 10
    })

    const set = (map, e) => {
        var newCoord = { lng: e.lngLat.lng, lat: e.lngLat.lat }
        setCoord(newCoord)
    }

    const containerStyle = {
        height: '60vh',
        width: props.width - props.padding
    }
    return (
        <Mapbox
            style={
                props.style
                    ? props.style
                    : 'mapbox://styles/mapbox/streets-v9?optimize=true'
            }
            containerStyle={props.width ? containerStyle : {}}
            onClick={(map, e) => set(map, e)}
        >
            <Layer
                type='symbol'
                id='marker'
                layout={{
                    'icon-image': 'dot-11',
                    'icon-size': 4
                }}
            >
                <Feature coordinates={[coord.lng, coord.lat]} />
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
