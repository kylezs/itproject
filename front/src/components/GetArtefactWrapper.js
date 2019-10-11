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

    // get artefact details
    const [artefact, setArtefact] = useState({})

    const { loading } = useQuery(ARTEFACT_DETAIL, {
        variables: {
            id: rest.match.params.id
        },
        onCompleted: data => setArtefact(data.artefact),
        onError: error => console.log(error)
    })

    var thisChildProps = {
        ...childProps,
        artefact: artefact,
        artefactLoading: loading,
        isAdmin: artefact.admin && artefact.admin.username === username
    }

    return <Child {...rest} {...thisChildProps} />
}
