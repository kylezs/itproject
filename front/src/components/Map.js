import React, { Fragment } from 'react'
import ReactMapboxGl, { Layer, Feature, Marker, Popup } from 'react-mapbox-gl'
import { MY_ACCESS_TOKEN } from '../constants'
import ArtefactCard from '../components/ArtefactCard'

const Mapbox = ReactMapboxGl({
    accessToken: MY_ACCESS_TOKEN,
    interactive: true,
    attributionControl: false,
    maxZoom: 18
})

export default function Map(props) {
    var artefacts = props.artefacts
    if (!artefacts) artefacts = []

    return (
        <Mapbox
            style={
                props.mapStyle
                    ? props.mapStyle
                    : 'mapbox://styles/mapbox/streets-v9?optimize=true'
            }
            containerStyle={props.containerStyle}
            {...props.mapState}
        >
            {artefacts.map(artefact => {
                var { center, showPopup, ...rest } = artefact

                if (!center || !center.length) {
                    return
                }
                return (
                    <Fragment key={artefact.id}>
                        <Marker coordinates={center}>
                            <img
                                src={
                                    'http://maps.google.com/mapfiles/ms/icons/red.png'
                                }
                                alt='marker-img'
                            />
                        </Marker>

                        {showPopup && (
                            <Popup
                                coordinates={center}
                                offset={{
                                    'bottom-left': [12, -38],
                                    bottom: [0, -38],
                                    'bottom-right': [-12, -38]
                                }}
                            >
                                <ArtefactCard {...rest} />
                            </Popup>
                        )}
                    </Fragment>
                )
            })}
        </Mapbox>
    )
}
