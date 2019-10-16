import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ARTEFACT_DETAIL } from '../gqlQueriesMutations'
import authContext from '../authContext'

export default function GetArtefactWrapper({
    child: Child,
    childProps,
    ...rest
}) {
    const context = useContext(authContext)
    const username = context.user.username

    const { data, loading } = useQuery(ARTEFACT_DETAIL, {
        variables: {
            id: rest.match.params.id
        },
        onError: error => console.log(error)
    })

    var thisChildProps = {
        ...childProps,
        artefactData: data,
        artefactLoading: loading,
    }

    return <Child {...rest} {...thisChildProps} />
}
