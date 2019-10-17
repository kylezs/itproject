import React, { Fragment, useState } from 'react'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
import { MY_ACCESS_TOKEN } from '../constants'
import ArtefactCard from '../components/ArtefactCard'

const mapProps = {
    accessToken: MY_ACCESS_TOKEN,
    attributionControl: false,
    maxZoom: 18,
    minZoom: 2
}
const Mapbox = ReactMapboxGl({
    ...mapProps,
    interactive: false
})

const InteractiveMapbox = ReactMapboxGl({
    ...mapProps,
    interactive: true
})

export default function Map(props) {
    const MapType = props.interactive ? InteractiveMapbox : Mapbox
    var artefacts = props.artefacts
    if (!artefacts) artefacts = []

    const [openArtefactID, setOpenArtefactID] = useState('')

    return (
        <MapType
            style={
                props.mapStyle
                    ? props.mapStyle
                    : 'mapbox://styles/mapbox/streets-v9?optimize=true'
            }
            containerStyle={props.containerStyle}
            {...props.mapState}
            onClick={e => setOpenArtefactID('')}
        >
            {artefacts.map(artefact => {
                var { center, popup, initPopupOpen, ...rest } = artefact
                if (!center || !center.length) {
                    return null
                }
                var artefactID = artefact.id
                return (
                    <Fragment key={artefactID}>
                        <Marker
                            coordinates={center}
                            onClick={e => {
                                if (openArtefactID === artefactID) {
                                    setOpenArtefactID('')
                                } else {
                                    setOpenArtefactID(artefactID)
                                }
                                if (artefact.initPopupOpen){
                                    artefact.initPopupOpen = false
                                }
                            }}
                        >
                            <img
                                src={
                                    'http://maps.google.com/mapfiles/ms/icons/red.png'
                                }
                                alt='marker-img'
                            />
                        </Marker>
                        {popup &&
                            (openArtefactID === artefactID ||
                                initPopupOpen) && (
                                <Popup
                                    coordinates={center}
                                    offset={{
                                        'bottom-left': [12, -38],
                                        bottom: [0, -38],
                                        'bottom-right': [-12, -38]
                                    }}
                                    // style={{color: '#000000'}}
                                >
                                    <ArtefactCard {...rest} />
                                </Popup>
                            )}
                    </Fragment>
                )
            })}
        </MapType>
    )
}
