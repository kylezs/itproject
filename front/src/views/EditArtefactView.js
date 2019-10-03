import React, { useState } from 'react'
import ArtefactView from './ArtefactView'
import { useQuery } from '@apollo/react-hooks';
import { ARTEFACT_DETAIL } from '../gqlQueriesMutations'
import Loading from '../components/Loading'

export default function EditArtefactView(props) {
    const [artefact, setArtefact] = useState({})

    // get artefact details
    const _genericHandleError = async (errors) => {
        console.log(errors)
    }

    const _saveArtefact = async (data) => {
        setArtefact(data.artefact)
        console.log("Artefact:", data.artefact)
    }

    const { loading: artefactLoading } = useQuery(
        ARTEFACT_DETAIL,
        {
            variables: { id: props.match.params.id },
            onCompleted: _saveArtefact,
            onError: _genericHandleError
        }
    )
    
    if (artefactLoading){
        return <Loading />
    } else {
        return <ArtefactView artefact={artefact} mode={'edit'} />
    }
}