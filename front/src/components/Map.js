import React, { Fragment, useState } from 'react'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
import { MY_ACCESS_TOKEN } from '../constants'
import ArtefactCard from '../components/ArtefactCard'
import { makeStyles } from '@material-ui/core/styles'
import './popup.css'

const useStyles = makeStyles(theme => ({
    popup: {
        zIndex: '50 !important',
        minWidth: '300px'
    }
}))

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
    const classes = useStyles()

    const MapType = props.interactive ? InteractiveMapbox : Mapbox
    var artefacts = props.artefacts
    if (!artefacts) artefacts = []

    const [openArtefactID, setOpenArtefactID] = useState('')

    const handleSetOpenArtefact = id => {
        if (openArtefactID === id) {
            setOpenArtefactID('')
        } else {
            setOpenArtefactID(id)
        }
    }

    const onMapClick = () => {
        handleSetOpenArtefact('')
        if (props.onClick) {
            props.onClick()
        }
    }

    return (
        <MapType
            style={
                props.mapStyle
                    ? props.mapStyle
                    : 'mapbox://styles/mapbox/streets-v9?optimize=true'
            }
            containerStyle={props.containerStyle}
            {...props.mapState}
            onClick={onMapClick}
        >
            {artefacts.map(artefact => {
                var { center, popup, initPopupOpen, id } = artefact
                if (initPopupOpen) {
                    artefact.initPopupOpen = false
                    setOpenArtefactID(id)
                }
                if (!center || !center.length) {
                    return null
                }
                return (
                    <Fragment key={id}>
                        <Marker
                            coordinates={center}
                            onClick={e => handleSetOpenArtefact(id)}
                        >
                            <img
                                src={
                                    'http://maps.google.com/mapfiles/ms/icons/red.png'
                                }
                                alt='marker-img'
                            />
                        </Marker>
                        {popup && openArtefactID === id && (
                            <Popup
                                coordinates={center}
                                offset={{
                                    'bottom-left': [12, -38],
                                    bottom: [0, -38],
                                    'bottom-right': [-12, -38]
                                }}
                                className={classes.popup}
                            >
                                <ArtefactCard artefact={artefact} />
                            </Popup>
                        )}
                    </Fragment>
                )
            })}
        </MapType>
    )
}
