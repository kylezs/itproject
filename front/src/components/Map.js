import React, { Fragment, useState } from 'react'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
import { MY_ACCESS_TOKEN } from '../constants'
import ArtefactCard from '../components/ArtefactCard'
import { useTheme } from '@material-ui/styles'

const Mapbox = ReactMapboxGl({
    accessToken: MY_ACCESS_TOKEN,
    interactive: true,
    attributionControl: false,
    maxZoom: 18,
    minZoom: 2
})

export default function Map(props) {
    const theme = useTheme()
    var artefacts = props.artefacts
    if (!artefacts) artefacts = []

    const [openArtefactID, setOpenArtefactID] = useState('')

    return (
        <Mapbox
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
                var { center, popup, ...rest } = artefact
                if (!center || !center.length) {
                    return
                }
                var artefactID = artefact.id
                return (
                    <Fragment key={artefactID}>
                        <Marker
                            coordinates={center}
                            onClick={e => setOpenArtefactID(artefactID)}
                        >
                            <img
                                src={
                                    'http://maps.google.com/mapfiles/ms/icons/red.png'
                                }
                                alt='marker-img'
                            />
                        </Marker>
                        {popup && openArtefactID === artefactID && (
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
