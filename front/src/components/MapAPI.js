import { MY_ACCESS_TOKEN } from '../constants'
// import { geocodeQuery } from '.'
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingService = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN })

const _handleResponse = response => {
    var out = {}
    // console.log('GEOCODING RESPONSE: ', response.body)
    const features = response.body.features
    if (!features) {
        out.noResults = true
        return out
    }
    var results = []
    for (var i = 0; i < features.length; i++) {
        var feature = features[i]
        var result = {}
        result.mapState = { center: feature.center }

        if (feature.place_type[0] === 'place') {
            const bboxCoords = feature.bbox
            const bbox = [
                [bboxCoords[0], bboxCoords[1]],
                [bboxCoords[2], bboxCoords[3]]
            ]
            result.mapState.fitBounds = bbox
        } else if (feature.place_type[0] === 'address') {
            result.mapState.zoom = [15]
        }
        result.placeName = feature.place_name
        result.locationType = feature.place_type[0]
        results.push(result)
    }
    out.results = results
    return out
}

const _handleError = error => {
    var out = {}
    console.log('query error occurred')
    out.error = error
    return out
}

export default function geocodeQuery(query, types) {
    if (!query) {
        return new Promise(function(resolve, reject) {
            resolve()
        })
    }

    var args = {
        query: query,
        limit: 5,
        types: ['place', 'address']
    }
    if (types) args.types = types

    if (typeof query === 'object') {
        return geocodingService
            .reverseGeocode(args)
            .send()
            .then(
                response => _handleResponse(response),
                error => _handleError(error)
            )
    } else if (typeof query === 'string') {
        return geocodingService
            .forwardGeocode(args)
            .send()
            .then(
                response => _handleResponse(response),
                error => _handleError(error)
            )
    }
}

export function artefactGeocodeQuery(artefact) {
    return geocodeQuery(artefact.address).then(response => {
        return { artefact: artefact, response: response }
    })
}
