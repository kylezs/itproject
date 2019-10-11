import React, { useState } from 'react'
import ArtefactView from './ArtefactView'
import { Layout } from '../components'
import { useQuery } from '@apollo/react-hooks'

import {
    GET_ARTEFACT_STATES_QUERY,
    GET_FAMILIES_QUERY
} from '../gqlQueriesMutations'

export default function EditArtefactView(props) {
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
    const { loading: statesLoading } = useQuery(GET_ARTEFACT_STATES_QUERY, {
        variables: {
            name: 'ArtefactState'
        },
        onCompleted: _saveArtefactStates,
        onError: error => console.log(error)
    })

    // get users families
    const [families, setFamilies] = useState([])
    const { loading: familyLoading } = useQuery(GET_FAMILIES_QUERY, {
        onCompleted: data => setFamilies(data.me.isMemberOf),
        onError: error => console.log(error)
    })

    return (
        <Layout>
            <ArtefactView
                mode={'create'}
                families={families}
                familyLoading={familyLoading}
                artefactStates={artefactStates}
                statesLoading={statesLoading}
            />
        </Layout>
    )
}
