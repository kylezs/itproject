/**
 * The parent component must provide via props "match" as used by the Route react
 * component so the artefact ID can be found in the URL.
 *
 * @summary A wrapper component that provides details for the artefact in
 * the URL via props
 * @author Zane Duffield
 *
 * Last modified  : 2019-10-26 17:52:21
 */

import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ARTEFACT_DETAIL } from '../gqlQueriesMutations'

export default function GetArtefactWrapper({
    child: Child,
    childProps,
    ...rest
}) {
    const { loading, error: fetchError, data } = useQuery(ARTEFACT_DETAIL, {
        onError: error => console.error('Error fetching artefact: ', error),
        variables: {
            id: rest.match.params.id
        }
    })

    var thisChildProps = {
        ...childProps,
        artefactData: data,
        artefactLoading: loading,
        fetchError: fetchError
    }

    return <Child {...rest} {...thisChildProps} />
}
