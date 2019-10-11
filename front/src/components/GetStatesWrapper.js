import React, { useState } from 'react'
import ArtefactView from '../views/ArtefactView'
import { Layout } from '../components'
import { useQuery } from '@apollo/react-hooks'

import { GET_ARTEFACT_STATES_QUERY } from '../gqlQueriesMutations'

export default function GetStatesWrapper({
    child: Child,
    childProps,
    ...rest
}) {
    // get artefact states
    const [artefactStates, setArtefactStates] = useState({})
    const _saveArtefactStates = async statesData => {
        var temp = {}
        var desc
        var state
        for (var i in statesData.__type.enumValues) {
            state = statesData.__type.enumValues[i]
            desc = state.description
            temp[desc] = state.name
        }
        setArtefactStates(temp)
    }
    const { loading } = useQuery(GET_ARTEFACT_STATES_QUERY, {
        variables: {
            name: 'ArtefactState'
        },
        onCompleted: _saveArtefactStates,
        onError: error => console.log(error)
    })

    var thisChildProps = {
        ...childProps,
        artefactStates: artefactStates,
        statesLoading: loading
    }

    return <Child {...rest} {...thisChildProps} />
}
