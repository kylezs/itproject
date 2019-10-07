import React, { Component, useState } from 'react'
import ReactMapGL from 'react-map-gl'

function Map(props) {
    const [state, setState] = useState({
        viewport: {
            width: props.width,
            height: 400,
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 8
        }
    })

    const onViewportChange = viewport => {
        var { curWidth, curHeight, ...etc } = viewport
        
        var { width, height } = props
        setState({
            viewport: {
                width: width,
                height: curHeight,
                ...etc
            }
        })
    }


    return (
        <ReactMapGL
            width='100vw'
            height='100vh'
            {...state.viewport}
            mapboxApiAccessToken={
                'pk.eyJ1IjoiemR1ZmZpZWxkIiwiYSI6ImNrMWdkODhpOTBiM28zZG03eDdjZ2dmN24ifQ.vAzlFYY5S9O82SKnwX69kQ'
            }
            onViewportChange={viewport => onViewportChange(viewport)}
        />
    )
}

export default Map
