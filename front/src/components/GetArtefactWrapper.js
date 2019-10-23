import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ARTEFACT_DETAIL } from '../gqlQueriesMutations'

export default function GetArtefactWrapper({
    child: Child,
    childProps,
    ...rest
}) {
    const { data, loading } = useQuery(ARTEFACT_DETAIL, {
        variables: {
            id: rest.match.params.id
        },
        onError: error => console.error(error),
    })

    var thisChildProps = {
        ...childProps,
        artefactData: data,
        artefactLoading: loading,
    }

    return <Child {...rest} {...thisChildProps} />
}
