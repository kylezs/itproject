import React from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

function MapContainer(props) {
    return (
        <Map
            google={props.google}
            zoom={8}
            style={props.mapStyles}
            initialCenter={{ lat: 47.444, lng: -122.176 }}
        >
            <Marker position={{ lat: 48.0, lng: -122.0 }} />
        </Map>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyB6gipDw3h3uEWebumYS-Iub9uoFw_00sc'
})(MapContainer)

