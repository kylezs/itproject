import React, { useState } from 'react'
import ArtefactView from './ArtefactView'
import { useQuery } from '@apollo/react-hooks'
import { ARTEFACT_DETAIL } from '../gqlQueriesMutations'
import { Layout, Loading } from '../components'

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

    const [artefact, setArtefact] = useState({})

    // get artefact details
    const _genericHandleError = async errors => {
        console.log(errors)
    }

    const _saveArtefact = async data => {
        setArtefact(data.artefact)
        console.log('Artefact:', data.artefact)
    }

    const { loading: artefactLoading } = useQuery(ARTEFACT_DETAIL, {
        variables: {
            id: props.match.params.id
        },
        onCompleted: _saveArtefact,
        onError: _genericHandleError
    })

    return (
        <Layout>
            {artefactLoading || Object.keys(artefact) === 0 ? (
                <Loading />
            ) : (
                <ArtefactView
                    artefact={artefact}
                    mode={'edit'}
                    families={families}
                    familyLoading={familyLoading}
                    artefactStates={artefactStates}
                    statesLoading={statesLoading}
                />
            )}
        </Layout>
    )
}
