import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ARTEFACT_DETAIL } from '../gqlQueriesMutations'

export default function GetArtefactWrapper({
    child: Child,
    childProps,
    ...rest
}) {

    const {loading, error:fetchError, data } = useQuery(ARTEFACT_DETAIL, {
        onError: error => console.error("Error fetching artefact: ", error),
        variables: {
            id: rest.match.params.id
        },
    })

    var thisChildProps = {
        ...childProps,
        artefactData: data,
        artefactLoading: loading,
        fetchError: fetchError
    }

    return <Child {...rest} {...thisChildProps} />
}
